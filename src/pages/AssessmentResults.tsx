import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Share2 } from 'lucide-react';
import { ScoreCircle } from '@/components/assessment/ScoreCircle';
import { InsightCard } from '@/components/assessment/InsightCard';
import { WaitlistCTA } from '@/components/assessment/WaitlistCTA';
import { useAssessmentState } from '@/hooks/useAssessmentState';
import { getSegmentConfig, generateInsights, generateCTA, getUrgencyMessage, getTestimonial } from '@/lib/resultGenerator';
import { Navigation } from '@/components/landing/Navigation';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AssessmentResults = () => {
  const navigate = useNavigate();
  const { state } = useAssessmentState();

  if (!state.segment || state.score === 0) {
    navigate('/assessment/quiz');
    return null;
  }

  const segmentConfig = getSegmentConfig(state.segment);
  const insights = generateInsights(state.score, state.segment, state.answers);
  const ctaData = generateCTA(state.answers);
  const urgencyMessage = getUrgencyMessage(state.score, state.answers);
  const testimonial = getTestimonial(state.answers);

  const handleJoinWaitlist = async () => {
    try {
      // Get the assessment ID first
      const { data: assessment } = await supabase
        .from('assessment_submissions')
        .select('id')
        .eq('email', state.contactInfo!.email)
        .single();

      if (!assessment) throw new Error('Assessment not found');

      // Add to waitlist
      const { error } = await supabase
        .from('waitlist')
        .insert({
          assessment_id: assessment.id,
          email: state.contactInfo!.email,
          priority_tier: state.segment,
        });

      if (error) throw error;

      // Get the waitlist entry to find position
      const { data: waitlistEntry } = await supabase
        .from('waitlist')
        .select('position, priority_tier')
        .eq('email', state.contactInfo!.email)
        .single();

      // Send waitlist confirmation email
      if (waitlistEntry) {
        try {
          await supabase.functions.invoke('send-email', {
            body: {
              to: state.contactInfo!.email,
              subject: `You're on the SnapAsset AI Waitlist - Position #${waitlistEntry.position}`,
              template: 'waitlist-confirmation',
              templateData: {
                firstName: state.contactInfo!.firstName,
                position: waitlistEntry.position,
                priorityTier: waitlistEntry.priority_tier,
                email: state.contactInfo!.email,
              },
            },
          });
          console.log('Waitlist confirmation email sent');
        } catch (emailError) {
          console.error('Error sending waitlist email:', emailError);
        }
      }

      toast({
        title: 'Welcome to the waitlist!',
        description: 'Check your email for confirmation and next steps.',
      });

      navigate('/waitlist');
    } catch (error: any) {
      console.error('Error joining waitlist:', error);
      toast({
        title: 'Error joining waitlist',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <SEOHead
        title="Your Insurance Preparedness Results | SnapAsset AI"
        description="See your personalized insurance preparedness score and get recommendations to protect your home assets."
        canonicalUrl="/assessment/results"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 py-16 space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-6 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold">
              Your Insurance Preparedness Score
            </h1>
            
            <div className="flex flex-col items-center gap-6">
              <ScoreCircle
                score={state.score}
                maxScore={100}
                className={segmentConfig.circleColor}
              />
              
              <Badge className={segmentConfig.badgeColor + ' text-lg px-6 py-2 border-2'}>
                {segmentConfig.badge}
              </Badge>
              
              <p className="text-muted-foreground text-lg">
                {segmentConfig.comparison}
              </p>
            </div>
          </section>

          {/* Urgency Alert */}
          {urgencyMessage && (
            <Card className="border-2 border-destructive bg-destructive/5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <CardContent className="p-6">
                <p className="text-lg font-semibold text-center">{urgencyMessage}</p>
              </CardContent>
            </Card>
          )}

          {/* Insights */}
          <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h2 className="text-3xl font-bold text-center">Your Personalized Insights</h2>
            <div className="grid gap-6">
              {insights.map((insight, index) => (
                <InsightCard
                  key={index}
                  title={insight.title}
                  description={insight.description}
                  index={index}
                />
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <WaitlistCTA ctaData={ctaData} onJoinWaitlist={handleJoinWaitlist} />
          </section>

          {/* Secondary Actions */}
          <section className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <Button variant="outline" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download Results (PDF)
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="mr-2 h-5 w-5" />
              Share Results
            </Button>
          </section>

          {/* Testimonial */}
          <Card className="max-w-2xl mx-auto bg-muted/50 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
            <CardContent className="p-8 space-y-4">
              <p className="text-lg italic text-foreground">"{testimonial.quote}"</p>
              <div className="text-sm text-muted-foreground">
                <div className="font-semibold">{testimonial.author}</div>
                <div>{testimonial.role}</div>
              </div>
            </CardContent>
          </Card>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AssessmentResults;
