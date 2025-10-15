import { ScoreSegment } from './scoreCalculator';

export interface InsightData {
  title: string;
  description: string;
}

export interface CTAData {
  heading: string;
  buttonText: string;
  benefits: string[];
}

export const getSegmentConfig = (segment: ScoreSegment) => {
  const configs = {
    critical: {
      badge: 'CRITICAL RISK',
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
      scoreColor: 'text-red-600',
      circleColor: 'stroke-red-600',
      comparison: 'You scored lower than 85% of homeowners',
    },
    'high-risk': {
      badge: 'HIGH RISK',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
      scoreColor: 'text-orange-600',
      circleColor: 'stroke-orange-600',
      comparison: 'You scored lower than 65% of homeowners',
    },
    moderate: {
      badge: 'MODERATE RISK',
      badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      scoreColor: 'text-yellow-600',
      circleColor: 'stroke-yellow-600',
      comparison: 'You scored higher than 40% of homeowners',
    },
    prepared: {
      badge: 'WELL PREPARED',
      badgeColor: 'bg-green-100 text-green-800 border-green-300',
      scoreColor: 'text-green-600',
      circleColor: 'stroke-green-600',
      comparison: 'You scored higher than 75% of homeowners',
    },
  };
  
  return configs[segment];
};

export const generateInsights = (
  score: number,
  segment: ScoreSegment,
  answers: Record<string, string>
): InsightData[] => {
  const q11 = answers.q11;
  const q12 = answers.q12;
  const q13 = answers.q13;
  
  const insights: InsightData[] = [];
  
  // Insight 1: Based on biggest obstacle (Q13)
  if (q13 === 'time_consuming') {
    insights.push({
      title: 'Your Specific Gap: Time Barrier',
      description: 'You\'re stuck in the old paradigm. Traditional home inventory takes 40+ hours. That\'s WHY 59% never complete it. SnapAsset AI completes this in 10 minutes. Your barrier just disappeared.',
    });
  } else if (q13 === 'dont_know_start') {
    insights.push({
      title: 'Your Specific Gap: Getting Started',
      description: 'The hardest part is knowing where to begin. SnapAsset AI guides you step-by-step with smart photo recognition that automatically categorizes and values your items as you scan.',
    });
  } else if (q13 === 'receipts') {
    insights.push({
      title: 'Your Specific Gap: Receipt Organization',
      description: 'Lost receipts cost homeowners an average of $12,000 per claim. SnapAsset AI\'s OCR technology extracts data from photos of receipts, manuals, or even product labels—no manual entry needed.',
    });
  } else {
    insights.push({
      title: 'Your Specific Challenge',
      description: 'Traditional methods have failed because they require too much manual work. SnapAsset AI uses AI-powered automation to eliminate 90% of the tedious data entry.',
    });
  }
  
  // Insight 2: Financial reality based on score
  if (score <= 30) {
    insights.push({
      title: 'The Financial Reality',
      description: 'At your current level, a house fire claim could result in $30,000-80,000 in LOST recovery due to insufficient documentation. Insurance companies pay based on what you can prove—not what you lost.',
    });
  } else if (score <= 55) {
    insights.push({
      title: 'The Financial Risk',
      description: 'With your current documentation level, you could lose $15,000-40,000 in claim recovery. Every missing receipt and photo is money left on the table when disaster strikes.',
    });
  } else if (score <= 75) {
    insights.push({
      title: 'Optimization Opportunity',
      description: 'You\'re doing better than most, but small gaps in documentation can still cost you $5,000-15,000 per claim. SnapAsset AI helps you fill those gaps automatically.',
    });
  } else {
    insights.push({
      title: 'Maintenance Excellence',
      description: 'You\'re well-prepared, but maintaining documentation is an ongoing challenge. SnapAsset AI keeps everything current automatically as you add new purchases.',
    });
  }
  
  // Insight 3: Time factor based on goal (Q12)
  if (q12 === 'prepare') {
    insights.push({
      title: 'The Time Factor: Act Now',
      description: 'You set a 90-day goal to get prepared. Traditional methods take 40 hours. SnapAsset AI gets you 100% complete in 10 minutes. That\'s the difference between "someday" and "done today."',
    });
  } else if (q12 === 'recover') {
    insights.push({
      title: 'Recovery Mode',
      description: 'Having experienced a claim, you know the pain of scrambling for documentation. SnapAsset AI ensures you\'ll never face that stress again—everything organized and claim-ready instantly.',
    });
  } else if (q12 === 'reduce_time') {
    insights.push({
      title: 'Time Efficiency',
      description: 'Property managers using SnapAsset AI report saving 46+ hours per month. That\'s time back for high-value activities instead of manual tracking.',
    });
  } else {
    insights.push({
      title: 'Your Timeline',
      description: 'You want results in 90 days. Most people spend 6 months trying traditional methods and give up. SnapAsset AI delivers complete documentation in the time it takes to watch one episode of your favorite show.',
    });
  }
  
  return insights;
};

