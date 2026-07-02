import { NextResponse } from 'next/server';
import { analyzeVideo, calculateVideoScore } from '@/lib/video';

// POST - Analyze video
export async function POST(request: Request) {
  try {
    const { url, options } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Analyze video
    const result = await analyzeVideo(url);
    const score = calculateVideoScore(result);

    return NextResponse.json({
      url,
      score,
      isAuthentic: result.isAuthentic,
      confidence: result.confidence,
      checks: result.checks,
      metadata: result.metadata,
      deepfake: result.deepfake ? {
        isDeepfake: result.deepfake.isDeepfake,
        confidence: result.deepfake.confidence,
        faceSwap: result.deepfake.faceSwapDetected,
        voiceClone: result.deepfake.voiceCloneDetected,
        lipSync: result.deepfake.lipSyncDetected,
        details: result.deepfake.details,
      } : null,
      source: result.source,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error analyzing video:', error);
    return NextResponse.json(
      { error: 'Failed to analyze video' },
      { status: 500 }
    );
  }
}

// GET - Get video analysis capabilities
export async function GET() {
  return NextResponse.json({
    capabilities: {
      metadataAnalysis: {
        available: true,
        features: ['duration', 'resolution', 'format', 'codec', 'device', 'location', 'edits'],
      },
      sourceCredibility: {
        available: true,
        platforms: ['YouTube', 'Vimeo', 'TikTok', 'Twitter/X', 'Facebook', 'Instagram', 'Reuters', 'AP', 'BBC', 'NYT'],
      },
      deepfakeDetection: {
        available: false,
        status: 'Coming soon',
        plannedFeatures: ['face_swap', 'voice_clone', 'lip_sync', 'manipulation_detection'],
      },
      c2paVerification: {
        available: false,
        status: 'Emerging standard',
        note: 'C2PA for video is new and rarely available',
      },
    },
    supportedPlatforms: [
      'YouTube',
      'Vimeo',
      'TikTok',
      'Twitter/X',
      'Facebook',
      'Instagram',
      'News sites (Reuters, AP, BBC, etc.)',
    ],
    limitations: [
      'Deepfake detection requires API integration',
      'C2PA for video is emerging standard (rare)',
      'Metadata can be stripped by platforms',
      'Real-time verification not yet supported',
    ],
  });
}
