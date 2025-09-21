import { supabase } from "@/integrations/supabase/client";

export interface EquipmentTemplate {
  id: string;
  category: string;
  subcategory: string | null;
  equipment_name: string;
  brand_patterns: string[];
  typical_value_range: unknown;
  common_models: string[];
  serial_number_patterns: string[];
  depreciation_rate: number;
  ocr_hints: Record<string, any>;
}

export interface CategoryHierarchy {
  [category: string]: {
    [subcategory: string]: string[];
  };
}

// Enhanced category mapping with hierarchical structure
export const ENHANCED_CATEGORIES: CategoryHierarchy = {
  appliances: {
    kitchen: [
      'Refrigerator', 'Dishwasher', 'Microwave', 'Oven', 'Range', 'Cooktop',
      'Coffee Maker', 'Blender', 'Food Processor', 'Toaster', 'Stand Mixer'
    ],
    hvac: [
      'Air Conditioner', 'Heat Pump', 'Thermostat', 'Air Purifier', 'Humidifier',
      'Dehumidifier', 'Space Heater', 'Ceiling Fan'
    ],
    laundry: [
      'Washing Machine', 'Dryer', 'Iron', 'Steam Cleaner'
    ],
    cleaning: [
      'Vacuum Cleaner', 'Steam Mop', 'Pressure Washer', 'Robot Vacuum'
    ]
  },
  electronics: {
    audio_video: [
      'Television', 'Sound Bar', 'Speaker', 'Headphones', 'Camera',
      'Projector', 'Receiver', 'Turntable', 'Media Player'
    ],
    computing: [
      'Laptop', 'Desktop', 'Tablet', 'Monitor', 'Printer', 'Router',
      'External Drive', 'Webcam', 'Keyboard', 'Mouse'
    ],
    gaming: [
      'Game Console', 'Handheld Console', 'VR Headset', 'Gaming Chair',
      'Gaming Monitor', 'Controller'
    ],
    mobile: [
      'Smartphone', 'Smart Watch', 'Fitness Tracker', 'Portable Charger',
      'Wireless Earbuds'
    ]
  },
  automotive: {
    vehicle: [
      'Car', 'Truck', 'SUV', 'Motorcycle', 'Boat', 'RV', 'Trailer', 'ATV'
    ],
    parts: [
      'Tires', 'Battery', 'GPS', 'Dash Cam', 'Car Audio', 'Bike Rack'
    ]
  },
  tools: {
    power: [
      'Drill', 'Saw', 'Grinder', 'Sander', 'Router', 'Nail Gun',
      'Impact Driver', 'Oscillating Tool'
    ],
    hand: [
      'Wrench Set', 'Screwdriver Set', 'Hammer', 'Level', 'Measuring Tape',
      'Pliers', 'Socket Set'
    ],
    outdoor: [
      'Lawn Mower', 'Trimmer', 'Leaf Blower', 'Chainsaw', 'Pressure Washer',
      'Garden Tools', 'Snow Blower'
    ]
  },
  furniture: {
    living_room: [
      'Sofa', 'Coffee Table', 'TV Stand', 'Bookshelf', 'Recliner', 'Ottoman'
    ],
    bedroom: [
      'Bed Frame', 'Mattress', 'Dresser', 'Nightstand', 'Wardrobe', 'Mirror'
    ],
    dining: [
      'Dining Table', 'Dining Chair', 'China Cabinet', 'Bar Stool', 'Buffet'
    ],
    office: [
      'Desk', 'Office Chair', 'Filing Cabinet', 'Bookcase', 'Desk Lamp'
    ]
  },
  sports: {
    fitness: [
      'Treadmill', 'Exercise Bike', 'Weight Set', 'Yoga Mat', 'Elliptical',
      'Rowing Machine', 'Home Gym'
    ],
    outdoor: [
      'Bicycle', 'Golf Clubs', 'Tennis Racket', 'Camping Gear', 'Kayak',
      'Ski Equipment', 'Fishing Rod'
    ]
  },
  jewelry: {
    fine: [
      'Diamond Ring', 'Gold Necklace', 'Pearl Earrings', 'Platinum Bracelet',
      'Gemstone Ring', 'Watch'
    ],
    fashion: [
      'Fashion Watch', 'Costume Jewelry', 'Sterling Silver', 'Fashion Ring'
    ]
  }
};

class EquipmentTemplateManager {
  private templates: EquipmentTemplate[] = [];
  private lastFetch: number = 0;
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  async getTemplates(): Promise<EquipmentTemplate[]> {
    const now = Date.now();
    if (this.templates.length === 0 || now - this.lastFetch > this.cacheDuration) {
      await this.fetchTemplates();
    }
    return this.templates;
  }

