import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, X, Flashlight, FlashlightOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeDetected: (barcode: string, type: string) => void;
  onError?: (error: Error) => void;
}

export function BarcodeScanner({ isOpen, onClose, onBarcodeDetected, onError }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [hasFlash, setHasFlash] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      initializeScanner();
    } else {
      stopScanning();
    }

    return () => stopScanning();
  }, [isOpen]);

  const initializeScanner = async () => {
    try {
      codeReader.current = new BrowserMultiFormatReader();
      
      // Get available video devices
      const videoDevices = await codeReader.current.listVideoInputDevices();
      setDevices(videoDevices);
      
      if (videoDevices.length > 0) {
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        ) || videoDevices[0];
        
        setSelectedDevice(backCamera.deviceId);
        await startScanning(backCamera.deviceId);
      }
    } catch (error) {
      console.error('Failed to initialize scanner:', error);
      onError?.(error as Error);
      toast({
        title: "Camera Error",
        description: "Failed to initialize camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const startScanning = async (deviceId?: string) => {
    if (!codeReader.current || !videoRef.current) return;

    try {
      setIsScanning(true);
      
      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: deviceId ? undefined : { ideal: 'environment' }
        }
      };

      await codeReader.current.decodeFromConstraints(
        constraints,
        videoRef.current,
        (result, error) => {
          if (result) {
            const barcodeText = result.getText();
            const format = result.getBarcodeFormat().toString();
            
            onBarcodeDetected(barcodeText, format);
            stopScanning();
            onClose();
            
            toast({
              title: "Barcode Detected",
              description: `Found ${format}: ${barcodeText}`,
            });
          }
          
          if (error && error.name !== 'NotFoundException') {
            console.error('Scanning error:', error);
          }
        }
      );

      // Check for flash capability
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        setHasFlash('torch' in capabilities);
      }
    } catch (error) {
      console.error('Failed to start scanning:', error);
      setIsScanning(false);
      onError?.(error as Error);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    setIsScanning(false);
    setFlashEnabled(false);
  };

  const toggleFlash = async () => {
    if (!videoRef.current) return;

    const stream = videoRef.current.srcObject as MediaStream;
    if (stream) {
      const track = stream.getVideoTracks()[0];
      try {
        await track.applyConstraints({
          advanced: [{ torch: !flashEnabled } as any]
        });
        setFlashEnabled(!flashEnabled);
      } catch (error) {
        console.error('Failed to toggle flash:', error);
        toast({
          title: "Flash Error",
          description: "Failed to toggle camera flash.",
          variant: "destructive"
        });
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onBarcodeDetected(manualBarcode.trim(), 'MANUAL_ENTRY');
      setManualBarcode('');
      onClose();
    }
  };

  const switchCamera = async (deviceId: string) => {
    setSelectedDevice(deviceId);
    if (isScanning) {
      stopScanning();
      await startScanning(deviceId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Barcode Scanner
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">Camera Scan</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-80 bg-muted rounded-lg object-cover"
                playsInline
                muted
              />
              
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-primary w-64 h-32 relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {hasFlash && (
                <Button
                  onClick={toggleFlash}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {flashEnabled ? (
                    <Flashlight className="h-4 w-4" />
                  ) : (
                    <FlashlightOff className="h-4 w-4" />
                  )}
                  {flashEnabled ? 'Flash On' : 'Flash Off'}
                </Button>
              )}

              {devices.length > 1 && (
                <select
                  value={selectedDevice}
                  onChange={(e) => switchCamera(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Position the barcode within the scanning area. The scanner will automatically detect and process it.
            </p>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <Label htmlFor="manual-barcode">Enter Barcode Manually</Label>
                <Input
                  id="manual-barcode"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="Enter UPC, EAN, or other barcode number"
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={!manualBarcode.trim()}>
                  Use Barcode
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Common barcode formats:</p>
              <ul className="space-y-1 ml-4">
                <li>• UPC-A: 12 digits (e.g., 012345678905)</li>
                <li>• EAN-13: 13 digits (e.g., 1234567890123)</li>
                <li>• Code 128: Variable length alphanumeric</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}