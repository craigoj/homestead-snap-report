'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SignatureCapture } from '@/components/SignatureCapture';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

const ProofOfLoss = () => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    insurerName: '',
    policyNumber: '',
    claimNumber: '',
    swornStatement: `I, the undersigned, hereby swear and affirm that the information provided in this Proof of Loss is true and accurate to the best of my knowledge. The losses claimed represent actual damages sustained, and I have provided complete documentation of all affected property.`,
    signatureData: '',
  });

  const handleSubmit = async () => {
    if (!eventId) {
      sonnerToast.error('No loss event ID provided');
      return;
    }

    if (!formData.signatureData) {
      sonnerToast.error('Please provide your signature');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-proof-of-loss', {
        body: {
          lossEventId: eventId,
          formData,
        },
      });

      if (error) throw error;

      sonnerToast.success('Proof of Loss form submitted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting proof of loss:', error);
      sonnerToast.error('Failed to submit proof of loss form');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Insurance Information</h2>
            <div>
              <Label htmlFor="insurerName">Insurance Company Name *</Label>
              <Input
                id="insurerName"
                value={formData.insurerName}
                onChange={(e) => setFormData({ ...formData, insurerName: e.target.value })}
                placeholder="e.g., State Farm, Allstate"
                required
              />
            </div>
            <div>
              <Label htmlFor="policyNumber">Policy Number *</Label>
              <Input
                id="policyNumber"
                value={formData.policyNumber}
                onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                placeholder="Your policy number"
                required
              />
            </div>
            <div>
              <Label htmlFor="claimNumber">Claim Number (if assigned)</Label>
              <Input
                id="claimNumber"
                value={formData.claimNumber}
                onChange={(e) => setFormData({ ...formData, claimNumber: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Sworn Statement</h2>
            <p className="text-sm text-muted-foreground">
              Review and edit the sworn statement below. This is a legal declaration of the accuracy of your claim.
            </p>
            <div>
              <Label htmlFor="swornStatement">Sworn Statement *</Label>
              <Textarea
                id="swornStatement"
                value={formData.swornStatement}
                onChange={(e) => setFormData({ ...formData, swornStatement: e.target.value })}
                rows={8}
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Signature</h2>
            <p className="text-sm text-muted-foreground">
              Sign below to certify that all information provided is true and accurate.
            </p>
            <SignatureCapture
              onSave={(signature) => {
                setFormData({ ...formData, signatureData: signature });
                sonnerToast.success('Signature saved');
              }}
            />
            {formData.signatureData && (
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm text-green-600 font-medium">✓ Signature captured</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Proof of Loss Form
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete this form to file your insurance claim. All steps are required.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`h-1 w-24 mx-2 ${s < step ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Insurance Info</span>
            <span>Sworn Statement</span>
            <span>Signature</span>
          </div>
        </div>

        <Card className="p-6">
          {renderStep()}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Proof of Loss'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ProofOfLoss;
