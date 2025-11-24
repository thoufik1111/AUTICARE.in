import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { useRewards } from "@/hooks/useRewards";
import { SocialShare } from "./SocialShare";

export function RewardsDisplay() {
  const { badges, loading } = useRewards();

  if (loading) {
    return <div className="text-center">Loading badges...</div>;
  }

  const earnedBadges = badges.filter(b => b.earned);
  const lockedBadges = badges.filter(b => !b.earned);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Your Achievements
          </div>
          {earnedBadges.length > 0 && (
            <SocialShare 
              type="achievement"
              data={{
                title: `${earnedBadges.length} Achievements Unlocked`,
                content: { badges: earnedBadges }
              }}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {earnedBadges.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Earned Badges</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.type}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-accent/50 border-2 border-primary"
                  >
                    <span className="text-4xl">{badge.icon}</span>
                    <span className="font-semibold text-sm text-center">{badge.name}</span>
                    <span className="text-xs text-muted-foreground text-center">{badge.description}</span>
                    <Badge variant="secondary" className="mt-1">Earned</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lockedBadges.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Locked Badges</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {lockedBadges.map((badge) => (
                  <div
                    key={badge.type}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30 border border-border opacity-60"
                  >
                    <span className="text-4xl grayscale">{badge.icon}</span>
                    <span className="font-semibold text-sm text-center">{badge.name}</span>
                    <span className="text-xs text-muted-foreground text-center">{badge.description}</span>
                    <Badge variant="outline" className="mt-1">Locked</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}