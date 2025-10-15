import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ContactInfo {
  firstName: string;
  email: string;
  phone?: string;
  location: string;
}

export interface AssessmentState {
  currentStep: number;
  answers: Record<string, string>;
  contactInfo: ContactInfo | null;
  score: number;
  segment: 'critical' | 'high-risk' | 'moderate' | 'prepared' | null;
  priorityLevel: 1 | 2 | 3 | 4 | null;
}

interface AssessmentContextType {
  state: AssessmentState;
  setContactInfo: (info: ContactInfo) => void;
  setAnswer: (questionId: string, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  setScore: (score: number, segment: AssessmentState['segment'], priority: AssessmentState['priorityLevel']) => void;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

const initialState: AssessmentState = {
  currentStep: 0,
  answers: {},
  contactInfo: null,
  score: 0,
  segment: null,
  priorityLevel: null,
};

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AssessmentState>(initialState);

  const setContactInfo = useCallback((info: ContactInfo) => {
    setState(prev => ({ ...prev, contactInfo: info }));
  }, []);

  const setAnswer = useCallback((questionId: string, value: string) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }));
  }, []);

  const setScore = useCallback((score: number, segment: AssessmentState['segment'], priority: AssessmentState['priorityLevel']) => {
    setState(prev => ({ ...prev, score, segment, priorityLevel: priority }));
  }, []);

  const resetAssessment = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <AssessmentContext.Provider
      value={{
        state,
        setContactInfo,
        setAnswer,
        nextStep,
        prevStep,
        setScore,
        resetAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessmentState = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessmentState must be used within an AssessmentProvider');
  }
  return context;
};
