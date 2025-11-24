import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Download, Phone, Gamepad2 } from 'lucide-react';
import { ScoringResult, getScheduleComplexity } from '@/utils/scoring';
import { ParentMetadata } from '@/data/questionBanks';
import jsPDF from 'jspdf';
import TaskCard, { TaskTheme } from './TaskCard';
import MoodCheck from './MoodCheck';
import AccessibilityControls from './AccessibilityControls';
import ProgressChart from './ProgressChart';
import MiniGames from './MiniGames';
import { Reminders } from './Reminders';
import { CommunityResources } from './CommunityResources';
import { Timer } from './Timer';
import { RewardsDisplay } from './RewardsDisplay';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { useEffect, useState } from 'react';

interface DashboardProps {
  role: 'individual' | 'parent' | 'clinician';
  result: ScoringResult;
  metadata?: ParentMetadata;
  onNavigateToCalmZone: () => void;
}

export default function Dashboard({ role, result, metadata, onNavigateToCalmZone }: DashboardProps) {
  const schedule = getScheduleComplexity(result.severity);
  const { addEntry, history, getTrend } = useProgressTracking();
  const [showGames, setShowGames] = useState(false);
  
  const severityColors = {
    low: 'mint',
    mild: 'bright-blue',
    moderate: 'lavender',
    high: 'coral',
  };

  const accentColor = severityColors[result.severity];

  const tasks = generateTasks(result.severity, schedule.taskCount);
  const trend = getTrend();

  useEffect(() => {
    addEntry(result, role);
  }, []);

  if (showGames) {
    return <MiniGames onBack={() => setShowGames(false)} />;
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(11, 37, 69);
    doc.text('AutiCare Assessment Report', 20, yPos);
    yPos += 15;
    
    // Divider
    doc.setDrawColor(47, 155, 255);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    // Assessment Details
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Assessment Overview', 20, yPos);
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Score: ${result.normalizedScore}/100`, 20, yPos);
    yPos += 6;
    doc.text(`Severity: ${result.severityLabel}`, 20, yPos);
    yPos += 6;
    doc.text(`Role: ${role.charAt(0).toUpperCase() + role.slice(1)}`, 20, yPos);
    yPos += 6;
    doc.text(`Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, yPos);
    yPos += 12;
    
    if (metadata) {
      doc.setFont(undefined, 'bold');
      doc.text('Child Information', 20, yPos);
      yPos += 8;
      doc.setFont(undefined, 'normal');
      doc.text(`Name: ${metadata.childName}`, 20, yPos);
      yPos += 6;
      doc.text(`Age: ${metadata.childAge}`, 20, yPos);
      yPos += 6;
      if (metadata.pronouns) doc.text(`Pronouns: ${metadata.pronouns}`, 20, yPos);
      yPos += 6;
      if (metadata.homeLanguage) doc.text(`Home Language: ${metadata.homeLanguage}`, 20, yPos);
      yPos += 12;
    }
    
    // Contributing Factors
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('Top Contributing Factors', 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    result.topContributors.forEach((contrib, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${contrib.question} (Contribution: ${contrib.contribution.toFixed(1)})`, 170);
      doc.text(lines, 20, yPos);
      yPos += lines.length * 5 + 3;
    });
    yPos += 5;
    
    // Schedule Complexity
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('Recommended Schedule', 20, yPos);
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Complexity Level: ${schedule.level}`, 20, yPos);
    yPos += 6;
    doc.text(`Daily Tasks: ${schedule.taskCount}`, 20, yPos);
    yPos += 6;
    const scheduleDesc = doc.splitTextToSize(schedule.description, 170);
    doc.text(scheduleDesc, 20, yPos);
    yPos += scheduleDesc.length * 5 + 8;
    
    // Recommendations
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('Recommended Next Steps', 20, yPos);
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const recommendations = getRecommendations(result.severity);
    recommendations.forEach((rec, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, 170);
      doc.text(lines, 20, yPos);
      yPos += lines.length * 5 + 3;
    });
    yPos += 10;
    
    // Progress Summary
    if (history.length > 1) {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont(undefined, 'bold');
      doc.setFontSize(14);
      doc.text('Progress Summary', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      const recentEntries = history.slice(-5).reverse();
      doc.text('Recent Assessment Scores:', 20, yPos);
      yPos += 6;
      
      recentEntries.forEach((entry) => {
        doc.text(`${entry.date}: ${entry.score} (${entry.severity})`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
      
      doc.text(`Trend: ${trend === 'improving' ? 'Improving ↑' : trend === 'declining' ? 'Declining ↓' : 'Stable →'}`, 20, yPos);
      yPos += 10;
    }
    
    // Footer
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated: ${new Date().toISOString()}`, 20, yPos);
    yPos += 4;
    doc.text('This report is for informational purposes only and does not constitute medical advice.', 20, yPos);
    yPos += 4;
    doc.text('Please consult with a qualified healthcare professional for diagnosis and treatment.', 20, yPos);
    
    doc.save(`auticare-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <AccessibilityControls />
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {role === 'individual' && 'My Dashboard'}
              {role === 'parent' && `${metadata?.childName}'s Dashboard`}
              {role === 'clinician' && 'Clinical Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex gap-3">
            {result.normalizedScore > 70 && (
              <Button 
                variant="outline" 
                className="bg-lavender/10 border-lavender hover:bg-lavender/20"
                onClick={() => setShowGames(true)}
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Games
              </Button>
            )}
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            {result.severity === 'high' && (
              <Button className="bg-coral hover:bg-coral/90">
                <Phone className="w-4 h-4 mr-2" />
                Contact Clinician
              </Button>
            )}
          </div>
        </div>

        {/* Score Summary Card */}
        <Card className={`border-2 border-${accentColor}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Assessment</CardTitle>
                <CardDescription>Based on your recent evaluation</CardDescription>
              </div>
              <div className={`text-5xl font-bold text-${accentColor}`}>
                {result.normalizedScore}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Badge className={`bg-${accentColor} text-${accentColor}-foreground text-lg px-4 py-2`}>
              {result.severityLabel}
            </Badge>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Today's Schedule
                  </CardTitle>
                  <CardDescription>
                    {schedule.description}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {schedule.level} Complexity
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task, index) => (
                <TaskCard
                  key={index}
                  title={task.title}
                  description={task.description}
                  duration={task.duration}
                  completed={task.completed}
                  theme={task.theme}
                  parentTip={task.parentTip}
                  accentColor={accentColor}
                  showParentTip={role === 'parent'}
                />
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <MoodCheck result={result} />

            <Card className={`bg-${accentColor}/10 border-${accentColor}`}>
              <CardHeader>
                <CardTitle>Calm Zone</CardTitle>
                <CardDescription>
                  Take a mindful break
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className={`w-full bg-${accentColor}`}
                  onClick={onNavigateToCalmZone}
                >
                  Enter Calm Zone
                </Button>
              </CardContent>
            </Card>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Today's Progress</span>
                <span className="text-muted-foreground">2/{tasks.length}</span>
              </div>
              <Progress value={(2 / tasks.length) * 100} className="h-2" />
            </div>

            <ProgressChart history={history} trend={trend} />
          </div>
        </div>

        {/* Reminders, Timer, and Community Resources */}
        <div className="grid md:grid-cols-3 gap-6">
          <Reminders />
          <div className="space-y-6">
            <Timer />
          </div>
          <CommunityResources severity={result.severity} />
        </div>

        {/* Rewards System */}
        <RewardsDisplay />
      </div>
    </div>
  );
}

function generateTasks(severity: ScoringResult['severity'], count: number) {
  const taskPool: Array<{
    title: string;
    description: string;
    duration: string;
    parentTip: string;
    completed: boolean;
    theme: TaskTheme;
  }> = [
    {
      title: 'Morning Routine',
      description: 'Complete morning self-care activities',
      duration: '15 min',
      parentTip: 'Use visual schedule cards to help guide each step',
      completed: true,
      theme: 'morning',
    },
    {
      title: 'Sensory Break',
      description: 'Take a calming sensory break',
      duration: '10 min',
      parentTip: 'Offer fidget toys or weighted blanket',
      completed: true,
      theme: 'morning',
    },
    {
      title: 'Learning Activity',
      description: 'Engage in structured learning',
      duration: severity === 'high' ? '8 min' : '20 min',
      parentTip: 'Break into 2-minute segments with rewards',
      completed: false,
      theme: 'afternoon',
    },
    {
      title: 'Lunch & Nutrition',
      description: 'Healthy meal time',
      duration: '30 min',
      parentTip: 'Introduce new foods gradually',
      completed: false,
      theme: 'afternoon',
    },
    {
      title: 'Social Interaction',
      description: 'Practice social skills',
      duration: '12 min',
      parentTip: 'Start with one-on-one interaction',
      completed: false,
      theme: 'afternoon',
    },
    {
      title: 'Physical Activity',
      description: 'Movement and exercise',
      duration: '15 min',
      parentTip: 'Allow for breaks and water as needed',
      completed: false,
      theme: 'evening',
    },
    {
      title: 'Nature Time',
      description: 'Outdoor relaxation',
      duration: '20 min',
      parentTip: 'Let them explore at their own pace',
      completed: false,
      theme: 'evening',
    },
    {
      title: 'Quiet Time',
      description: 'Independent relaxation period',
      duration: '20 min',
      parentTip: 'Provide calming activities like coloring',
      completed: false,
      theme: 'evening',
    },
    {
      title: 'Bedtime Routine',
      description: 'Wind down for sleep',
      duration: '25 min',
      parentTip: 'Maintain consistent bedtime schedule',
      completed: false,
      theme: 'night',
    },
    {
      title: 'Story Time',
      description: 'Calming bedtime story',
      duration: '15 min',
      parentTip: 'Use predictable, favorite stories',
      completed: false,
      theme: 'night',
    },
  ];

  return taskPool.slice(0, count);
}

function getRecommendations(severity: ScoringResult['severity']): string[] {
  const recommendations = {
    low: [
      'Continue monitoring development',
      'Maintain supportive routines',
    ],
    mild: [
      'Consider scheduling a screening',
      'Document behaviors and patterns',
      'Explore supportive resources',
    ],
    moderate: [
      'Schedule comprehensive evaluation',
      'Consider early intervention services',
      'Connect with support groups',
    ],
    high: [
      'Seek clinical assessment immediately',
      'Contact healthcare provider',
      'Connect with autism specialist',
      'Explore immediate support resources',
    ],
  };

  return recommendations[severity];
}
