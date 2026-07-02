import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function analyzeContent(
  content: string,
  type: 'image' | 'video' | 'text' | 'audio' | 'url'
): Promise<{
  isAIGenerated: boolean;
  confidence: number;
  indicators: string[];
}> {
  try {
    if (!genAI) {
      return {
        isAIGenerated: false,
        confidence: 0,
        indicators: ['Gemini API key not configured'],
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze this ${type} content and determine if it's AI-generated or authentic.

Content: ${content.substring(0, 2000)}

Analyze for:
1. Signs of AI generation (artifacts, patterns, inconsistencies)
2. Manipulation indicators
3. Authenticity markers

Respond in JSON format:
{
  "isAIGenerated": boolean,
  "confidence": number (0-100),
  "indicators": ["list of specific indicators found"]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text);
      return {
        isAIGenerated: parsed.isAIGenerated || false,
        confidence: parsed.confidence || 50,
        indicators: parsed.indicators || [],
      };
    } catch {
      return {
        isAIGenerated: false,
        confidence: 50,
        indicators: ['Unable to parse response'],
      };
    }
  } catch (error) {
    console.error('Error analyzing content:', error);
    return {
      isAIGenerated: false,
      confidence: 0,
      indicators: ['Analysis failed'],
    };
  }
}

export async function analyzeTextAuthenticity(text: string): Promise<{
  isAIGenerated: boolean;
  confidence: number;
  style: string;
  indicators: string[];
}> {
  try {
    if (!genAI) {
      return {
        isAIGenerated: false,
        confidence: 0,
        style: 'Unknown',
        indicators: ['Gemini API key not configured'],
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze this text and determine if it was written by a human or AI.

Text: ${text.substring(0, 3000)}

Analyze for:
1. Writing style patterns
2. Repetitive structures
3. Unnatural phrasing
4. Lack of personal voice
5. Overly formal or generic language

Respond in JSON format:
{
  "isAIGenerated": boolean,
  "confidence": number (0-100),
  "style": "description of writing style",
  "indicators": ["list of specific indicators"]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    try {
      const parsed = JSON.parse(responseText);
      return {
        isAIGenerated: parsed.isAIGenerated || false,
        confidence: parsed.confidence || 50,
        style: parsed.style || 'Unknown',
        indicators: parsed.indicators || [],
      };
    } catch {
      return {
        isAIGenerated: false,
        confidence: 50,
        style: 'Unknown',
        indicators: ['Unable to parse response'],
      };
    }
  } catch (error) {
    console.error('Error analyzing text:', error);
    return {
      isAIGenerated: false,
      confidence: 0,
      style: 'Unknown',
      indicators: ['Analysis failed'],
    };
  }
}

export async function extractClaims(text: string): Promise<{
  claims: Array<{
    claim: string;
    verifiable: boolean;
    confidence: number;
  }>;
}> {
  try {
    if (!genAI) {
      return {
        claims: [],
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Extract factual claims from this text that could be verified.

Text: ${text.substring(0, 3000)}

For each claim, determine:
1. Is it verifiable?
2. How confident are we it's accurate?

Respond in JSON format:
{
  "claims": [
    {
      "claim": "the factual claim",
      "verifiable": boolean,
      "confidence": number (0-100)
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    try {
      const parsed = JSON.parse(responseText);
      return {
        claims: parsed.claims || [],
      };
    } catch {
      return {
        claims: [],
      };
    }
  } catch (error) {
    console.error('Error extracting claims:', error);
    return {
      claims: [],
    };
  }
}
