import { LucideIcon } from 'lucide-react';

export interface Prompt {
  id: string;
  item: string;
  rationale: string;
  locationHint: string;
  typicalValue: string;
  emoji: string;
}

export interface JumpstartMode {
  id: 'quick-win' | 'high-value' | 'room-blitz';
  name: string;
  description: string;
  time: string;
  items: number;
  value: string;
  icon: LucideIcon;
  popular?: boolean;
  prompts: Prompt[];
}

// Quick Win Mode - Most Popular (3 items, ~3 minutes)
export const QUICK_WIN_PROMPTS: Prompt[] = [
  {
    id: 'quick-win-tv',
    item: 'TV',
    rationale: 'Your most valuable living room item',
    locationHint: 'Living room, entertainment center, media console',
    typicalValue: '$500-2,000',
    emoji: '📺'
  },
  {
    id: 'quick-win-laptop',
    item: 'Laptop',
    rationale: 'Often your highest-value personal item',
    locationHint: 'Desk, home office, bedroom',
    typicalValue: '$800-2,500',
    emoji: '💻'
  },
  {
    id: 'quick-win-jewelry',
    item: 'Jewelry',
    rationale: 'Frequently forgotten in insurance claims',
    locationHint: 'Bedroom dresser, jewelry box, safe',
    typicalValue: '$500-5,000',
    emoji: '💍'
  }
];

// High-Value Hunt Mode (5 items, ~5 minutes)
export const HIGH_VALUE_PROMPTS: Prompt[] = [
  {
    id: 'high-value-electronics',
    item: 'Most Expensive Electronic',
    rationale: 'Maximize your insurance protection',
    locationHint: 'Home office, living room',
    typicalValue: '$1,000-3,000',
    emoji: '🖥️'
  },
  {
    id: 'high-value-appliances',
    item: 'Major Appliance',
    rationale: 'High-value items that add up',
    locationHint: 'Kitchen, laundry room',
    typicalValue: '$500-2,000',
    emoji: '🍳'
  },
  {
    id: 'high-value-tools',
    item: 'Power Tools or Equipment',
    rationale: 'Often overlooked but valuable',
    locationHint: 'Garage, basement, workshop',
    typicalValue: '$200-1,500',
    emoji: '🔧'
  },
  {
    id: 'high-value-audio',
    item: 'Audio/Video Equipment',
    rationale: 'Specialized items need documentation',
    locationHint: 'Entertainment center, music room',
    typicalValue: '$300-2,000',
    emoji: '🎵'
  },
  {
    id: 'high-value-designer',
    item: 'Designer Items or Collectibles',
    rationale: 'High-value personal items',
    locationHint: 'Closet, display cabinets',
    typicalValue: '$500-10,000',
    emoji: '👜'
  }
];

// Room Blitz Mode - Bedroom Focus (15 items, ~10 minutes)
export const ROOM_BLITZ_PROMPTS: Prompt[] = [
  {
    id: 'room-blitz-bed',
    item: 'Bed Frame & Mattress',
    rationale: 'Foundation of your bedroom',
    locationHint: 'Center of bedroom',
    typicalValue: '$500-2,000',
    emoji: '🛏️'
  },
  {
    id: 'room-blitz-nightstands',
    item: 'Nightstands',
    rationale: 'Functional bedroom furniture',
    locationHint: 'Beside the bed',
    typicalValue: '$100-500',
    emoji: '🏠'
  },
  {
    id: 'room-blitz-dresser',
    item: 'Dresser',
    rationale: 'Storage furniture adds up',
    locationHint: 'Against the wall',
    typicalValue: '$200-1,000',
    emoji: '🗄️'
  },
  {
    id: 'room-blitz-tv',
    item: 'Bedroom TV',
    rationale: 'Entertainment electronics',
    locationHint: 'Wall-mounted or on dresser',
    typicalValue: '$300-1,500',
    emoji: '📺'
  },
  {
    id: 'room-blitz-laptop',
    item: 'Laptop or Tablet',
    rationale: 'Personal electronics',
    locationHint: 'Desk, nightstand, bed',
    typicalValue: '$500-2,000',
    emoji: '💻'
  },
  {
    id: 'room-blitz-phone',
    item: 'Smartphone',
    rationale: 'Valuable personal device',
    locationHint: 'Nightstand, desk',
    typicalValue: '$500-1,200',
    emoji: '📱'
  },
  {
    id: 'room-blitz-jewelry',
    item: 'Jewelry Collection',
    rationale: 'High-value personal items',
    locationHint: 'Jewelry box, dresser',
    typicalValue: '$500-5,000',
    emoji: '💍'
  },
  {
    id: 'room-blitz-watch',
    item: 'Watches',
    rationale: 'Often overlooked valuables',
    locationHint: 'Watch box, nightstand',
    typicalValue: '$200-5,000',
    emoji: '⌚'
  },
  {
    id: 'room-blitz-shoes',
    item: 'Designer Shoes',
    rationale: 'Expensive footwear collection',
    locationHint: 'Closet, shoe rack',
    typicalValue: '$100-1,000',
    emoji: '👟'
  },
  {
    id: 'room-blitz-clothing',
    item: 'Designer Clothing',
    rationale: 'High-value wardrobe items',
    locationHint: 'Closet, wardrobe',
    typicalValue: '$200-2,000',
    emoji: '👔'
  },
  {
    id: 'room-blitz-bags',
    item: 'Handbags & Accessories',
    rationale: 'Luxury accessories',
    locationHint: 'Closet shelves',
    typicalValue: '$300-3,000',
    emoji: '👜'
  },
  {
    id: 'room-blitz-mirror',
    item: 'Full-Length Mirror',
    rationale: 'Decorative furniture',
    locationHint: 'Closet door, wall',
    typicalValue: '$50-300',
    emoji: '🪞'
  },
  {
    id: 'room-blitz-lamp',
    item: 'Bedside Lamps',
    rationale: 'Lighting fixtures',
    locationHint: 'Nightstands',
    typicalValue: '$50-300',
    emoji: '💡'
  },
  {
    id: 'room-blitz-art',
    item: 'Artwork or Decor',
    rationale: 'Decorative pieces have value',
    locationHint: 'Walls, shelves',
    typicalValue: '$100-2,000',
    emoji: '🖼️'
  },
  {
    id: 'room-blitz-gaming',
    item: 'Gaming Console',
    rationale: 'Entertainment devices',
    locationHint: 'TV stand, desk',
    typicalValue: '$300-600',
    emoji: '🎮'
  }
];

// Helper function to get prompts for a specific mode
export function getPromptsForMode(modeId: string): Prompt[] {
  switch (modeId) {
    case 'quick-win':
      return QUICK_WIN_PROMPTS;
    case 'high-value':
      return HIGH_VALUE_PROMPTS;
    case 'room-blitz':
      return ROOM_BLITZ_PROMPTS;
    default:
      return QUICK_WIN_PROMPTS;
  }
}

// Helper function to get mode by ID
export function getModeById(modeId: string): JumpstartMode | null {
  // This will be populated when we update the mode selector
  return null;
}
