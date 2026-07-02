// Video Verification Service
// Analyzes videos for deepfakes, metadata, and authenticity

import { analyzeVideoForDeepfake, analyzeVideoMetadata, calculateDeepfakeRiskScore, DeepfakeAnalysisResult } from './deepfake';

export interface VideoResult {
  isAuthentic: boolean;
  confidence: number;
  checks: VideoCheck[];
  metadata?: VideoMetadata;
  deepfake?: DeepfakeResult;
  source?: SourceResult;
}

export interface VideoCheck {
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'skipped';
  score: number;
  details: string;
}

export interface VideoMetadata {
  duration?: number;
  resolution?: string;
  format?: string;
  codec?: string;
  bitrate?: number;
  fps?: number;
  createdAt?: string;
  modifiedAt?: string;
  device?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  software?: string;
  hasEdits: boolean;
  editSoftware?: string[];
}

export interface DeepfakeResult {
  isDeepfake: boolean;
  confidence: number;
  faceSwapDetected: boolean;
  voiceCloneDetected: boolean;
  lipSyncDetected: boolean;
  manipulationAreas?: string[];
  details: string;
  riskLevel?: string;
}

export interface SourceResult {
  platform?: string;
  uploader?: string;
  uploadDate?: string;
  verified: boolean;
  credibility: number;
  history?: {
    accountAge?: number;
    followers?: number;
    previousVideos?: number;
  };
}

export async function analyzeVideo(url: string): Promise<VideoResult> {
  const checks: VideoCheck[] = [];

  // 1. Source Analysis (fast, no API call)
  const source = await analyzeVideoSource(url);
  const sourceCheck = evaluateSource(source);
  checks.push(sourceCheck);

  // 2. Platform Metadata Analysis
  const platformInfo = await analyzeVideoMetadata(url);
  const metadata: VideoMetadata = {
    hasEdits: false,
  };

  if (platformInfo.potentialIssues.length > 0) {
    checks.push({
      name: 'Platform Analysis',
      status: 'warning',
      score: 60,
      details: platformInfo.potentialIssues.join('. '),
    });
  } else {
    checks.push({
      name: 'Platform Analysis',
      status: 'passed',
      score: 80,
      details: `Platform: ${platformInfo.platform}`,
    });
  }

  // 3. Deepfake Detection (Gemini multimodal)
  const deepfakeAnalysis = await analyzeVideoForDeepfake(url);
  const deepfake: DeepfakeResult = {
    isDeepfake: deepfakeAnalysis.isDeepfake,
    confidence: deepfakeAnalysis.confidence,
    faceSwapDetected: deepfakeAnalysis.faceSwapDetected,
    voiceCloneDetected: deepfakeAnalysis.voiceCloneDetected,
    lipSyncDetected: deepfakeAnalysis.lipSyncDetected,
    manipulationAreas: deepfakeAnalysis.manipulationAreas,
    details: deepfakeAnalysis.details,
    riskLevel: deepfakeAnalysis.riskLevel,
  };

  const deepfakeCheck = evaluateDeepfake(deepfakeAnalysis);
  checks.push(deepfakeCheck);

  // Calculate overall score
  const overallScore = calculateVideoScore({ isAuthentic: true, confidence: 50, checks, metadata, deepfake, source });

  const isAuthentic = overallScore >= 60 && !deepfake.isDeepfake;

  return {
    isAuthentic,
    confidence: overallScore,
    checks,
    metadata,
    deepfake,
    source,
  };
}

