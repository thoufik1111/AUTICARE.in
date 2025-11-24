import { SocialShare } from "./SocialShare";
import { useProgressTracking } from "@/hooks/useProgressTracking";

export function ProgressShare() {
  const { history, getTrend } = useProgressTracking();

  if (history.length === 0) return null;

  const recentProgress = history.slice(-5);
  const trend = getTrend();

  return (
    <SocialShare 
      type="progress"
      data={{
        title: `My Progress Journey - ${trend === 'improving' ? 'Improving' : trend === 'declining' ? 'Working on it' : 'Staying steady'}`,
        content: { 
          entries: recentProgress,
          trend,
          totalEntries: history.length 
        }
      }}
    />
  );
}
