import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

interface EnhancedOCRRequest {
  imageUrl?: string;
  imageBase64?: string;
}

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
}

interface EnhancedOCRResponse extends OCRResult {
  provider: string;
  raw_text: string;
  metadata: {
    text_confidence: number;
    structure_confidence: number;
    image_quality: number;
    providers_used: string[];
    processing_time: number;
  };
}

async function callOpenAIOCR(imageInput: string, isBase64: boolean): Promise<OCRResult | null> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('OpenAI API key not found');
    return null;
  }

  try {
    const imageContent = isBase64 ? 
      { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageInput}` } } :
      { type: "image_url", image_url: { url: imageInput } };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting structured information from images of household items, receipts, and product labels. 

Extract the following information and return it as a valid JSON object:
- title: A clear, descriptive name for the item
- description: Detailed description of the item including any visible features
- brand: The manufacturer or brand name (if visible)
- model: The model number or name (if visible)  
- serial_number: Any serial number or identifier (if visible)
- category: Choose from: electronics, furniture, appliances, jewelry, clothing, books, toys, sports, tools, other
- estimated_value: Your best estimate of the item's current market value in USD (number only)
- confidence: Your confidence in the overall extraction (0-100, where 100 is completely certain)
- extracted_text: All visible text you can read from the image

If any field cannot be determined, use empty string for text fields, 0 for estimated_value, and your best confidence assessment.
Return ONLY the JSON object, no other text or markdown formatting.`
          },
          {
            role: 'user',
            content: [imageContent]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      console.error('No content in OpenAI response');
      return null;
    }

    // Clean up the response - remove any markdown formatting
    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      return JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI JSON response:', parseError);
      return null;
    }
  } catch (error) {
    console.error('OpenAI OCR error:', error);
    return null;
  }
}

async function callGoogleCloudVision(imageInput: string, isBase64: boolean): Promise<{ text: string; confidence: number } | null> {
  const googleApiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
  if (!googleApiKey) {
    console.error('Google Cloud API key not found');
    return null;
  }

  try {
    let imageData = imageInput;
    if (!isBase64) {
      // Download image and convert to base64
      const imageResponse = await fetch(imageInput);
      if (!imageResponse.ok) return null;
      const imageBlob = await imageResponse.blob();
      const buffer = await imageBlob.arrayBuffer();
      imageData = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    }

    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: imageData
          },
          features: [{
            type: 'TEXT_DETECTION',
            maxResults: 10
          }]
        }]
      }),
    });

    if (!response.ok) {
      console.error('Google Cloud Vision API error:', response.status);
      return null;
    }

    const data = await response.json();
    const textAnnotations = data.responses[0]?.textAnnotations;
    
    if (!textAnnotations || textAnnotations.length === 0) {
      return { text: '', confidence: 0 };
    }

    // First annotation contains full text
    const fullText = textAnnotations[0].description || '';
    
    // Calculate average confidence from all text annotations
    const confidenceSum = textAnnotations.reduce((sum: number, annotation: any) => {
      return sum + (annotation.confidence || 0.8); // Default confidence if not provided
    }, 0);
    const avgConfidence = Math.round((confidenceSum / textAnnotations.length) * 100);

    return {
      text: fullText,
      confidence: avgConfidence
    };
  } catch (error) {
    console.error('Google Cloud Vision error:', error);
    return null;
  }
}

function calculateImageQuality(extractedText: string): number {
  // Simple heuristics for image quality assessment
  if (!extractedText || extractedText.length < 10) return 20;
  
  const textLength = extractedText.length;
  const wordCount = extractedText.split(/\s+/).length;
  const avgWordLength = textLength / wordCount;
  
  // Score based on text characteristics
  let score = 50; // Base score
  
  if (textLength > 100) score += 20;
  if (wordCount > 10) score += 15;
  if (avgWordLength > 3 && avgWordLength < 8) score += 15; // Reasonable word lengths
  
  return Math.min(100, score);
}

function mergeOCRResults(openaiResult: OCRResult | null, googleResult: { text: string; confidence: number } | null): EnhancedOCRResponse {
  const startTime = Date.now();
  
  // Default response structure
  const defaultResponse: EnhancedOCRResponse = {
    title: '',
    description: '',
    brand: '',
    model: '',
    serial_number: '',
    category: 'other',
    estimated_value: 0,
    confidence: 0,
    extracted_text: '',
    provider: 'none',
    raw_text: '',
    metadata: {
      text_confidence: 0,
      structure_confidence: 0,
      image_quality: 0,
      providers_used: [],
      processing_time: Date.now() - startTime
    }
  };

  if (!openaiResult && !googleResult) {
    return defaultResponse;
  }

  if (openaiResult && !googleResult) {
    return {
      ...openaiResult,
      provider: 'openai',
      raw_text: openaiResult.extracted_text,
      metadata: {
        text_confidence: openaiResult.confidence,
        structure_confidence: openaiResult.confidence,
        image_quality: calculateImageQuality(openaiResult.extracted_text),
        providers_used: ['openai'],
        processing_time: Date.now() - startTime
      }
    };
  }

  if (!openaiResult && googleResult) {
    return {
      ...defaultResponse,
      extracted_text: googleResult.text,
      raw_text: googleResult.text,
      confidence: googleResult.confidence,
      provider: 'google',
      metadata: {
        text_confidence: googleResult.confidence,
        structure_confidence: 0,
        image_quality: calculateImageQuality(googleResult.text),
        providers_used: ['google'],
        processing_time: Date.now() - startTime
      }
    };
  }

  // Both providers returned results - merge them
  const textMatch = googleResult!.text.toLowerCase().includes(openaiResult!.extracted_text.toLowerCase()) ||
                   openaiResult!.extracted_text.toLowerCase().includes(googleResult!.text.toLowerCase());
  
  const crossValidationBonus = textMatch ? 15 : 0;
  const finalConfidence = Math.min(100, Math.round((openaiResult!.confidence + googleResult!.confidence) / 2) + crossValidationBonus);

  return {
    ...openaiResult!,
    confidence: finalConfidence,
    provider: 'hybrid',
    raw_text: googleResult!.text.length > openaiResult!.extracted_text.length ? googleResult!.text : openaiResult!.extracted_text,
    metadata: {
      text_confidence: googleResult!.confidence,
      structure_confidence: openaiResult!.confidence,
      image_quality: calculateImageQuality(googleResult!.text),
      providers_used: ['openai', 'google'],
      processing_time: Date.now() - startTime
    }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, imageBase64 }: EnhancedOCRRequest = await req.json();

    if (!imageUrl && !imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Either imageUrl or imageBase64 must be provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Starting enhanced OCR extraction...');
    
    const imageInput = imageUrl || imageBase64!;
    const isBase64 = !!imageBase64;

    // Run both OCR providers in parallel
    const [openaiResult, googleResult] = await Promise.all([
      callOpenAIOCR(imageInput, isBase64),
      callGoogleCloudVision(imageInput, isBase64)
    ]);

    // Merge results with confidence scoring
    const enhancedResult = mergeOCRResults(openaiResult, googleResult);

    console.log(`Enhanced OCR completed - Provider: ${enhancedResult.provider}, Confidence: ${enhancedResult.confidence}%`);

    return new Response(
      JSON.stringify(enhancedResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Enhanced OCR extraction error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process image',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});