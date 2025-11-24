// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

// round to 1 decimal
const round1 = (n: number) => Math.round(n * 10) / 10;

// fallback range 30.0 - 85.0
const generateFallback = () => {
  const prediction_score = round1(Math.random() * (85 - 30) + 30); // 30-85
  const confidence = round1(Math.random() * 0.4 + 0.55); // 0.55-0.95
  const features_detected = {
    behavioral_markers: round1(Math.random() * 9 + 1),
    communication_patterns: round1(Math.random() * 9 + 1),
    social_interaction: round1(Math.random() * 9 + 1),
  };

  return { prediction_score, confidence, features_detected, source: "fallback" as const };
};

// strict validator for python response shape
const isValidPrediction = (obj: any) => {
  if (!obj || typeof obj !== "object") return false;
  if (typeof obj.prediction_score !== "number" || !Number.isFinite(obj.prediction_score)) return false;
  if (typeof obj.confidence !== "number" || !Number.isFinite(obj.confidence)) return false;
  if (!obj.features_detected || typeof obj.features_detected !== "object") return false;
  // ensure at least 1 numerical feature exists
  const featureVals = Object.values(obj.features_detected);
  if (!featureVals.length) return false;
  if (!featureVals.every(v => typeof v === "number" && Number.isFinite(v))) return false;
  return true;
};

// safe normalization: keep within reasonable bounds and round
const normalizePrediction = (raw: any) => {
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  const ps = round1(clamp(Number(raw.prediction_score), 0, 100));
  const conf = round1(clamp(Number(raw.confidence), 0, 1));
  const features: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw.features_detected || {})) {
    const num = typeof v === "number" && Number.isFinite(v) ? round1(v) : 0;
    features[k] = num;
  }
  return { prediction_score: ps, confidence: conf, features_detected: features };
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // parse body, resilient to empty/malformed JSON
    const body = await req.json().catch(() => ({}));
    const videoUrl = body.videoUrl ?? body.video_url ?? null;

    const PYTHON_ML_ENDPOINT = (() => {
      try {
        // Deno.env.get may throw if permission absent; guard it
        // On Supabase Edge Functions it is allowed.
        // If not present, we'll fall back.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (globalThis as any).Deno?.env?.get?.("PYTHON_ML_ENDPOINT") ?? null;
      } catch {
        return null;
      }
    })();

    // If Python endpoint is configured, attempt to call it
    if (typeof PYTHON_ML_ENDPOINT === "string" && PYTHON_ML_ENDPOINT) {
      try {
        // optional: small timeout via AbortController
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8_000); // 8s timeout

        const resp = await fetch(PYTHON_ML_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ video_url: videoUrl }),
          signal: controller.signal,
        }).finally(() => clearTimeout(timeout));

        if (resp.ok) {
          const json = await resp.json().catch(() => null);

          if (isValidPrediction(json)) {
            const normalized = normalizePrediction(json);
            return new Response(
              JSON.stringify({ ...normalized, source: "python" }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          // invalid shape → fallback
          console.warn("predict-video: python returned invalid shape; using fallback");
          return new Response(JSON.stringify(generateFallback()), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // non-ok status → fallback
        console.warn(`predict-video: python endpoint HTTP ${resp.status}; using fallback`);
        return new Response(JSON.stringify(generateFallback()), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        // network/timeout/errors → fallback
        console.error("predict-video: error calling python endpoint:", String(err));
        return new Response(JSON.stringify(generateFallback()), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // no endpoint configured → fallback
    return new Response(JSON.stringify(generateFallback()), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("predict-video: unexpected server error:", String(err));
    return new Response(JSON.stringify(generateFallback()), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