  private async fetchTemplates(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('equipment_templates')
        .select('*')
        .order('category, subcategory, equipment_name');

      if (error) throw error;
      
      this.templates = (data || []).map(item => ({
        ...item,
        ocr_hints: item.ocr_hints as Record<string, any>
      }));
      this.lastFetch = Date.now();
    } catch (error) {
      console.error('Failed to fetch equipment templates:', error);
      // Keep existing templates if fetch fails
    }
  }

  async getTemplatesByCategory(category: string, subcategory?: string): Promise<EquipmentTemplate[]> {
    const templates = await this.getTemplates();
    return templates.filter(t => 
      t.category === category && 
      (!subcategory || t.subcategory === subcategory)
    );
  }

  async findMatchingTemplate(
    title: string, 
    brand?: string, 
    model?: string,
    category?: string
  ): Promise<EquipmentTemplate | null> {
    const templates = await this.getTemplates();
    
    // Filter by category if provided
    const candidateTemplates = category 
      ? templates.filter(t => t.category === category)
      : templates;

    // Score templates based on matches
    const scored = candidateTemplates.map(template => {
      let score = 0;
      
      // Check equipment name match
      if (title.toLowerCase().includes(template.equipment_name.toLowerCase())) {
        score += 10;
      }
      
      // Check brand patterns
      if (brand && template.brand_patterns.some(pattern => 
        brand.toLowerCase().includes(pattern.toLowerCase())
      )) {
        score += 8;
      }
      
      // Check model patterns
      if (model && template.common_models.some(commonModel =>
        model.toLowerCase().includes(commonModel.toLowerCase()) ||
        commonModel.toLowerCase().includes(model.toLowerCase())
      )) {
        score += 6;
      }
      
      // Partial title matches
      const titleWords = title.toLowerCase().split(' ');
      const equipmentWords = template.equipment_name.toLowerCase().split(' ');
      const matchingWords = titleWords.filter(word => 
        equipmentWords.some(eWord => eWord.includes(word) || word.includes(eWord))
      );
      score += matchingWords.length * 2;
      
      return { template, score };
    });
    
    // Return the highest scoring template if score is above threshold
    const best = scored.reduce((prev, current) => 
      current.score > prev.score ? current : prev
    );
    
    return best.score >= 5 ? best.template : null;
  }

  async getValueEstimate(
    template: EquipmentTemplate,
    condition: string = 'good',
    ageYears: number = 0
  ): Promise<{ min: number; max: number; estimated: number }> {
    // Parse value range
    const rangeStr = String(template.typical_value_range || '[0,0]');
    const rangeMatch = rangeStr.match(/\[(\d+),(\d+)\]/);
    if (!rangeMatch) {
      return { min: 0, max: 0, estimated: 0 };
    }
    
    const minValue = parseInt(rangeMatch[1]);
    const maxValue = parseInt(rangeMatch[2]);
    
    // Apply condition multiplier
    const conditionMultipliers = {
      excellent: 0.9,
      good: 0.75,
      fair: 0.6,
      poor: 0.4
    };
    
    const conditionMultiplier = conditionMultipliers[condition as keyof typeof conditionMultipliers] || 0.75;
    
    // Apply depreciation
    const depreciationRate = template.depreciation_rate || 0.10;
    const depreciationMultiplier = Math.max(0.1, 1 - (depreciationRate * ageYears));
    
    const adjustedMin = minValue * conditionMultiplier * depreciationMultiplier;
    const adjustedMax = maxValue * conditionMultiplier * depreciationMultiplier;
    const estimated = (adjustedMin + adjustedMax) / 2;
    
    return {
      min: Math.round(adjustedMin),
      max: Math.round(adjustedMax),
      estimated: Math.round(estimated)
    };
  }

  getCategoryHierarchy(): CategoryHierarchy {
    return ENHANCED_CATEGORIES;
  }

  getAllCategories(): string[] {
    return Object.keys(ENHANCED_CATEGORIES);
  }

  getSubcategories(category: string): string[] {
    return Object.keys(ENHANCED_CATEGORIES[category] || {});
  }

  getEquipmentTypes(category: string, subcategory: string): string[] {
    return ENHANCED_CATEGORIES[category]?.[subcategory] || [];
  }

  // Generate OCR hints for specific equipment
  generateOCRHints(equipmentType: string, brand?: string): Record<string, any> {
    const hints: Record<string, any> = {
      focus_areas: ['serial number', 'model number', 'brand name', 'specifications'],
      common_locations: {
        serial: 'back panel, bottom, or side sticker',
        model: 'front panel, display, or nameplate',
        brand: 'logo or nameplate on front'
      }
    };

    // Equipment-specific hints
    if (equipmentType.toLowerCase().includes('refrigerator')) {
      hints.specific_locations = {
        serial: 'inside door frame or back panel',
        model: 'inside refrigerator or door label'
      };
    } else if (equipmentType.toLowerCase().includes('tv')) {
      hints.specific_locations = {
        serial: 'back panel sticker',
        model: 'back panel or on-screen menu'
      };
    } else if (equipmentType.toLowerCase().includes('laptop')) {
      hints.specific_locations = {
        serial: 'bottom panel or battery compartment',
        model: 'keyboard area or system information'
      };
    }

    // Brand-specific hints
    if (brand) {
      hints.brand_specific = {
        [brand]: 'Look for brand-specific model numbering patterns'
      };
    }

    return hints;
  }
}

export const equipmentTemplateManager = new EquipmentTemplateManager();
