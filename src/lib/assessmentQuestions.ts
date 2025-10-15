export interface AssessmentQuestion {
  id: string;
  section: 'documentation' | 'qualification';
  question: string;
  options: {
    text: string;
    points: number;
    value: string;
  }[];
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // Section A: Documentation Status (Questions 1-10)
  {
    id: 'q1',
    section: 'documentation',
    question: 'Do you currently have a complete inventory of your belongings?',
    options: [
      { text: 'Yes, detailed and up-to-date', points: 10, value: 'complete' },
      { text: 'Partial inventory, some rooms documented', points: 5, value: 'partial' },
      { text: 'Started but never finished', points: 2, value: 'started' },
      { text: 'No inventory created yet', points: 0, value: 'none' },
    ],
  },
  {
    id: 'q2',
    section: 'documentation',
    question: 'Have you photographed your major possessions with clear images showing brand names, model numbers, and serial numbers?',
    options: [
      { text: 'Yes, professional-quality photos with all details', points: 10, value: 'professional' },
      { text: 'Some photos but not detailed', points: 5, value: 'some' },
      { text: 'Just general room shots', points: 2, value: 'general' },
      { text: 'No documentation photos', points: 0, value: 'none' },
    ],
  },
  {
    id: 'q3',
    section: 'documentation',
    question: 'Where do you keep receipts for major purchases (electronics, appliances, furniture over $500)?',
    options: [
      { text: 'Digital cloud storage, organized', points: 10, value: 'cloud' },
      { text: 'Physical files organized by category', points: 7, value: 'physical_organized' },
      { text: 'Random emails, drawers, boxes', points: 3, value: 'disorganized' },
      { text: 'Throw away most receipts', points: 0, value: 'none' },
    ],
  },
  {
    id: 'q4',
    section: 'documentation',
    question: 'Can you quickly access serial numbers for your major electronics and appliances right now?',
    options: [
      { text: 'Yes, digital record of all serial numbers', points: 10, value: 'digital_record' },
      { text: 'Photos of some serial number labels', points: 5, value: 'photos' },
      { text: 'Would need to check physical items', points: 2, value: 'physical_check' },
      { text: 'Never recorded them', points: 0, value: 'none' },
    ],
  },
  {
    id: 'q5',
    section: 'documentation',
    question: 'Do you know the current replacement value of your home\'s contents?',
    options: [
      { text: 'Yes, documented valuation within 6 months', points: 10, value: 'recent' },
      { text: 'Rough estimate but probably outdated', points: 5, value: 'estimate' },
      { text: 'Could guess but not confident', points: 2, value: 'guess' },
      { text: 'No idea', points: 0, value: 'none' },
    ],
  },
  {
    id: 'q6',
    section: 'documentation',
    question: 'When was the last time you reviewed your personal property coverage limits?',
    options: [
      { text: 'Within last 6 months', points: 10, value: '6months' },
      { text: 'Within last year', points: 7, value: '1year' },
      { text: '1-3 years ago', points: 3, value: '1to3years' },
      { text: 'Never reviewed / don\'t remember', points: 0, value: 'never' },
    ],
  },
  {
    id: 'q7',
    section: 'documentation',
    question: 'Do you have special riders or scheduled coverage for high-value items (jewelry, art, collectibles, electronics over $5,000)?',
    options: [
      { text: 'Yes, all high-value items scheduled with appraisals', points: 10, value: 'all_scheduled' },
      { text: 'Some items scheduled but not all', points: 5, value: 'some_scheduled' },
      { text: 'No, but have items that should be', points: 2, value: 'should_have' },
      { text: 'Don\'t have high-value items / not sure', points: 0, value: 'none' },
    ],
  },
  {
    id: 'q8',
    section: 'documentation',
    question: 'How many properties do you need to track belongings for?',
    options: [
      { text: 'Just one primary residence', points: 5, value: 'one' },
      { text: '2 properties (primary + vacation/rental)', points: 7, value: 'two' },
      { text: '3-10 properties', points: 10, value: '3to10' },
      { text: '11+ properties', points: 10, value: '11plus' },
    ],
  },
  {
    id: 'q9',
    section: 'documentation',
    question: 'If you needed to file an insurance claim tomorrow, how ready are you?',
    options: [
      { text: 'Completely ready—everything organized', points: 10, value: 'ready' },
      { text: 'Somewhat ready—could gather info within a week', points: 5, value: 'somewhat' },
      { text: 'Not very ready—would take weeks', points: 2, value: 'not_ready' },
      { text: 'Not ready at all—would be scrambling', points: 0, value: 'scrambling' },
    ],
  },
  {
    id: 'q10',
    section: 'documentation',
    question: 'How much time have you spent creating/maintaining your home inventory in the past year?',
    options: [
      { text: '5+ hours (actively maintained)', points: 10, value: '5plus' },
      { text: '1-4 hours (some effort)', points: 7, value: '1to4' },
      { text: 'Less than 1 hour', points: 3, value: 'under1' },
      { text: 'Zero hours—haven\'t started', points: 0, value: 'zero' },
    ],
  },
  // Section B: Qualifying Questions (Questions 11-15)
  {
    id: 'q11',
    section: 'qualification',
    question: 'Which best describes your current situation?',
    options: [
      { text: 'First-time homeowner (moved in within 2 years)', points: 0, value: 'first_time' },
      { text: 'Established homeowner (2-10 years, incomplete organization)', points: 0, value: 'established' },
      { text: 'Long-term homeowner (10+ years, feel overwhelmed)', points: 0, value: 'long_term' },
      { text: 'Recent claim victim (never want this stress again)', points: 0, value: 'claim_victim' },
      { text: 'Property manager (5-50 rental properties)', points: 0, value: 'property_manager' },
      { text: 'Portfolio owner (50+ properties or high-value estate)', points: 0, value: 'portfolio_owner' },
      { text: 'High-net-worth individual ($500K+ in assets)', points: 0, value: 'high_net_worth' },
    ],
  },
  {
    id: 'q12',
    section: 'qualification',
    question: 'What\'s the #1 outcome you want to achieve in the next 90 days?',
    options: [
      { text: 'Create my first complete home inventory', points: 0, value: 'create_inventory' },
      { text: 'Get prepared before disaster strikes', points: 0, value: 'prepare' },
      { text: 'Recover from recent claim properly', points: 0, value: 'recover' },
      { text: 'Increase insurance settlement potential', points: 0, value: 'increase_settlement' },
      { text: 'Reduce time spent on property management', points: 0, value: 'reduce_time' },
      { text: 'Prepare for upcoming life change (moving, downsizing)', points: 0, value: 'life_change' },
      { text: 'Ensure adequate coverage', points: 0, value: 'adequate_coverage' },
      { text: 'Professional documentation for high-value assets', points: 0, value: 'professional_docs' },
    ],
  },
  {
    id: 'q13',
    section: 'qualification',
    question: 'What\'s the MAIN reason you haven\'t completed your home inventory yet?',
    options: [
      { text: 'Too time-consuming (feels like a weekend project)', points: 0, value: 'time_consuming' },
      { text: 'Don\'t know where to start', points: 0, value: 'dont_know_start' },
      { text: 'Started but never finished', points: 0, value: 'started_incomplete' },
      { text: 'Can\'t find/organize receipts', points: 0, value: 'receipts' },
      { text: 'Technology barriers (not tech-savvy)', points: 0, value: 'tech_barriers' },
      { text: 'Don\'t think it\'s urgent', points: 0, value: 'not_urgent' },
      { text: 'Managing multiple properties is too complex', points: 0, value: 'complex' },
      { text: 'Tried other solutions that didn\'t work', points: 0, value: 'tried_failed' },
    ],
  },
  {
    id: 'q14',
    section: 'qualification',
    question: 'Which solution would best fit your needs and lifestyle right now?',
    options: [
      { text: 'DIY mobile app I can use myself ($10-15/month)', points: 0, value: 'diy_app' },
      { text: 'Guided software with support ($25-50/month)', points: 0, value: 'guided' },
      { text: 'Done-for-you service ($500-2,000 one-time)', points: 0, value: 'done_for_you' },
      { text: 'Enterprise/property manager solution (custom pricing)', points: 0, value: 'enterprise' },
      { text: 'Free basic tools ($0)', points: 0, value: 'free' },
      { text: 'Not sure yet', points: 0, value: 'not_sure' },
    ],
  },
  {
    id: 'q15',
    section: 'qualification',
    question: 'If SnapAsset AI could solve your home inventory problem completely, what would you consider a FAIR annual price?',
    options: [
      { text: 'Under $50/year', points: 0, value: 'under_50' },
      { text: '$50-100/year', points: 0, value: '50_100' },
      { text: '$100-200/year', points: 0, value: '100_200' },
      { text: '$200-500/year', points: 0, value: '200_500' },
      { text: '$500-1,000/year', points: 0, value: '500_1000' },
      { text: '$1,000+/year', points: 0, value: '1000_plus' },
      { text: 'Price isn\'t a factor', points: 0, value: 'no_factor' },
    ],
  },
];
