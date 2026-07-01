import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveVerification(verification: {
  user_id: string;
  url?: string;
  content_type: string;
  trust_score: number;
  verdict: string;
  confidence: number;
  checks: unknown;
  c2pa_data?: unknown;
  ai_detection?: unknown;
  source_data?: unknown;
}) {
  const { data, error } = await supabase
    .from('verifications')
    .insert(verification)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getVerifications(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('verifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getVerificationById(id: string) {
  const { data, error } = await supabase
    .from('verifications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function saveSourceCredibility(source: {
  domain: string;
  score: number;
  category: string;
  reputation: string;
  fact_check_rating?: string;
  bias?: string;
}) {
  const { data, error } = await supabase
    .from('source_credibility')
    .upsert(source)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSourceCredibility(domain: string) {
  const { data, error } = await supabase
    .from('source_credibility')
    .select('*')
    .eq('domain', domain)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function incrementUserVerifications(userId: string) {
  const { data, error } = await supabase.rpc('increment_verifications', {
    user_id: userId,
  });

  if (error) throw error;
  return data;
}
