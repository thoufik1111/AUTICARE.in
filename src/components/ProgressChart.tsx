import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressEntry } from '@/hooks/useProgressTracking';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ProgressShare } from './ProgressShare';

interface ProgressChartProps {
  history: ProgressEntry[];
  trend: 'improving' | 'declining' | 'stable';
}

export default function ProgressChart({ history, trend }: ProgressChartProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Complete assessments to track your progress over time.
          </p>
        </CardContent>
      </Card>
    );
  }

  const recentEntries = history.slice(-5).reverse();
  const maxScore = Math.max(...history.map(e => e.score));
  const minScore = Math.min(...history.map(e => e.score));
  const avgScore = Math.round(history.reduce((acc, e) => acc + e.score, 0) / history.length);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-mint text-mint-foreground';
      case 'mild': return 'bg-bright-blue text-bright-blue-foreground';
      case 'moderate': return 'bg-lavender text-lavender-foreground';
      case 'high': return 'bg-coral text-coral-foreground';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-mint">{minScore}</div>
            <div className="text-xs text-muted-foreground">Best</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-bright-blue">{avgScore}</div>
            <div className="text-xs text-muted-foreground">Average</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-muted-foreground">{maxScore}</div>
            <div className="text-xs text-muted-foreground">Highest</div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Indicator */}
      <Card className={`border-2 ${
        trend === 'improving' ? 'border-mint bg-mint/5' :
        trend === 'declining' ? 'border-coral bg-coral/5' :
        'border-bright-blue bg-bright-blue/5'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              {trend === 'improving' && (
                <>
                  <TrendingUp className="w-5 h-5 text-mint" />
                  <span>Improving Trend</span>
                </>
              )}
              {trend === 'declining' && (
                <>
                  <TrendingDown className="w-5 h-5 text-coral" />
                  <span>Needs Attention</span>
                </>
              )}
              {trend === 'stable' && (
                <>
                  <Minus className="w-5 h-5 text-bright-blue" />
                  <span>Stable Progress</span>
                </>
              )}
            </div>
            <ProgressShare />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {trend === 'improving' && 'Great progress! Keep up the positive momentum.'}
            {trend === 'declining' && 'Consider connecting with support resources.'}
            {trend === 'stable' && 'Maintaining steady progress. Continue your routine.'}
          </p>
        </CardContent>
      </Card>

      {/* History Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assessment History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentEntries.map((entry, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex-1">
                <div className="text-sm font-medium">{entry.date}</div>
                <div className="text-xs text-muted-foreground capitalize">{entry.role}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold">{entry.score}</div>
                <Badge className={getSeverityColor(entry.severity)}>
                  {entry.severity}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