async function analyzeVideoSource(url: string): Promise<SourceResult> {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    let platform = 'unknown';
    let verified = false;
    let credibility = 50;

    if (hostname.includes('youtube.com')) {
      platform = 'YouTube';
      credibility = 70;
    } else if (hostname.includes('vimeo.com')) {
      platform = 'Vimeo';
      credibility = 75;
    } else if (hostname.includes('tiktok.com')) {
      platform = 'TikTok';
      credibility = 50;
    } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      platform = 'Twitter/X';
      credibility = 55;
    } else if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) {
      platform = 'Facebook';
      credibility = 55;
    } else if (hostname.includes('instagram.com')) {
      platform = 'Instagram';
      credibility = 55;
    } else if (hostname.includes('reuters.com')) {
      platform = 'Reuters';
      verified = true;
      credibility = 95;
    } else if (hostname.includes('apnews.com')) {
      platform = 'Associated Press';
      verified = true;
      credibility = 95;
    } else if (hostname.includes('bbc.com') || hostname.includes('bbc.co.uk')) {
      platform = 'BBC';
      verified = true;
      credibility = 90;
    } else if (hostname.includes('nytimes.com')) {
      platform = 'New York Times';
      verified = true;
      credibility = 85;
    }

    return {
      platform,
      verified,
      credibility,
    };
  } catch {
    return {
      verified: false,
      credibility: 50,
    };
  }
}

function evaluateSource(source: SourceResult): VideoCheck {
  let score = source.credibility;
  let status: 'passed' | 'failed' | 'warning' = 'warning';
  let details = '';

  if (source.verified) {
    status = 'passed';
    details = `Verified source: ${source.platform}`;
  } else if (source.credibility >= 70) {
    status = 'passed';
    details = `Credible source: ${source.platform}`;
  } else if (source.credibility >= 50) {
    status = 'warning';
    details = `Unknown source credibility: ${source.platform}`;
  } else {
    status = 'failed';
    details = `Low credibility source: ${source.platform}`;
  }

  return {
    name: 'Source Credibility',
    status,
    score,
    details,
  };
}

function evaluateDeepfake(analysis: DeepfakeAnalysisResult): VideoCheck {
  let score: number;
  let status: 'passed' | 'failed' | 'warning' = 'passed';
  let details = '';

  if (analysis.isDeepfake) {
    score = 20;
    status = 'failed';
    details = 'Deepfake detected';

    if (analysis.faceSwapDetected) details += '. Face swap detected';
    if (analysis.voiceCloneDetected) details += '. Voice clone detected';
    if (analysis.lipSyncDetected) details += '. Lip-sync manipulation detected';
    if (analysis.manipulationAreas.length > 0) {
      details += `. Manipulation areas: ${analysis.manipulationAreas.join(', ')}`;
    }
  } else if (analysis.confidence < 50) {
    score = 50;
    status = 'warning';
    details = 'Unable to fully verify authenticity';
  } else if (analysis.riskLevel === 'medium') {
    score = 65;
    status = 'warning';
    details = 'Some manipulation indicators detected';
  } else if (analysis.riskLevel === 'high') {
    score = 40;
    status = 'warning';
    details = 'Multiple manipulation indicators detected';
  } else {
    score = 85;
    status = 'passed';
    details = 'No deepfake detected';
  }

  return {
    name: 'Deepfake Detection',
    status,
    score,
    details,
  };
}

export function calculateVideoScore(result: VideoResult): number {
  let totalScore = 0;
  let weight = 0;

  // Source credibility (30% weight)
  if (result.source) {
    totalScore += result.source.credibility * 0.3;
    weight += 0.3;
  }

  // Deepfake detection (50% weight - most important)
  if (result.deepfake) {
    const deepfakeScore = result.deepfake.isDeepfake ? 20 : 85;
    totalScore += deepfakeScore * 0.5;
    weight += 0.5;
  }

  // Platform/other checks (20% weight)
  const otherChecks = result.checks.filter(c => c.name !== 'Source Credibility' && c.name !== 'Deepfake Detection');
  if (otherChecks.length > 0) {
    const avgOtherScore = otherChecks.reduce((sum, c) => sum + c.score, 0) / otherChecks.length;
    totalScore += avgOtherScore * 0.2;
    weight += 0.2;
  }

  if (weight > 0) {
    return Math.round(totalScore / weight);
  }

  return 50;
}
