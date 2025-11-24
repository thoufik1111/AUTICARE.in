// Scoring utility for AutiCare questionnaire
// Maps answers to numeric values and calculates weighted scores

export type AnswerValue = 'never' | 'rarely' | 'sometimes' | 'often' | 'always';

export interface QuestionWeight {
  id: string;
  weight: number;
  category: 'social-communication' | 'repetitive-sensory' | 'developmental' | 'family-history';
}

export interface Answer {
  questionId: string;
  value: AnswerValue;
}

export interface ScoringResult {
  normalizedScore: number;
  severity: 'low' | 'mild' | 'moderate' | 'high';
  severityLabel: string;
  topContributors: Array<{
    question: string;
    contribution: number;
    action: string;
  }>;
  rawTotal: number;
  maxPossible: number;
  videoPrediction?: {
    prediction_score: number;
    confidence: number;
    features_detected?: any;
  };
  fusedScore?: number;
}

// Answer value mapping
const answerValueMap: Record<AnswerValue, number> = {
  never: 0,
  rarely: 1,
  sometimes: 2,
  often: 3,
  always: 4,
};

// Weight mappings by category
const categoryWeights = {
  'social-communication': 2.0,
  'repetitive-sensory': 1.5,
  'developmental': 2.5,
  'family-history': 6.0, // Binary flag adds fixed points
};

// Calculate score from answers
export function calculateScore(
  answers: Answer[],
  questionWeights: QuestionWeight[],
  hasFamilyHistory = false,
  videoPrediction?: { prediction_score: number; confidence: number; features_detected?: any }
): ScoringResult {
  let rawTotal = 0;
  let maxPossible = 0;

  // Calculate contributions for each answer
  const contributions: Array<{ questionId: string; contribution: number; value: number }> = [];

  answers.forEach((answer) => {
    const weight = questionWeights.find((qw) => qw.id === answer.questionId);
    if (!weight) return;

    const value = answerValueMap[answer.value];
    const contribution = value * weight.weight;
    
    rawTotal += contribution;
    maxPossible += 4 * weight.weight;

    contributions.push({
      questionId: answer.questionId,
      contribution,
      value,
    });
  });

  // Add family history bonus
  if (hasFamilyHistory) {
    rawTotal += 6;
    maxPossible += 6;
  }

  // Normalize to 0-100
  const normalizedScore = Math.round((rawTotal / maxPossible) * 100);

  // Fuse with video prediction if available
  let fusedScore = normalizedScore;
  if (videoPrediction && videoPrediction.prediction_score !== undefined) {
    // Weighted fusion: 60% questionnaire, 40% ML prediction
    // Adjust weights based on ML confidence
    const questionnaireWeight = 0.6;
    const mlWeight = 0.4 * (videoPrediction.confidence || 0.7); // Use confidence if available
    const totalWeight = questionnaireWeight + mlWeight;
    
    fusedScore = Math.round(
      (normalizedScore * questionnaireWeight + videoPrediction.prediction_score * mlWeight) / totalWeight
    );
  }

  // Determine severity based on fused score if available, otherwise use normalized score
  const scoreForSeverity = fusedScore;
  const { severity, severityLabel } = getSeverity(scoreForSeverity);

  // Get top 3 contributors
  const topContributors = contributions
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3)
    .map((c) => ({
      question: c.questionId,
      contribution: c.contribution,
      action: getActionForContributor(c.questionId, c.value),
    }));

  return {
    normalizedScore,
    severity,
    severityLabel,
    topContributors,
    rawTotal,
    maxPossible,
    videoPrediction,
    fusedScore: videoPrediction ? fusedScore : undefined,
  };
}

// Get severity level and label
function getSeverity(score: number): { severity: ScoringResult['severity']; severityLabel: string } {
  if (score < 25) {
    return { severity: 'low', severityLabel: 'Very Low (Normal)' };
  } else if (score < 40) {
    return { severity: 'mild', severityLabel: 'Low - Assessment Requested' };
  } else if (score < 60) {
    return { severity: 'moderate', severityLabel: 'Moderate - Assessment Required' };
  } else if (score < 75) {
    return { severity: 'high', severityLabel: 'High - Assessment Mandatory' };
  } else {
    return { severity: 'high', severityLabel: 'Very High - Regular Checkup Needed' };
  }
}

// Get suggested action for a contributor
function getActionForContributor(questionId: string, value: number): string {
  if (value >= 3) {
    return 'Practice in structured, supportive settings';
  } else if (value >= 2) {
    return 'Monitor and provide gentle encouragement';
  } else {
    return 'Continue current support approach';
  }
}

// Get severity theme color
export function getSeverityColor(severity: ScoringResult['severity']): string {
  const colors = {
    low: 'mint',
    mild: 'bright-blue',
    moderate: 'lavender',
    high: 'coral',
  };
  return colors[severity];
}

// Get schedule complexity based on severity
export function getScheduleComplexity(severity: ScoringResult['severity']): {
  level: string;
  taskCount: number;
  taskDuration: string;
  description: string;
} {
  switch (severity) {
    case 'low':
      return {
        level: 'Low',
        taskCount: 2,
        taskDuration: '20-40 min',
        description: 'Optional gentle tasks with flexible timing',
      };
    case 'mild':
      return {
        level: 'Medium',
        taskCount: 3,
        taskDuration: '15-20 min',
        description: 'Structured tasks with visual timers',
      };
    case 'moderate':
      return {
        level: 'Medium-High',
        taskCount: 5,
        taskDuration: '10-15 min',
        description: 'Microtasks with calming breaks and parent support',
      };
    case 'high':
      return {
        level: 'High',
        taskCount: 7,
        taskDuration: '5-12 min',
        description: 'Short microtasks with frequent breaks and clinician contact',
      };
  }
}
