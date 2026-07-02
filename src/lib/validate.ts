import { z } from 'zod';
import { NextResponse } from 'next/server';

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; response: NextResponse } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
  
  return {
    success: false,
    response: NextResponse.json(
      { error: 'Validation failed', details: errors },
      { status: 400 }
    ),
  };
}
