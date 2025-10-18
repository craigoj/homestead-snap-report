import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SignatureCaptureProps {
  onSave: (signatureData: string) => void;
}

export const SignatureCapture = ({ onSave }: SignatureCaptureProps) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }
    const signatureData = sigCanvas.current?.toDataURL();
    if (signatureData) {
      onSave(signatureData);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Sign Below</h3>
      <div className="border-2 border-border rounded-md bg-background">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: 'w-full h-40',
            style: { touchAction: 'none' }
          }}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" onClick={clear}>
          Clear
        </Button>
        <Button onClick={save}>
          Save Signature
        </Button>
      </div>
    </Card>
  );
};