export const generateCTA = (
  answers: Record<string, string>
): CTAData => {
  const q14 = answers.q14;
  const q11 = answers.q11;
  
  // Based on solution preference (Q14)
  if (q14 === 'done_for_you') {
    return {
      heading: '🎯 WHITE-GLOVE DOCUMENTATION SERVICE',
      buttonText: 'Join VIP Waitlist',
      benefits: [
        'Priority booking when we launch',
        'Professional concierge service',
        'Get notified first',
      ],
    };
  }
  
  if (q14 === 'enterprise' || q11 === 'property_manager' || q11 === 'portfolio_owner') {
    return {
      heading: '🏢 PROPERTY MANAGER SOLUTION',
      buttonText: 'Join Enterprise Waitlist',
      benefits: [
        'Early access to multi-property dashboard',
        'Custom enterprise pricing',
        'Dedicated account manager',
      ],
    };
  }
  
  // Default: DIY app
  return {
    heading: '✅ START YOUR 10-MINUTE INVENTORY RIGHT NOW',
    buttonText: 'Join Waitlist for Early Access',
    benefits: [
      '60-day free trial when we launch',
      'Be first to get access',
      'Priority onboarding support',
    ],
  };
};

export const getUrgencyMessage = (
  score: number,
  answers: Record<string, string>
): string | null => {
  const q11 = answers.q11;
  
  if (q11 === 'claim_victim') {
    return '🔥 YOU KNOW THE PAIN: You\'ve been through the nightmare. Statistically, you\'re 3x more likely to have another claim in the next 5 years. Don\'t let history repeat.';
  }
  
  if (score < 30) {
    return '⚠️ CRITICAL ALERT: Your risk level is in the bottom 15% of homeowners. One disaster could cost you $50,000+ in lost recovery.';
  }
  
  return null;
};

export const getTestimonial = (answers: Record<string, string>) => {
  const q11 = answers.q11;
  
  const testimonials = {
    first_time: {
      quote: 'As a first-time homeowner, I had no idea what I needed. SnapAsset AI made it so easy.',
      author: 'Jennifer M.',
      role: 'First-time Homeowner',
    },
    claim_victim: {
      quote: 'After my house fire, SnapAsset AI\'s documentation helped me recover $23,000 MORE than the initial offer.',
      author: 'Sarah M.',
      role: 'Claim Recovery Success',
    },
    property_manager: {
      quote: 'SnapAsset AI saved me 46 hours per month across 58 properties.',
      author: 'David C.',
      role: 'Property Manager',
    },
    long_term: {
      quote: 'After 15 years, I finally have a complete inventory. It took 12 minutes.',
      author: 'Michael R.',
      role: 'Long-term Homeowner',
    },
    default: {
      quote: 'I procrastinated for 3 years. SnapAsset AI got me 100% complete in one afternoon.',
      author: 'Amanda T.',
      role: 'Homeowner',
    },
  };
  
  return testimonials[q11 as keyof typeof testimonials] || testimonials.default;
};
