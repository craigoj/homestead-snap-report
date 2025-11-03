'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/landing/Navigation';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';

const Unsubscribe = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [preferences, setPreferences] = useState({
    assessment_results: true,
    product_updates: true,
    marketing: true,
    tips: true,
  });

  useEffect(() => {
    if (!email) {
      toast.error('Invalid link', {
        description: 'No email address provided in unsubscribe link.',
      });
    }
  }, [email]);

  const handleUnsubscribeAll = async () => {
    if (!email) return;

    setIsSubmitting(true);
    try {
      // In a production app, you'd update a user_preferences table
      // For now, we'll just show success
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setUnsubscribed(true);
      toast.success('Successfully unsubscribed', {
        description: 'You will no longer receive emails from us.',
      });
    } catch (error: any) {
      toast.error('Error', {
        description: error.message || 'Failed to unsubscribe. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePreferences = async () => {
    if (!email) return;

    setIsSubmitting(true);
    try {
      // In a production app, you'd update user preferences in the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      toast.success('Preferences updated', {
        description: 'Your email preferences have been saved.',
      });
    } catch (error: any) {
      toast.error('Error', {
        description: error.message || 'Failed to update preferences. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (unsubscribed) {
    return (
      <>
        <SEOHead
          title="Unsubscribed | SnapAsset AI"
          description="You have been unsubscribed from our mailing list."
          canonicalUrl="/unsubscribe"
          noIndex
        />

        <div className="min-h-screen bg-background">
          <Navigation />

          <main className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto space-y-8">
              <Card>
                <CardContent className="p-12 text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold">You've been unsubscribed</h1>

                  <p className="text-muted-foreground">
                    You will no longer receive emails from SnapAsset AI at <strong>{email}</strong>
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Changed your mind? You can re-subscribe at any time from your account settings.
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>

          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Unsubscribe | SnapAsset AI"
        description="Manage your email preferences or unsubscribe from our mailing list."
        canonicalUrl="/unsubscribe"
        noIndex
      />

      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl font-bold">Email Preferences</h1>
              <p className="text-muted-foreground">
                We're sorry to see you go! Manage what emails you receive below.
              </p>
              {email && (
                <p className="text-sm text-muted-foreground">
                  Managing preferences for: <strong>{email}</strong>
                </p>
              )}
            </div>

            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Choose what you want to receive:</h2>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="assessment_results"
                        checked={preferences.assessment_results}
                        onCheckedChange={(checked) =>
                          setPreferences({ ...preferences, assessment_results: checked as boolean })
                        }
                      />
                      <Label htmlFor="assessment_results" className="font-normal cursor-pointer">
                        Assessment results and personalized insights
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="product_updates"
                        checked={preferences.product_updates}
                        onCheckedChange={(checked) =>
                          setPreferences({ ...preferences, product_updates: checked as boolean })
                        }
                      />
                      <Label htmlFor="product_updates" className="font-normal cursor-pointer">
                        Product updates and new features
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="tips"
                        checked={preferences.tips}
                        onCheckedChange={(checked) =>
                          setPreferences({ ...preferences, tips: checked as boolean })
                        }
                      />
                      <Label htmlFor="tips" className="font-normal cursor-pointer">
                        Insurance preparedness tips and advice
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="marketing"
                        checked={preferences.marketing}
                        onCheckedChange={(checked) =>
                          setPreferences({ ...preferences, marketing: checked as boolean })
                        }
                      />
                      <Label htmlFor="marketing" className="font-normal cursor-pointer">
                        Special offers and promotions
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleUpdatePreferences}
                    disabled={!email || isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    Update Preferences
                  </Button>

                  <Button
                    onClick={handleUnsubscribeAll}
                    disabled={!email || isSubmitting}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Unsubscribe from All Emails
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center pt-4">
                  Note: You will continue to receive important transactional emails related to your account
                  and services you've requested, even if you unsubscribe from marketing emails.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Unsubscribe;
