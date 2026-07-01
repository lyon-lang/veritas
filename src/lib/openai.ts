import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
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
    if (!openai) {
      return {
        isAIGenerated: false,
        confidence: 0,
        indicators: ['OpenAI API key not configured'],
      };
    }

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return {
      isAIGenerated: result.isAIGenerated || false,
      confidence: result.confidence || 50,
      indicators: result.indicators || [],
    };
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
    if (!openai) {
      return {
        isAIGenerated: false,
        confidence: 0,
        style: 'Unknown',
        indicators: ['OpenAI API key not configured'],
      };
    }

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return {
      isAIGenerated: result.isAIGenerated || false,
      confidence: result.confidence || 50,
      style: result.style || 'Unknown',
      indicators: result.indicators || [],
    };
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
    if (!openai) {
      return {
        claims: [],
      };
    }

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return {
      claims: result.claims || [],
    };
  } catch (error) {
    console.error('Error extracting claims:', error);
    return {
      claims: [],
    };
  }
}
