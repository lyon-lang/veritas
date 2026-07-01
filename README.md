# Veritas - The Reality Verification Layer

Verify the authenticity of ALL content in real-time. Trust scores for everything.

## Features

- **Content Verification** - Verify images, videos, text, and URLs
- **Trust Scores** - Real-time trust scoring for all content
- **C2PA Support** - Read and verify Content Credentials
- **AI Detection** - Detect deepfakes and AI-generated content
- **Source Credibility** - Score publishers and sources
- **Browser Extension** - Trust scores everywhere you browse

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API
- Supabase
- Stripe
- Clerk (Auth)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Add your API keys
5. Run development server: `npm run dev`

## Environment Variables

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

## API Endpoints

- `POST /api/verify` - Verify content
- `POST /api/trust-score` - Get trust score
- `POST /api/detect` - Detect AI/deepfakes
- `GET /api/content-credentials` - Read C2PA credentials

## License

Proprietary - Veritas © 2025
