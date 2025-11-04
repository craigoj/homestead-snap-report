'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuidedPromptFlow } from '@/components/jumpstart/GuidedPromptFlow';
import { getPromptsForMode } from '@/lib/jumpstart/prompts';
import { safeLocalStorage } from '@/lib/storage';
import { Zap, Trophy, Home, Loader2 } from 'lucide-react';

function JumpstartGuideContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode') || 'quick-win';

  const [mode] = useState(() => {
    const prompts = getPromptsForMode(modeParam);

    // Get mode details based on mode param
    const modeDetails = {
      'quick-win': {
        id: 'quick-win' as const,
        name: 'Quick Win',
        description: 'Perfect for getting started',
        time: '3 minutes',
        items: 3,
        value: '$2,000-5,000',
        icon: Zap,
        popular: true,
        prompts
      },
      'high-value': {
        id: 'high-value' as const,
        name: 'High-Value Hunt',
        description: 'Focus on expensive items',
        time: '5 minutes',
        items: 5,
        value: '$5,000-15,000',
        icon: Trophy,
        popular: false,
        prompts
      },
      'room-blitz': {
        id: 'room-blitz' as const,
        name: 'Room Blitz',
        description: 'Complete one room',
        time: '10 minutes',
        items: 15,
        value: '$10,000-30,000',
        icon: Home,
        popular: false,
        prompts
      }
    };

    return modeDetails[modeParam as keyof typeof modeDetails] || modeDetails['quick-win'];
  });

  const handleComplete = () => {
    router.push('/jumpstart/complete');
  };

  const handleSkip = () => {
    safeLocalStorage.setItem('jumpstart_skipped', 'true');
    router.push('/dashboard');
  };

  return (
    <GuidedPromptFlow
      mode={mode}
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
}

export default function JumpstartGuide() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <JumpstartGuideContent />
    </Suspense>
  );
}
