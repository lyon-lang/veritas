import { z } from 'zod';

export const VerifySchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000, 'Content exceeds maximum length'),
  type: z.enum(['url', 'text', 'image']),
});

export const BatchVerifySchema = z.object({
  items: z.array(z.object({
    content: z.string().min(1),
    type: z.enum(['url', 'text', 'image']),
  })).min(1, 'At least one item required').max(10, 'Maximum 10 items per batch'),
});

export const TrustScoreSchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000, 'Content exceeds maximum length'),
  type: z.enum(['url', 'text', 'image']),
});

export const DetectSchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000, 'Content exceeds maximum length'),
  type: z.enum(['image', 'text']),
});

export const WatchlistCreateSchema = z.object({
  url: z.string().url('Invalid URL format'),
  label: z.string().max(100, 'Label too long').optional(),
});

export const WatchlistUpdateSchema = z.object({
  id: z.string().uuid('Invalid watchlist item ID'),
  label: z.string().max(100, 'Label too long').optional(),
});

export const AlertUpdateSchema = z.object({
  alertId: z.string().uuid('Invalid alert ID').optional(),
  markAll: z.boolean().optional(),
}).refine(data => data.alertId || data.markAll, {
  message: 'Either alertId or markAll is required',
});

export const AuthSignupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  action: z.literal('signup'),
});

export const AuthLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  action: z.literal('login'),
});

export const SourceCredibilitySchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  score: z.number().min(0).max(100, 'Score must be between 0 and 100'),
  category: z.string().min(1, 'Category is required'),
  reputation: z.string().min(1, 'Reputation is required'),
  factCheckRating: z.string().optional(),
  bias: z.string().optional(),
  description: z.string().max(500, 'Description too long').optional(),
});

export const ApiKeyCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  tier: z.enum(['free', 'pro', 'enterprise']).optional(),
});

export type VerifyInput = z.infer<typeof VerifySchema>;
export type BatchVerifyInput = z.infer<typeof BatchVerifySchema>;
export type TrustScoreInput = z.infer<typeof TrustScoreSchema>;
export type DetectInput = z.infer<typeof DetectSchema>;
export type WatchlistCreateInput = z.infer<typeof WatchlistCreateSchema>;
export type WatchlistUpdateInput = z.infer<typeof WatchlistUpdateSchema>;
export type AlertUpdateInput = z.infer<typeof AlertUpdateSchema>;
export type AuthSignupInput = z.infer<typeof AuthSignupSchema>;
export type AuthLoginInput = z.infer<typeof AuthLoginSchema>;
export type SourceCredibilityInput = z.infer<typeof SourceCredibilitySchema>;
export type ApiKeyCreateInput = z.infer<typeof ApiKeyCreateSchema>;
