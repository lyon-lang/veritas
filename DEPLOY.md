# CoreValidate Deployment Guide

## Option 1: Deploy via Vercel Dashboard (Recommended - Easiest)

### Step 1: Push to GitHub
```bash
cd /Users/lyon/Desktop/Lyon/TheResearcher/veritas
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create GitHub Repository
1. Go to github.com/new
2. Name it "corevalidate"
3. Don't initialize with README
4. Create repository

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/corevalidate.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy on Vercel
1. Go to vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Click "Deploy"

Done! Your app is live.

---

## Option 2: Deploy via CLI

### Step 1: Login to Vercel
```bash
npx vercel login
```

### Step 2: Deploy
```bash
npx vercel
```

### Step 3: Follow prompts
- Set up and deploy? Y
- Which scope? (select your account)
- Link to existing project? N
- Project name: corevalidate
- Directory: ./

### Step 4: Production deploy
```bash
npx vercel --prod
```

---

## Environment Variables

After deployment, add these in Vercel dashboard:

| Variable | Value |
|----------|-------|
| NEXT_PUBLIC_APP_URL | https://your-app.vercel.app |
| OPENAI_API_KEY | (optional - for AI features) |

---

## Important Notes

### SQLite Limitation
SQLite stores data in a file, which doesn't persist on Vercel's serverless functions. For production:

1. **Option A:** Use Vercel Postgres (free tier)
2. **Option B:** Use Turso (SQLite-compatible, free tier)
3. **Option C:** Switch to your Hostinger VPS with Django

### For MVP/Testing
SQLite works fine for testing. Data will reset on each deployment.

---

## Quick Deploy Commands

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Push to GitHub (after creating repo)
git remote add origin https://github.com/YOUR_USERNAME/corevalidate.git
git push -u origin main

# Then deploy on vercel.com
```
