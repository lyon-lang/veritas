export interface ContentVerification {
  id: string;
  url?: string;
  type: 'image' | 'video' | 'text' | 'audio' | 'url';
  trustScore: number;
  verdict: 'authentic' | 'suspicious' | 'fake' | 'unknown';
  confidence: number;
  checks: VerificationCheck[];
  c2paCredentials?: C2PACredentials;
  aiDetection?: AIDetectionResult;
  sourceCredibility?: SourceCredibility;
  createdAt: string;
}

export interface VerificationCheck {
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'skipped';
  score: number;
  details: string;
}

export interface C2PACredentials {
  present: boolean;
  valid: boolean;
  creator?: string;
  timestamp?: string;
  edits?: C2PAEdit[];
  tools?: string[];
  certificate?: string;
}

export interface C2PAEdit {
  action: string;
  timestamp: string;
  software?: string;
}

export interface AIDetectionResult {
  isAIGenerated: boolean;
  confidence: number;
  model?: string;
  artifacts?: string[];
  indicators?: string[];
}

export interface SourceCredibility {
  domain: string;
  score: number;
  category: 'news' | 'social' | 'blog' | 'unknown' | 'suspicious';
  reputation: 'high' | 'medium' | 'low' | 'unknown';
  factCheckRating?: string;
  bias?: 'left' | 'center' | 'right' | 'unknown';
}

export interface TrustScore {
  overall: number;
  breakdown: {
    c2pa: number;
    aiDetection: number;
    source: number;
    community: number;
  };
  factors: TrustFactor[];
}

export interface TrustFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

export interface VerificationRequest {
  content: string; // URL, text, or base64
  type: 'image' | 'video' | 'text' | 'audio' | 'url';
  options?: {
    checkC2PA?: boolean;
    checkAI?: boolean;
    checkSource?: boolean;
    deepAnalysis?: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'consumer' | 'professional' | 'enterprise';
  verificationsToday: number;
  verificationsLimit: number;
  createdAt: string;
}
