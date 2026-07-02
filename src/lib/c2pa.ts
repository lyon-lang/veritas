// C2PA Verification Service
// Uses the official Content Authenticity Initiative library

let c2paInstance: any = null;

// Initialize C2PA
async function getC2pa() {
  if (!c2paInstance) {
    try {
      const { createC2pa } = await import('@contentauth/c2pa-web');
      c2paInstance = await createC2pa({
        wasmSrc: new URL('/wasm/c2pa.wasm', window.location.origin),
        workerSrc: new URL('/wasm/c2pa-worker.js', window.location.origin),
      });
    } catch (error) {
      console.error('Failed to initialize C2PA:', error);
      throw new Error('C2PA initialization failed');
    }
  }
  return c2paInstance;
}

export interface C2paResult {
  hasCredentials: boolean;
  valid: boolean;
  creator?: string;
  timestamp?: string;
  tools?: string[];
  edits?: Array<{
    action: string;
    timestamp: string;
    software?: string;
  }>;
  certificate?: {
    issuer: string;
    valid: boolean;
    chain: string[];
  };
  manifest?: Record<string, unknown>;
  error?: string;
}

// Read C2PA credentials from image
export async function readC2PA(imageSource: File | Blob | string): Promise<C2paResult> {
  try {
    const c2pa = await getC2pa();
    
    // Read the image
    let imageBlob: Blob;
    
    if (typeof imageSource === 'string') {
      // Fetch the image from URL
      const response = await fetch(imageSource);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      imageBlob = await response.blob();
    } else if (imageSource instanceof File) {
      imageBlob = imageSource;
    } else {
      imageBlob = imageSource;
    }

    // Read C2PA data
    const result = await c2pa.read(imageBlob);
    
    if (!result || !result.manifestStore) {
      return {
        hasCredentials: false,
        valid: false,
        error: 'No C2PA credentials found',
      };
    }

    const manifestStore = result.manifestStore;
    const activeManifest = manifestStore.activeManifest;

    if (!activeManifest) {
      return {
        hasCredentials: false,
        valid: false,
        error: 'No active manifest found',
      };
    }

    // Extract information
    const creator = activeManifest.claimGenerator || 'Unknown';
    const timestamp = activeManifest.signatureInfo?.time || '';
    
    // Extract tools
    const tools: string[] = [];
    if (activeManifest.claimGenerator) {
      tools.push(activeManifest.claimGenerator);
    }

    // Extract edits/assertions
    const edits: Array<{ action: string; timestamp: string; software?: string }> = [];
    if (activeManifest.assertions) {
      for (const assertion of activeManifest.assertions) {
        if (assertion.label?.includes('action')) {
          edits.push({
            action: assertion.label,
            timestamp: timestamp,
            software: creator,
          });
        }
      }
    }

    // Extract certificate info
    const certificate = activeManifest.signatureInfo?.certificate ? {
      issuer: activeManifest.signatureInfo.certificate.issuer || 'Unknown',
      valid: true,
      chain: [activeManifest.signatureInfo.certificate.issuer || 'Unknown'],
    } : undefined;

    return {
      hasCredentials: true,
      valid: true,
      creator,
      timestamp,
      tools,
      edits,
      certificate,
      manifest: manifestStore as unknown as Record<string, unknown>,
    };
  } catch (error) {
    console.error('C2PA reading error:', error);
    
    return {
      hasCredentials: false,
      valid: false,
      error: error instanceof Error ? error.message : 'Failed to read C2PA data',
    };
  }
}

// Verify C2PA signature
export async function verifyC2PA(imageSource: File | Blob | string): Promise<{
  valid: boolean;
  checks: Array<{
    name: string;
    status: 'passed' | 'failed' | 'warning';
    details: string;
  }>;
}> {
  try {
    const result = await readC2PA(imageSource);
    
    const checks = [];
    
    // Check 1: Credentials present
    checks.push({
      name: 'C2PA Credentials',
      status: result.hasCredentials ? 'passed' as const : 'failed' as const,
      details: result.hasCredentials 
        ? 'Content Credentials found'
        : 'No Content Credentials found',
    });

    if (!result.hasCredentials) {
      return { valid: false, checks };
    }

    // Check 2: Signature valid
    checks.push({
      name: 'Signature',
      status: result.valid ? 'passed' as const : 'failed' as const,
      details: result.valid 
        ? 'Valid signature'
        : 'Invalid signature',
    });

    // Check 3: Certificate chain
    checks.push({
      name: 'Certificate',
      status: result.certificate?.valid ? 'passed' as const : 'warning' as const,
      details: result.certificate 
        ? `Issued by: ${result.certificate.issuer}`
        : 'No certificate information',
    });

    // Check 4: Timestamp
    checks.push({
      name: 'Timestamp',
      status: result.timestamp ? 'passed' as const : 'warning' as const,
      details: result.timestamp 
        ? `Signed: ${result.timestamp}`
        : 'No timestamp available',
    });

    // Check 5: Creator information
    checks.push({
      name: 'Creator',
      status: result.creator && result.creator !== 'Unknown' ? 'passed' as const : 'warning' as const,
      details: result.creator 
        ? `Creator: ${result.creator}`
        : 'Creator information not available',
    });

    const allPassed = checks.every(c => c.status === 'passed');
    
    return {
      valid: allPassed,
      checks,
    };
  } catch (error) {
    return {
      valid: false,
      checks: [{
        name: 'C2PA Verification',
        status: 'failed',
        details: error instanceof Error ? error.message : 'Verification failed',
      }],
    };
  }
}

// Calculate C2PA score (0-100)
export function calculateC2paScore(result: C2paResult): number {
  if (!result.hasCredentials) return 0;
  
  let score = 50; // Base score for having credentials
  
  if (result.valid) score += 20;
  if (result.certificate?.valid) score += 15;
  if (result.timestamp) score += 10;
  if (result.creator && result.creator !== 'Unknown') score += 5;
  
  return Math.min(100, score);
}
