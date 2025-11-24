import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  email: string;
  type: 'achievement' | 'reminder' | 'appointment';
  data: {
    title: string;
    description: string;
    icon?: string;
    time?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, data }: NotificationRequest = await req.json();

    console.log(`Sending ${type} notification to ${email}`);

    let subject = '';
    let html = '';

    switch (type) {
      case 'achievement':
        subject = `🎉 New Achievement Unlocked: ${data.title}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5; text-align: center;">${data.icon || '🏆'} Achievement Unlocked!</h1>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #1F2937; margin-top: 0;">${data.title}</h2>
              <p style="color: #6B7280; font-size: 16px;">${data.description}</p>
            </div>
            <p style="color: #6B7280; text-align: center;">Keep up the great work! 💪</p>
          </div>
        `;
        break;

      case 'reminder':
        subject = `⏰ Reminder: ${data.title}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5; text-align: center;">⏰ Reminder</h1>
            <div style="background: #FEF3C7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #F59E0B;">
              <h2 style="color: #1F2937; margin-top: 0;">${data.title}</h2>
              ${data.time ? `<p style="color: #6B7280; font-size: 16px;">⏰ Scheduled for: ${data.time}</p>` : ''}
              <p style="color: #6B7280; font-size: 16px;">${data.description}</p>
            </div>
            <p style="color: #6B7280; text-align: center;">This is a friendly reminder from AutiCare 💙</p>
          </div>
        `;
        break;

      case 'appointment':
        subject = `📅 Appointment Alert: ${data.title}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5; text-align: center;">📅 Appointment Alert</h1>
            <div style="background: #DBEAFE; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #3B82F6;">
              <h2 style="color: #1F2937; margin-top: 0;">${data.title}</h2>
              ${data.time ? `<p style="color: #6B7280; font-size: 16px;">📅 Time: ${data.time}</p>` : ''}
              <p style="color: #6B7280; font-size: 16px;">${data.description}</p>
            </div>
            <p style="color: #6B7280; text-align: center;">Don't forget your upcoming appointment! 🌟</p>
          </div>
        `;
        break;
    }

    const emailResponse = await resend.emails.send({
      from: "AutiCare <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
