import { NextResponse } from 'next/server';

// POST - Video analysis (disabled - coming soon)
export async function POST() {
  return NextResponse.json(
    { error: 'Video verification coming soon. Use image or text verification for now.' },
    { status: 501 }
  );
}

// GET - Get video analysis capabilities
export async function GET() {
  return NextResponse.json({
    capabilities: {
      sourceCredibility: {
        available: false,
        status: 'Coming soon',
      },
      deepfakeDetection: {
        available: false,
        status: 'Coming soon',
        plannedFeatures: ['face_swap', 'voice_clone', 'lip_sync'],
      },
      c2paVerification: {
        available: false,
        status: 'Coming soon',
      },
    },
    status: 'Video verification is coming soon. Currently supporting image and text verification.',
    estimatedLaunch: 'Q3 2025',
  });
}
