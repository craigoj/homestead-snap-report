import React from 'react';
import { Camera, Upload, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type ScanMode = 'photo' | 'barcode' | 'qr';

interface ScanModeToggleProps {
  mode: ScanMode;
  onModeChange: (mode: ScanMode) => void;
  disabled?: boolean;
  className?: string;
}

export function ScanModeToggle({ 
  mode, 
  onModeChange, 
  disabled = false,
  className = "" 
}: ScanModeToggleProps) {
  const modes = [
    {
      id: 'photo' as ScanMode,
      label: 'Photo',
      description: 'Take photos for OCR analysis',
      icon: <Camera className="h-4 w-4" />,
      badge: 'Default'
    },
    {
      id: 'barcode' as ScanMode,
      label: 'Barcode',
      description: 'Scan product barcodes',
      icon: <Upload className="h-4 w-4" />,
      badge: 'New'
    },
    {
      id: 'qr' as ScanMode,
      label: 'QR Code',
      description: 'Scan QR codes',
      icon: <QrCode className="h-4 w-4" />,
      badge: 'Beta'
    }
  ];

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Capture Mode</h3>
          
          <div className="grid grid-cols-1 gap-2">
            {modes.map((modeOption) => (
              <Button
                key={modeOption.id}
                variant={mode === modeOption.id ? 'default' : 'outline'}
                size="sm"
                className="justify-start h-auto p-3 relative"
                onClick={() => onModeChange(modeOption.id)}
                disabled={disabled}
              >
                <div className="flex items-center gap-3 w-full">
                  {modeOption.icon}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{modeOption.label}</span>
                      {modeOption.badge && (
                        <Badge 
                          variant={mode === modeOption.id ? 'secondary' : 'outline'} 
                          className="text-xs"
                        >
                          {modeOption.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs opacity-80 mt-1">
                      {modeOption.description}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground">
            {mode === 'photo' && (
              <p>Take photos of items for automatic text recognition and data extraction.</p>
            )}
            {mode === 'barcode' && (
              <p>Scan product barcodes to automatically lookup product information.</p>
            )}
            {mode === 'qr' && (
              <p>Scan QR codes to extract embedded information and links.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}