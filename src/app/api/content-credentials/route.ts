import { NextResponse } from 'next/server';
import { readC2PA, verifyC2PA, calculateC2paScore } from '@/lib/c2pa';

// GET - Read C2PA content credentials from URL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Read C2PA data
    const result = await readC2PA(url);
    const score = calculateC2paScore(result);

    return NextResponse.json({
      url,
      hasCredentials: result.hasCredentials,
      valid: result.valid,
      score,
      creator: result.creator,
      timestamp: result.timestamp,
      tools: result.tools,
      edits: result.edits,
      certificate: result.certificate,
      error: result.error,
    });
  } catch (error) {
    console.error('Error reading C2PA credentials:', error);
    return NextResponse.json(
      { error: 'Failed to read C2PA credentials' },
      { status: 500 }
    );
  }
}

// POST - Verify C2PA credentials
export async function POST(request: Request) {
  try {
    const { url, imageData } = await request.json();

    if (!url && !imageData) {
      return NextResponse.json(
        { error: 'URL or image data is required' },
        { status: 400 }
      );
    }

    let imageSource: string | Blob;
    
    if (url) {
      imageSource = url;
    } else if (imageData) {
      // Convert base64 to blob
      const binaryString = atob(imageData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      imageSource = new Blob([bytes], { type: 'image/jpeg' });
    } else {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Verify C2PA credentials
    const verification = await verifyC2PA(imageSource);
    const result = await readC2PA(imageSource);
    const score = calculateC2paScore(result);

    return NextResponse.json({
      valid: verification.valid,
      score,
      checks: verification.checks,
      credentials: result.hasCredentials ? {
        creator: result.creator,
        timestamp: result.timestamp,
        tools: result.tools,
        edits: result.edits,
        certificate: result.certificate,
      } : null,
    });
  } catch (error) {
    console.error('Error verifying C2PA credentials:', error);
    return NextResponse.json(
      { error: 'Failed to verify C2PA credentials' },
      { status: 500 }
    );
  }
}
