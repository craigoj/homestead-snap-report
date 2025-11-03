import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Upload, X } from 'lucide-react';
import { parseMoney } from '@/lib/numberUtils';

interface AppraisalUploadProps {
  assetId?: string;
  onAppraisalUploaded?: (data: AppraisalData) => void;
  initialData?: AppraisalData;
}

export interface AppraisalData {
  appraisalValue: number;
  appraisalDate: string;
  appraiserName: string;
  appraisalDocumentPath?: string;
}

export const AppraisalUpload = ({ assetId, onAppraisalUploaded, initialData }: AppraisalUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [appraisalData, setAppraisalData] = useState<AppraisalData>(
    initialData || {
      appraisalValue: 0,
      appraisalDate: '',
      appraiserName: '',
    }
  );
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(initialData?.appraisalDocumentPath || null);

  const handleDocumentUpload = async (file: File) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to upload documents.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file type (PDF, images)
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF, JPG, or PNG file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload a file under 10MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `appraisal_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to receipts bucket (we can reuse this for appraisals)
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setUploadedDoc(filePath);
      toast({
        title: 'Document Uploaded',
        description: 'Appraisal document uploaded successfully.',
      });

      if (assetId) {
        // Update asset with appraisal document path
        const { error: updateError } = await supabase
          .from('assets')
          .update({ appraisal_document_path: filePath })
          .eq('id', assetId);

        if (updateError) throw updateError;
      }

      if (onAppraisalUploaded) {
        onAppraisalUploaded({ ...appraisalData, appraisalDocumentPath: filePath });
      }
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        handleDocumentUpload(files[0]);
      }
    };
    input.click();
  };

  const handleSave = async () => {
    if (!assetId) {
      if (onAppraisalUploaded) {
        onAppraisalUploaded(appraisalData);
      }
      return;
    }

    // Sanitize appraisal value
    const sanitizedValue = parseMoney(appraisalData.appraisalValue);
    if (sanitizedValue === null) {
      toast({
        title: 'Invalid Value',
        description: 'Appraised value must be between $0 and $999,999,999',
        variant: 'destructive',
      });
      return;
    }

    console.log('Sanitized appraisal before update:', { appraisal_value: sanitizedValue });

    setUploading(true);
    try {
      const { error } = await supabase
        .from('assets')
        .update({
          appraisal_value: sanitizedValue,
          appraisal_date: appraisalData.appraisalDate,
          appraiser_name: appraisalData.appraiserName,
        })
        .eq('id', assetId);

      if (error) throw error;

      toast({
        title: 'Appraisal Saved',
        description: 'Appraisal information saved successfully.',
      });

      if (onAppraisalUploaded) {
        onAppraisalUploaded(appraisalData);
      }
    } catch (error: any) {
      console.error('Error saving appraisal:', error);
      toast({
        title: 'Save Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Appraisal Information</h3>
        </div>

        <div>
          <Label htmlFor="appraisalValue">Appraised Value *</Label>
          <Input
            id="appraisalValue"
            type="number"
            step="0.01"
            min="0"
            max="999999999"
            value={appraisalData.appraisalValue || ''}
            onChange={(e) =>
              setAppraisalData({ ...appraisalData, appraisalValue: parseFloat(e.target.value) || 0 })
            }
            placeholder="$0.00"
          />
        </div>

        <div>
          <Label htmlFor="appraisalDate">Appraisal Date *</Label>
          <Input
            id="appraisalDate"
            type="date"
            value={appraisalData.appraisalDate}
            onChange={(e) => setAppraisalData({ ...appraisalData, appraisalDate: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="appraiserName">Appraiser Name/Company *</Label>
          <Input
            id="appraiserName"
            value={appraisalData.appraiserName}
            onChange={(e) => setAppraisalData({ ...appraisalData, appraiserName: e.target.value })}
            placeholder="e.g., Johnson Appraisals LLC"
          />
        </div>

        <div>
          <Label>Appraisal Document (Optional)</Label>
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileSelect}
            disabled={uploading}
            className="w-full mt-2"
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploadedDoc ? 'Change Document' : 'Upload Document'}
          </Button>
          {uploadedDoc && (
            <p className="text-sm text-muted-foreground mt-2">
              ✓ Document uploaded
            </p>
          )}
        </div>

        {assetId && (
          <Button onClick={handleSave} disabled={uploading} className="w-full">
            {uploading ? 'Saving...' : 'Save Appraisal'}
          </Button>
        )}
      </div>
    </Card>
  );
};
