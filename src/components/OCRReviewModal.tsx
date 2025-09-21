import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertCircle, XCircle, Edit3, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OCRResult {
  title: string;
  description: string;
  brand: string;
  model: string;
  serial_number: string;
  category: string;
  estimated_value: number;
  confidence: number;
  extracted_text: string;
  provider?: string;
  raw_text?: string;
  metadata?: {
    text_confidence: number;
    structure_confidence: number;
    image_quality: number;
    providers_used: string[];
  };
}

interface OCRReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  ocrResult: OCRResult;
  imageUrl: string;
  onAccept: (correctedResult: OCRResult) => void;
  onReject: () => void;
}

export function OCRReviewModal({ 
  isOpen, 
  onClose, 
  ocrResult, 
  imageUrl, 
  onAccept, 
  onReject 
}: OCRReviewModalProps) {
  const [editedResult, setEditedResult] = useState<OCRResult>(ocrResult);
  const [editingField, setEditingField] = useState<string | null>(null);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (confidence >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle className="h-4 w-4" />;
    if (confidence >= 50) return <AlertCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const handleFieldEdit = (field: keyof OCRResult, value: string | number) => {
    setEditedResult(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccept = () => {
    onAccept(editedResult);
    onClose();
  };

  const renderEditableField = (
    field: keyof OCRResult, 
    label: string, 
    value: string | number,
    confidence?: number,
    multiline = false
  ) => {
    const isEditing = editingField === field;
    const fieldConfidence = confidence || ocrResult.confidence;
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-medium">{label}</Label>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn("text-xs", getConfidenceColor(fieldConfidence))}
            >
              {getConfidenceIcon(fieldConfidence)}
              {fieldConfidence}%
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingField(isEditing ? null : field)}
              className="h-6 w-6 p-0"
            >
              {isEditing ? <Save className="h-3 w-3" /> : <Edit3 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2">
            {multiline ? (
              <Textarea
                value={value}
                onChange={(e) => handleFieldEdit(field, e.target.value)}
                className="flex-1"
                rows={3}
              />
            ) : (
              <Input
                value={value}
                onChange={(e) => handleFieldEdit(field, field === 'estimated_value' ? parseFloat(e.target.value) || 0 : e.target.value)}
                className="flex-1"
                type={field === 'estimated_value' ? 'number' : 'text'}
              />
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingField(null)}
              className="px-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div 
            className={cn(
              "p-3 rounded-md border cursor-pointer hover:bg-gray-50 transition-colors",
              getConfidenceColor(fieldConfidence)
            )}
            onClick={() => setEditingField(field)}
          >
            {value || <span className="text-muted-foreground italic">Not detected</span>}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            OCR Review & Correction
            <Badge variant="outline" className="ml-2">
              {ocrResult.provider || 'Unknown'} Provider
            </Badge>
            <Badge 
              variant="outline" 
              className={getConfidenceColor(ocrResult.confidence)}
            >
              {getConfidenceIcon(ocrResult.confidence)}
              Overall: {ocrResult.confidence}%
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Image Preview */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Original Image</h3>
              <div className="relative">
                <img 
                  src={imageUrl} 
                  alt="OCR Source" 
                  className="w-full h-auto rounded-lg border"
                />
              </div>
            </Card>

            {/* Raw Text */}
            {ocrResult.raw_text && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  Raw Extracted Text
                  <Badge variant="outline" className="text-xs">
                    {ocrResult.metadata?.text_confidence || ocrResult.confidence}% confidence
                  </Badge>
                </h3>
                <div className="bg-gray-50 p-3 rounded-md text-sm font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {ocrResult.raw_text}
                </div>
              </Card>
            )}

            {/* Processing Metadata */}
            {ocrResult.metadata && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Processing Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Text Quality:</span>
                    <Badge variant="outline" className={cn("ml-2", getConfidenceColor(ocrResult.metadata.text_confidence))}>
                      {ocrResult.metadata.text_confidence}%
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Structure Quality:</span>
                    <Badge variant="outline" className={cn("ml-2", getConfidenceColor(ocrResult.metadata.structure_confidence))}>
                      {ocrResult.metadata.structure_confidence}%
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Image Quality:</span>
                    <Badge variant="outline" className={cn("ml-2", getConfidenceColor(ocrResult.metadata.image_quality))}>
                      {ocrResult.metadata.image_quality}%
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Providers:</span>
                    <span className="ml-2 text-xs font-medium">
                      {ocrResult.metadata.providers_used.join(', ')}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Extracted Information</h3>
              <div className="space-y-4">
                {renderEditableField('title', 'Title', editedResult.title)}
                {renderEditableField('description', 'Description', editedResult.description, undefined, true)}
                {renderEditableField('brand', 'Brand', editedResult.brand)}
                {renderEditableField('model', 'Model', editedResult.model)}
                {renderEditableField('serial_number', 'Serial Number', editedResult.serial_number)}
                {renderEditableField('category', 'Category', editedResult.category)}
                {renderEditableField('estimated_value', 'Estimated Value ($)', editedResult.estimated_value)}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleAccept} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept & Use
              </Button>
              <Button variant="outline" onClick={onReject} className="flex-1">
                <XCircle className="h-4 w-4 mr-2" />
                Reject & Manual Entry
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}