import { assessmentQuestions } from './assessmentQuestions';

export type ScoreSegment = 'critical' | 'high-risk' | 'moderate' | 'prepared';

export interface ScoreResult {
  score: number;
  segment: ScoreSegment;
  priorityLevel: 1 | 2 | 3 | 4;
}

export const calculateScore = (answers: Record<string, string>): number => {
  // Only questions 1-10 contribute to score
  const scoringQuestions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
  
  let totalScore = 0;
  
  scoringQuestions.forEach(qId => {
    const answer = answers[qId];
    if (!answer) return;
    
    const question = assessmentQuestions.find((q: any) => q.id === qId);
    if (!question) return;
    
    const option = question.options.find((opt: any) => opt.value === answer);
    if (option) {
      totalScore += option.points;
    }
  });
  
  return totalScore;
};

export const getSegment = (score: number): ScoreSegment => {
  if (score <= 30) return 'critical';
  if (score <= 55) return 'high-risk';
  if (score <= 75) return 'moderate';
  return 'prepared';
};

export const calculatePriorityLevel = (
  score: number,
  answers: Record<string, string>
): 1 | 2 | 3 | 4 => {
  const q11 = answers.q11;
  const q14 = answers.q14;
  const q15 = answers.q15;
  
  // Priority 1 (Highest)
  if (
    score < 30 ||
    q11 === 'claim_victim' ||
    q14 === 'done_for_you' ||
    ['500_1000', '1000_plus', 'no_factor'].includes(q15) ||
    (q11 === 'property_manager' || q11 === 'portfolio_owner')
  ) {
    return 1;
  }
  
  // Priority 2 (High)
  if (
    (score >= 31 && score <= 55) ||
    q14 === 'guided' ||
    ['100_200', '200_500'].includes(q15) ||
    q11 === 'long_term'
  ) {
    return 2;
  }
  
  // Priority 3 (Medium)
  if (
    (score >= 56 && score <= 75) ||
    q14 === 'diy_app' ||
    ['50_100'].includes(q15)
  ) {
    return 3;
  }
  
  // Priority 4 (Low)
  return 4;
};

export const calculateFullScore = (answers: Record<string, string>): ScoreResult => {
  const score = calculateScore(answers);
  const segment = getSegment(score);
  const priorityLevel = calculatePriorityLevel(score, answers);
  
  return { score, segment, priorityLevel };
};
