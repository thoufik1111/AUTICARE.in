// Question banks for each role
// Exactly as specified in requirements

import { QuestionWeight } from '@/utils/scoring';

export interface Question {
  id: string;
  text: string;
  category: QuestionWeight['category'];
}

// Individual role questions (15 questions)
export const individualQuestions: Question[] = [
  {
    id: 'ind_1',
    text: 'I find it difficult to make eye contact during conversations',
    category: 'social-communication',
  },
  {
    id: 'ind_2',
    text: 'I prefer to stick to familiar routines and get upset when they change',
    category: 'repetitive-sensory',
  },
  {
    id: 'ind_3',
    text: 'I have trouble understanding when someone is joking or being sarcastic',
    category: 'social-communication',
  },
  {
    id: 'ind_4',
    text: 'Certain sounds, lights, or textures bother me more than they seem to bother others',
    category: 'repetitive-sensory',
  },
  {
    id: 'ind_5',
    text: 'I find it hard to start or maintain conversations with others',
    category: 'social-communication',
  },
  {
    id: 'ind_6',
    text: 'I have specific interests that I focus on intensely',
    category: 'repetitive-sensory',
  },
  {
    id: 'ind_7',
    text: 'I struggle to understand what others are feeling just by looking at their faces',
    category: 'social-communication',
  },
  {
    id: 'ind_8',
    text: 'I prefer to do activities alone rather than with others',
    category: 'social-communication',
  },
  {
    id: 'ind_9',
    text: 'I engage in repetitive movements like hand-flapping or rocking',
    category: 'repetitive-sensory',
  },
  {
    id: 'ind_10',
    text: 'I find it difficult to adapt to new social situations',
    category: 'social-communication',
  },
  {
    id: 'ind_11',
    text: 'I have trouble knowing how to join a group conversation',
    category: 'social-communication',
  },
  {
    id: 'ind_12',
    text: 'I need things to be organized in a very specific way',
    category: 'repetitive-sensory',
  },
  {
    id: 'ind_13',
    text: 'I find it exhausting to be in social situations for long periods',
    category: 'social-communication',
  },
  {
    id: 'ind_14',
    text: 'I tend to take things literally and miss implied meanings',
    category: 'social-communication',
  },
  {
    id: 'ind_15',
    text: 'I experienced delays in learning to speak or communicate as a child',
    category: 'developmental',
  },
];

// Parent/Caregiver questions (20 questions + metadata)
export const parentQuestions: Question[] = [
  {
    id: 'par_1',
    text: 'My child avoids making eye contact with others',
    category: 'social-communication',
  },
  {
    id: 'par_2',
    text: 'My child becomes very upset when daily routines change',
    category: 'repetitive-sensory',
  },
  {
    id: 'par_3',
    text: 'My child has difficulty understanding social cues like body language or tone of voice',
    category: 'social-communication',
  },
  {
    id: 'par_4',
    text: 'My child is oversensitive to certain sounds, textures, or lights',
    category: 'repetitive-sensory',
  },
  {
    id: 'par_5',
    text: 'My child rarely initiates conversations or interactions with peers',
    category: 'social-communication',
  },
  {
    id: 'par_6',
    text: 'My child has intense, focused interests in specific topics or objects',
    category: 'repetitive-sensory',
  },
  {
    id: 'par_7',
    text: 'My child struggles to make or keep friends',
    category: 'social-communication',
  },
  {
    id: 'par_8',
    text: 'My child engages in repetitive behaviors like hand-flapping, spinning, or lining up toys',
    category: 'repetitive-sensory',
  },
  {
    id: 'par_9',
    text: 'My child has difficulty understanding emotions in themselves or others',
    category: 'social-communication',
  },
  {
    id: 'par_10',
    text: 'My child prefers to play alone rather than with other children',
    category: 'social-communication',
  },
  {
    id: 'par_11',
    text: 'My child has trouble adapting to new environments or situations',
    category: 'repetitive-sensory',
  },
  {
    id: 'par_12',
    text: 'My child rarely shares their interests or achievements with others',
    category: 'social-communication',
  },
  {
    id: 'par_13',
    text: 'My child insists on sameness and becomes distressed by small changes',
    category: 'repetitive-sensory',
  },
  {
    id: 'par_14',
    text: 'My child has difficulty with imaginative or pretend play',
    category: 'social-communication',
  },
  {
    id: 'par_15',
    text: 'My child makes unusual or repetitive vocalizations',
    category: 'repetitive-sensory',
  },
  {
    id: 'par_16',
    text: 'My child had delays in reaching developmental milestones (speaking, walking, etc.)',
    category: 'developmental',
  },
  {
    id: 'par_17',
    text: 'My child has difficulty taking turns or understanding social "rules"',
    category: 'social-communication',
  },
  {
    id: 'par_18',
    text: 'My child shows little interest in what others are doing or saying',
    category: 'social-communication',
  },
  {
    id: 'par_19',
    text: 'My child has unusual reactions to sensory experiences (seeking or avoiding)',
    category: 'repetitive-sensory',
  },
  {
    id: 'par_20',
    text: 'There is a family history of autism or related developmental conditions',
    category: 'family-history',
  },
];

export interface ParentMetadata {
  childName: string;
  childAge: string;
  pronouns: string;
  homeLanguage: string;
  schoolType: string;
  diagnosedConditions: string[];
  videoUrl?: string;
  videoPrediction?: any;
}

// Clinician structured inputs
export interface ClinicianInput {
  observedSocialReciprocity: number; // 0-4
  observedRepetitiveBehavior: number; // 0-4
  adosScore: number | null;
  adiRScore: number | null;
  clinicalNotes: string;
  uploadedFiles: File[];
}

// Generate question weights
export function getQuestionWeights(role: 'individual' | 'parent' | 'clinician'): QuestionWeight[] {
  const questions = role === 'individual' ? individualQuestions : parentQuestions;
  
  return questions.map((q) => ({
    id: q.id,
    weight: getCategoryWeight(q.category),
    category: q.category,
  }));
}

function getCategoryWeight(category: QuestionWeight['category']): number {
  switch (category) {
    case 'social-communication':
      return 2.0;
    case 'repetitive-sensory':
      return 1.5;
    case 'developmental':
      return 2.5;
    case 'family-history':
      return 6.0;
  }
}
