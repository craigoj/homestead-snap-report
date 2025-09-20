import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValuationRequest {
  title: string;
  description?: string;
  brand?: string;
  model?: string;
  category: string;
  condition: string;
  purchase_date?: string;
  purchase_price?: number;
  imageUrl?: string;
}

interface ValuationResponse {
  estimated_value: number;
  confidence: number;
  value_range: {
    min: number;
    max: number;
  };
  reasoning: string;
  depreciation_rate?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const assetData: ValuationRequest = await req.json();
    
    if (!assetData.title || !assetData.category || !assetData.condition) {
      return new Response(
        JSON.stringify({ error: 'Title, category, and condition are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing valuation request for:', assetData.title);

    // Rule-based fallback values by category and condition
    const fallbackValues = {
      electronics: { excellent: 500, good: 300, fair: 150, poor: 50 },
      furniture: { excellent: 400, good: 250, fair: 100, poor: 30 },
      appliances: { excellent: 600, good: 350, fair: 150, poor: 50 },
      jewelry: { excellent: 800, good: 500, fair: 200, poor: 50 },
      clothing: { excellent: 150, good: 80, fair: 30, poor: 10 },
      books: { excellent: 25, good: 15, fair: 8, poor: 2 },
      tools: { excellent: 200, good: 120, fair: 60, poor: 20 },
      sports: { excellent: 300, good: 180, fair: 80, poor: 25 },
      art: { excellent: 1000, good: 600, fair: 250, poor: 50 },
      other: { excellent: 200, good: 120, fair: 60, poor: 20 }
    };

    const fallbackValue = fallbackValues[assetData.category as keyof typeof fallbackValues]?.[assetData.condition as keyof typeof fallbackValues.electronics] || 100;

    // Build comprehensive prompt for AI valuation
    const prompt = `As an expert appraiser, estimate the current market value of this item:

Item Details:
- Title: ${assetData.title}
- Category: ${assetData.category}
- Condition: ${assetData.condition}
- Brand: ${assetData.brand || 'Unknown'}
- Model: ${assetData.model || 'Unknown'}
- Description: ${assetData.description || 'None'}
${assetData.purchase_date ? `- Purchase Date: ${assetData.purchase_date}` : ''}
${assetData.purchase_price ? `- Original Purchase Price: $${assetData.purchase_price}` : ''}

Consider:
1. Current market prices for similar items
2. Brand reputation and demand
3. Age and depreciation
4. Condition impact on value
5. Rarity or collectibility

Respond with only valid JSON in this format:
{
  "estimated_value": number,
  "confidence": number (0-100),
  "value_range": {
    "min": number,
    "max": number
  },
  "reasoning": "Brief explanation of valuation factors",
  "depreciation_rate": number (0-100, percentage per year if applicable)
}`;

    const messages = [
      {
        role: 'system',
        content: 'You are a professional appraiser with expertise in household items, electronics, furniture, and collectibles. Provide accurate market valuations based on current conditions and market trends.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    // Add image analysis if provided
    if (assetData.imageUrl) {
      messages[1].content = [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: assetData.imageUrl } }
      ];
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 800,
        temperature: 0.2
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error, using fallback valuation');
      // Use rule-based fallback
      const valuationResult: ValuationResponse = {
        estimated_value: fallbackValue,
        confidence: 60,
        value_range: {
          min: Math.round(fallbackValue * 0.7),
          max: Math.round(fallbackValue * 1.3)
        },
        reasoning: `Estimated using category-based rules for ${assetData.category} in ${assetData.condition} condition.`,
        depreciation_rate: 15
      };

      return new Response(
        JSON.stringify(valuationResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    console.log('Raw valuation response:', content);

    let valuationResult: ValuationResponse;
    try {
      valuationResult = JSON.parse(content);
      
      // Validate and sanitize the response
      valuationResult.estimated_value = Math.max(1, valuationResult.estimated_value || fallbackValue);
      valuationResult.confidence = Math.max(0, Math.min(100, valuationResult.confidence || 70));
      
      if (!valuationResult.value_range) {
        valuationResult.value_range = {
          min: Math.round(valuationResult.estimated_value * 0.7),
          max: Math.round(valuationResult.estimated_value * 1.3)
        };
      }

      valuationResult.reasoning = valuationResult.reasoning || 'AI-based valuation considering item details and market conditions.';
      
    } catch (parseError) {
      console.error('Failed to parse AI response, using fallback:', parseError);
      valuationResult = {
        estimated_value: fallbackValue,
        confidence: 50,
        value_range: {
          min: Math.round(fallbackValue * 0.7),
          max: Math.round(fallbackValue * 1.3)
        },
        reasoning: `Fallback valuation for ${assetData.category} in ${assetData.condition} condition.`,
        depreciation_rate: 15
      };
    }

    console.log('Final valuation result:', valuationResult);

    return new Response(
      JSON.stringify(valuationResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Valuation error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Valuation failed', 
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});