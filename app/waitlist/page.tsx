'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Navigation } from '@/components/landing/Navigation';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/SEOHead';
import { useAssessmentState } from '@/hooks/useAssessmentState';
import { supabase } from '@/lib/supabase/client';

const Waitlist = () => {
  const { state } = useAssessmentState();
  const [position, setPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosition = async () => {
      if (!state.contactInfo?.email) return;

      try {
        const { data, error } = await supabase
          .from('waitlist')
          .select('position')
          .eq('email', state.contactInfo.email)
          .single();

        if (error) throw error;
        setPosition(data.position);
      } catch (error) {
        console.error('Error fetching waitlist position:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosition();
  }, [state.contactInfo?.email]);

  const getPriorityLabel = () => {
    if (!state.priorityLevel) return 'Standard';
    const labels = {
      1: 'Critical Priority',
      2: 'High Priority',
      3: 'Medium Priority',
      4: 'Standard',
    };
    return labels[state.priorityLevel];
  };

  const shareUrl = 'https://snapasset.ai/assessment';
  const shareText = 'I just discovered my Insurance Preparedness Score! Find out yours in 3 minutes.';

  const handleShare = (platform: string) => {
    if (typeof window === 'undefined') return;

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent('Check out this Insurance Preparedness Assessment')}&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    };

    if (platform === 'email') {
      window.location.href = urls.email;
    } else {
      window.open(urls[platform], '_blank');
    }
  };

  return (
    <>
      <SEOHead
        title="You're on the Waitlist! | SnapAsset AI"
        description="You've successfully joined the SnapAsset AI waitlist. We'll notify you when we launch."
        canonicalUrl="/waitlist"
      />

      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto space-y-12">
            {/* Success Message */}
            <div className="text-center space-y-6 animate-fade-in-up">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold">
                🎉 You're on the list!
              </h1>

              {!loading && position && (
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-6 text-center">
                      <div>
                        <div className="text-5xl font-bold text-primary mb-2">#{position}</div>
                        <p className="text-muted-foreground">Waitlist Position</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary mb-2">{getPriorityLabel()}</div>
                        <p className="text-muted-foreground">Priority Tier</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* What Happens Next */}
            <Card className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-bold">What Happens Next</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">You'll receive your full assessment results via email</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">We'll notify you when SnapAsset AI launches (priority access)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Exclusive founding member pricing (50% off first year)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Weekly tips on insurance preparedness</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Section */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Move Up the List</h2>
                  <p className="text-muted-foreground">
                    Share this assessment with friends and move up 3 spots for each referral
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleShare('twitter')}
                  >
                    <Twitter className="mr-2 h-5 w-5" />
                    Twitter
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="mr-2 h-5 w-5" />
                    Facebook
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleShare('linkedin')}
                  >
                    <Linkedin className="mr-2 h-5 w-5" />
                    LinkedIn
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleShare('email')}
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Waitlist;
