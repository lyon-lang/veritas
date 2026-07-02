import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export interface DeepfakeAnalysisResult {
  isDeepfake: boolean;
  confidence: number;
  faceSwapDetected: boolean;
  voiceCloneDetected: boolean;
  lipSyncDetected: boolean;
  manipulationAreas: string[];
  details: string;
  indicators: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  analysisMethod: string;
}

export interface FrameAnalysis {
  hasFaceSwap: boolean;
  hasVoiceClone: boolean;
  hasLipSync: boolean;
  artifacts: string[];
  inconsistencies: string[];
  confidence: number;
}

export async function analyzeVideoForDeepfake(videoUrl: string): Promise<DeepfakeAnalysisResult> {
  if (!genAI) {
    return {
      isDeepfake: false,
      confidence: 0,
      faceSwapDetected: false,
      voiceCloneDetected: false,
      lipSyncDetected: false,
      manipulationAreas: [],
      details: 'Deepfake detection requires Gemini API key',
      indicators: [],
      riskLevel: 'low',
      analysisMethod: 'unavailable',
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `You are an expert deepfake detection analyst. Analyze this video URL for signs of manipulation.

Video URL: ${videoUrl}

Perform a comprehensive deepfake analysis looking for:

1. FACE MANIPULATION:
   - Face swap artifacts (unnatural blending, inconsistent lighting on face)
   - Facial landmark inconsistencies
   - Skin texture anomalies
   - Eye reflection inconsistencies
   - Teeth and hair manipulation signs

2. VOICE/AUDIO ANALYSIS:
   - Voice cloning indicators (unnatural cadence, robotic artifacts)
   - Audio-visual synchronization issues
   - Background noise inconsistencies
   - Spectral analysis anomalies

3. LIP-SYNC MANIPULATION:
   - Mouth shape vs phoneme mismatches
   - Jaw movement inconsistencies
   - Tongue and teeth visibility issues

4. TEMPORAL CONSISTENCY:
   - Frame-to-frame face consistency
   - Lighting consistency across frames
   - Shadow direction consistency
   - Background stability

5. TECHNICAL ARTIFACTS:
   - Compression artifacts typical of manipulation
   - Resolution inconsistencies
   - Edge detection anomalies
   - Color grading inconsistencies

Respond in JSON format:
{
  "isDeepfake": boolean,
  "confidence": number (0-100),
  "faceSwapDetected": boolean,
  "voiceCloneDetected": boolean,
  "lipSyncDetected": boolean,
  "manipulationAreas": ["list of specific areas with manipulation"],
  "details": "detailed analysis explanation",
  "indicators": ["list of specific indicators found"],
  "riskLevel": "low|medium|high|critical",
  "analysisMethod": "method used for analysis"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text);
      return {
        isDeepfake: parsed.isDeepfake || false,
        confidence: Math.min(100, Math.max(0, parsed.confidence || 50)),
        faceSwapDetected: parsed.faceSwapDetected || false,
        voiceCloneDetected: parsed.voiceCloneDetected || false,
        lipSyncDetected: parsed.lipSyncDetected || false,
        manipulationAreas: parsed.manipulationAreas || [],
        details: parsed.details || 'Analysis complete',
        indicators: parsed.indicators || [],
        riskLevel: parsed.riskLevel || 'low',
        analysisMethod: parsed.analysisMethod || 'Gemini multimodal analysis',
      };
    } catch {
      return {
        isDeepfake: false,
        confidence: 30,
        faceSwapDetected: false,
        voiceCloneDetected: false,
        lipSyncDetected: false,
        manipulationAreas: [],
        details: 'Unable to parse analysis results',
        indicators: ['Response parsing failed'],
        riskLevel: 'low',
        analysisMethod: 'fallback',
      };
    }
  } catch (error) {
    console.error('Deepfake analysis error:', error);
    return {
      isDeepfake: false,
      confidence: 0,
      faceSwapDetected: false,
      voiceCloneDetected: false,
      lipSyncDetected: false,
      manipulationAreas: [],
      details: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      indicators: ['API call failed'],
      riskLevel: 'low',
      analysisMethod: 'error',
    };
  }
}

export async function analyzeVideoMetadata(url: string): Promise<{
  platform: string;
  hasEmbed: boolean;
  isLiveStream: boolean;
  potentialIssues: string[];
}> {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    let platform = 'unknown';
    let hasEmbed = false;
    let isLiveStream = false;
    const potentialIssues: string[] = [];

    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      platform = 'YouTube';
      hasEmbed = true;
      if (urlObj.searchParams.has('live')) {
        isLiveStream = true;
      }
    } else if (hostname.includes('vimeo.com')) {
      platform = 'Vimeo';
      hasEmbed = true;
    } else if (hostname.includes('tiktok.com')) {
      platform = 'TikTok';
      hasEmbed = true;
      potentialIssues.push('TikTok videos are often re-uploaded with modifications');
    } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      platform = 'Twitter/X';
      hasEmbed = true;
      potentialIssues.push('Social media videos may be edited before posting');
    } else if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) {
      platform = 'Facebook';
      hasEmbed = true;
    } else if (hostname.includes('instagram.com')) {
      platform = 'Instagram';
      hasEmbed = true;
      potentialIssues.push('Instagram videos may have filters applied');
    } else if (hostname.includes('reuters.com')) {
      platform = 'Reuters';
      hasEmbed = true;
      potentialIssues.push('News agency footage - generally reliable');
    } else if (hostname.includes('apnews.com')) {
      platform = 'Associated Press';
      hasEmbed = true;
      potentialIssues.push('News agency footage - generally reliable');
    } else if (hostname.includes('bbc.com') || hostname.includes('bbc.co.uk')) {
      platform = 'BBC';
      hasEmbed = true;
      potentialIssues.push('Broadcast footage - generally reliable');
    } else {
      platform = 'unknown';
      potentialIssues.push('Unknown platform - verify source credibility');
    }

    return {
      platform,
      hasEmbed,
      isLiveStream,
      potentialIssues,
    };
  } catch {
    return {
      platform: 'unknown',
      hasEmbed: false,
      isLiveStream: false,
      potentialIssues: ['Invalid URL format'],
    };
  }
}

export function calculateDeepfakeRiskScore(analysis: DeepfakeAnalysisResult): number {
  let riskScore = 0;

  if (analysis.isDeepfake) {
    riskScore += 60;
  }

  if (analysis.faceSwapDetected) {
    riskScore += 20;
  }

  if (analysis.voiceCloneDetected) {
    riskScore += 15;
  }

  if (analysis.lipSyncDetected) {
    riskScore += 15;
  }

  if (analysis.manipulationAreas.length > 0) {
    riskScore += Math.min(20, analysis.manipulationAreas.length * 5);
  }

  riskScore = Math.min(100, riskScore);

  return 100 - riskScore;
}
