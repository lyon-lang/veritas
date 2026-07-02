// Database models - uses in-memory storage for Vercel compatibility
// For production, switch to Vercel Postgres, Turso, or your Hostinger VPS

import { 
  UserModel, 
  VerificationModel, 
  SourceModel, 
  StatsModel 
} from './db-memory';

export { UserModel, VerificationModel, SourceModel, StatsModel };
