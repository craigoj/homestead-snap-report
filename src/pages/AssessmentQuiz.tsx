import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProgressBar } from '@/components/assessment/ProgressBar';
import { QuestionCard } from '@/components/assessment/QuestionCard';
import { AnswerOption } from '@/components/assessment/AnswerOption';
import { useAssessmentState } from '@/hooks/useAssessmentState';
import { assessmentQuestions } from '@/lib/assessmentQuestions';
import { calculateFullScore } from '@/lib/scoreCalculator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/SEOHead';

const AssessmentQuiz = () => {
  const navigate = useNavigate();
  const { state, setContactInfo, setAnswer, nextStep, prevStep, setScore } = useAssessmentState();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = assessmentQuestions.length + 1; // +1 for contact info
  const isContactStep = state.currentStep === 0;
  const currentQuestion = !isContactStep ? assessmentQuestions[state.currentStep - 1] : null;
  const currentAnswer = currentQuestion ? state.answers[currentQuestion.id] : null;
  const canProceed = isContactStep ? (firstName && email && email.includes('@')) : currentAnswer;

  // Auto-detect location (simplified - in production use IP geolocation API)
  useEffect(() => {
    if (isContactStep && !state.contactInfo) {
      // Simple default - in production, use a geolocation service
      const location = 'United States';
      // Store for later use
    }
  }, [isContactStep, state.contactInfo]);

  const handleContactSubmit = () => {
    if (!firstName || !email) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    
    setContactInfo({
      firstName,
      email,
      phone: phone || undefined,
      location: 'United States', // Simplified
    });
    nextStep();
  };

  const handleAnswerSelect = (value: string) => {
    if (currentQuestion) {
      setAnswer(currentQuestion.id, value);
    }
  };

  const handleNext = () => {
    if (isContactStep) {
      handleContactSubmit();
    } else if (state.currentStep === totalSteps - 1) {
      // Last question - submit
      handleSubmit();
    } else {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Calculate score
      const scoreResult = calculateFullScore(state.answers);
      setScore(scoreResult.score, scoreResult.segment, scoreResult.priorityLevel);
      
      // Save to Supabase
      const { error: assessmentError } = await supabase
        .from('assessment_submissions')
        .insert({
          email: state.contactInfo!.email,
          full_name: state.contactInfo!.firstName,
          phone: state.contactInfo?.phone,
          location: state.contactInfo!.location,
          score: scoreResult.score,
          responses: state.answers,
          segment: scoreResult.segment,
          priority_level: scoreResult.priorityLevel,
        });

      if (assessmentError) throw assessmentError;

      // Send assessment results email
      try {
        const { generateInsights } = await import('@/lib/resultGenerator');
        const insights = generateInsights(scoreResult.score, scoreResult.segment, state.answers);
        
        await supabase.functions.invoke('send-email', {
          body: {
            to: state.contactInfo!.email,
            subject: `Your Insurance Preparedness Score: ${scoreResult.score}/100`,
            template: 'assessment-results',
            templateData: {
              firstName: state.contactInfo!.firstName,
              score: scoreResult.score,
              segment: scoreResult.segment,
              insights: insights,
              resultsUrl: `${window.location.origin}/assessment/results`,
            },
          },
        });
        console.log('Assessment results email sent');
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't block navigation if email fails
      }

      // Navigate to results
      navigate('/assessment/results');
    } catch (error: any) {
      console.error('Error submitting assessment:', error);
      toast({
        title: 'Error submitting assessment',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Insurance Preparedness Quiz | SnapAsset AI"
        description="Complete our comprehensive assessment to discover your insurance preparedness level and get personalized recommendations."
        canonicalUrl="/assessment/quiz"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <ProgressBar currentStep={state.currentStep} totalSteps={totalSteps} />

          {isContactStep ? (
            <Card className="animate-fade-in">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Let's Get Started</h2>
                  <p className="text-muted-foreground">
                    First, we need a few details to personalize your assessment results.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <QuestionCard question={currentQuestion!.question}>
              {currentQuestion!.options.map((option) => (
                <AnswerOption
                  key={option.value}
                  text={option.text}
                  value={option.value}
                  selected={currentAnswer === option.value}
                  onSelect={handleAnswerSelect}
                />
              ))}
            </QuestionCard>
          )}

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={state.currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
            >
              {state.currentStep === totalSteps - 1 ? 'Submit Assessment' : 'Next'}
              {state.currentStep < totalSteps - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssessmentQuiz;
