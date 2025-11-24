import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, RadialBarChart, RadialBar, Legend, PolarAngleAxis } from 'recharts';

interface ASDScoreChartProps {
  normalizedScore: number;
  mlScore?: number;
  fusedScore?: number;
}

export default function ASDScoreChart({ normalizedScore, mlScore, fusedScore }: ASDScoreChartProps) {
  const scoreData = [
    { name: 'Questionnaire', score: normalizedScore, fill: 'hsl(var(--bright-blue))' },
    ...(mlScore ? [{ name: 'ML Analysis', score: mlScore, fill: 'hsl(var(--lavender))' }] : []),
    ...(fusedScore ? [{ name: 'Final Score', score: fusedScore, fill: 'hsl(var(--primary))' }] : []),
  ];

  const severityData = [
    { severity: 'Very Low\n(<25)', range: 25, fill: 'hsl(var(--mint))', opacity: normalizedScore < 25 ? 1 : 0.3 },
    { severity: 'Low\n(25-40)', range: 15, fill: 'hsl(var(--bright-blue))', opacity: normalizedScore >= 25 && normalizedScore < 40 ? 1 : 0.3 },
    { severity: 'Moderate\n(40-60)', range: 20, fill: 'hsl(var(--lavender))', opacity: normalizedScore >= 40 && normalizedScore < 60 ? 1 : 0.3 },
    { severity: 'High\n(60-75)', range: 15, fill: 'hsl(var(--coral))', opacity: normalizedScore >= 60 && normalizedScore < 75 ? 1 : 0.3 },
    { severity: 'Very High\n(>75)', range: 25, fill: 'hsl(var(--destructive))', opacity: normalizedScore >= 75 ? 1 : 0.3 },
  ];

  const radialData = [
    {
      name: 'Score',
      value: fusedScore || normalizedScore,
      fill: fusedScore || normalizedScore < 25 ? 'hsl(var(--mint))' :
            fusedScore || normalizedScore < 40 ? 'hsl(var(--bright-blue))' :
            fusedScore || normalizedScore < 60 ? 'hsl(var(--lavender))' :
            fusedScore || normalizedScore < 75 ? 'hsl(var(--coral))' : 'hsl(var(--destructive))',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Score Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              score: {
                label: 'Score',
                color: 'hsl(var(--primary))',
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: 'Score',
                color: 'hsl(var(--primary))',
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="30%" 
                outerRadius="90%" 
                data={radialData}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                  fill={radialData[0].fill}
                />
                <Legend
                  iconSize={10}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  content={() => (
                    <div className="text-center mt-2">
                      <p className="text-2xl font-bold">{(fusedScore || normalizedScore).toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">Current Score</p>
                    </div>
                  )}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Severity Ranges</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              range: {
                label: 'Range',
                color: 'hsl(var(--primary))',
              },
            }}
            className="h-[180px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="severity" type="category" width={80} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="range" stackId="a">
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} opacity={entry.opacity} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
