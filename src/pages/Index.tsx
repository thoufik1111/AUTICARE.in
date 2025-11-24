import { useState } from 'react';
import { Auth } from '@/components/Auth';
import RoleSelection from '@/components/RoleSelection';
import Questionnaire from '@/components/Questionnaire';
import ResultModal from '@/components/ResultModal';
import Dashboard from '@/components/Dashboard';
import CalmZone from '@/components/CalmZone';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { individualQuestions, parentQuestions, getQuestionWeights, ParentMetadata } from '@/data/questionBanks';
import { calculateScore, ScoringResult, Answer, AnswerValue } from '@/utils/scoring';
import { Sparkles } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppState = 'role-selection' | 'questionnaire' | 'results' | 'dashboard' | 'calm-zone';
type Role = 'individual' | 'parent' | 'clinician';

export default function Index() {
  const [appState, setAppState] = useState<AppState>('role-selection');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [parentMetadata, setParentMetadata] = useState<ParentMetadata | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = (authenticatedUser: User, role: string) => {
    setUser(authenticatedUser);
    setIsAuthenticated(true);
    setSelectedRole(role as Role);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setSelectedRole(null);
    setScoringResult(null);
    setParentMetadata(null);
    setAppState('role-selection');
  };

  const handleRoleSelection = (role: Role) => {
    setSelectedRole(role);
    setAppState('questionnaire');
  };

  const handleQuestionnaireComplete = (answers: Record<string, AnswerValue>, metadata?: any) => {
    if ((selectedRole === 'parent' || selectedRole === 'clinician') && metadata) {
      setParentMetadata(metadata);
    }

    const questionWeights = getQuestionWeights(selectedRole!);
    const answerArray: Answer[] = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value,
    }));

    // Check for family history in parent questionnaire
    const hasFamilyHistory = selectedRole === 'parent' && answers['par_20'] === 'always';

    // Pass video prediction if available from parent metadata
    const videoPrediction = metadata?.videoPrediction;
    const result = calculateScore(answerArray, questionWeights, hasFamilyHistory, videoPrediction);
    setScoringResult(result);
    setAppState('results');
  };

  const handleResultsClose = () => {
    setAppState('dashboard');
  };

  const handleBackToHomeFromResults = () => {
    setAppState('role-selection');
    setSelectedRole(null);
    setScoringResult(null);
    setParentMetadata(null);
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setAppState('role-selection');
    setScoringResult(null);
    setParentMetadata(null);
  };

  const handleNavigateToCalmZone = () => {
    setAppState('calm-zone');
  };

  const handleBackToDashboard = () => {
    setAppState('dashboard');
  };

  const activateDemoMode = () => {
    setDemoMode(true);
    // Demo: Individual with Low score
    const demoAnswers: Record<string, AnswerValue> = {};
    individualQuestions.forEach((q, index) => {
      // Generate low scores
      demoAnswers[q.id] = index % 3 === 0 ? 'never' : index % 3 === 1 ? 'rarely' : 'sometimes';
    });
    
    const questionWeights = getQuestionWeights('individual');
    const answerArray: Answer[] = Object.entries(demoAnswers).map(([questionId, value]) => ({
      questionId,
      value,
    }));
    
    const result = calculateScore(answerArray, questionWeights, false);
    setSelectedRole('individual');
    setScoringResult(result);
    setAppState('dashboard');
  };

  const activateDemoParent = () => {
    setDemoMode(true);
    const demoAnswers: Record<string, AnswerValue> = {};
    parentQuestions.forEach((q, index) => {
      // Generate moderate scores
      demoAnswers[q.id] = index % 2 === 0 ? 'often' : 'sometimes';
    });
    
    const questionWeights = getQuestionWeights('parent');
    const answerArray: Answer[] = Object.entries(demoAnswers).map(([questionId, value]) => ({
      questionId,
      value,
    }));
    
    const result = calculateScore(answerArray, questionWeights, true);
    setSelectedRole('parent');
    setParentMetadata({
      childName: 'Alex',
      childAge: '6 years',
      pronouns: 'they/them',
      homeLanguage: 'English',
      schoolType: 'Mainstream with support',
      diagnosedConditions: ['ADHD'],
    });
    setScoringResult(result);
    setAppState('dashboard');
  };

  const activateDemoHigh = () => {
    setDemoMode(true);
    const demoAnswers: Record<string, AnswerValue> = {};
    parentQuestions.forEach((q) => {
      // Generate high scores
      demoAnswers[q.id] = 'always';
    });
    
    const questionWeights = getQuestionWeights('parent');
    const answerArray: Answer[] = Object.entries(demoAnswers).map(([questionId, value]) => ({
      questionId,
      value,
    }));
    
    const result = calculateScore(answerArray, questionWeights, true);
    setSelectedRole('parent');
    setParentMetadata({
      childName: 'Jordan',
      childAge: '4 years',
      pronouns: 'he/him',
      homeLanguage: 'English',
      schoolType: 'Special education',
      diagnosedConditions: ['Speech delay', 'Anxiety'],
    });
    setScoringResult(result);
    setAppState('dashboard');
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen">
      {/* Logout button */}
      <div className="fixed top-4 left-4 z-50">
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Demo Mode Toggle */}
      {appState === 'role-selection' && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          <Badge variant="outline" className="bg-background">
            <Sparkles className="w-3 h-3 mr-1" />
            Demo Mode
          </Badge>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={activateDemoMode}
              className="bg-mint hover:bg-mint/90"
            >
              Demo: Low
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={activateDemoParent}
              className="bg-lavender hover:bg-lavender/90"
            >
              Demo: Moderate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={activateDemoHigh}
              className="bg-coral hover:bg-coral/90 text-white"
            >
              Demo: High
            </Button>
          </div>
        </div>
      )}

      {appState === 'role-selection' && (
        <RoleSelection onSelectRole={handleRoleSelection} />
      )}

      {appState === 'questionnaire' && selectedRole && (
        <Questionnaire
          role={selectedRole}
          questions={selectedRole === 'individual' ? individualQuestions : parentQuestions}
          onComplete={handleQuestionnaireComplete}
          onBack={handleBackToRoles}
        />
      )}

      {appState === 'results' && scoringResult && (
        <ResultModal 
          result={scoringResult} 
          onClose={handleResultsClose} 
          onBackToHome={handleBackToHomeFromResults}
          videoUrl={parentMetadata?.videoUrl}
        />
      )}

      {appState === 'dashboard' && scoringResult && selectedRole && (
        <Dashboard
          role={selectedRole}
          result={scoringResult}
          metadata={parentMetadata || undefined}
          onNavigateToCalmZone={handleNavigateToCalmZone}
        />
      )}

      {appState === 'calm-zone' && (
        <CalmZone onBack={handleBackToDashboard} />
      )}

      {/* Footer Note */}
      {(appState === 'dashboard' || appState === 'calm-zone') && (
        <div className="fixed bottom-4 left-4">
          <Button variant="ghost" size="sm" onClick={handleBackToRoles}>
            ← Start New Assessment
          </Button>
        </div>
      )}
    </div>
  );
}