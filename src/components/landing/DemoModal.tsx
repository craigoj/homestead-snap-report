import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal = ({ isOpen, onClose }: DemoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
        <div className="relative bg-black rounded-2xl overflow-hidden">
          <DialogHeader className="absolute top-4 left-4 z-10">
            <DialogTitle className="text-white text-lg font-semibold">
              SnapAssetAI Demo - See it in Action
            </DialogTitle>
          </DialogHeader>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Video Placeholder - Replace with actual video */}
          <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Play className="w-8 h-8 ml-1" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Demo Video Coming Soon</h3>
              <p className="text-white/70">
                Watch how SnapAssetAI helps you catalog your entire home in minutes
              </p>
              <Button 
                className="btn-premium mt-6"
                onClick={() => {
                  onClose();
                  window.location.href = '/auth';
                }}
              >
                Try It Now - Free
              </Button>
            </div>
          </div>

          {/* You can replace the placeholder above with an actual video embed like: */}
          {/*
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="SnapAssetAI Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          */}
        </div>
      </DialogContent>
    </Dialog>
  );
};