'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, Clock, User } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    {
      title: 'Introducing CoreValidate: The Trust Layer for the Internet',
      excerpt: 'Today we launch CoreValidate, a platform that verifies any content in seconds. Here\'s why we built it and what\'s next.',
      date: 'July 2, 2025',
      author: 'The CoreValidate Team',
      category: 'Launch',
      slug: 'introducing-corevalidate',
    },
    {
      title: 'How C2PA is Changing Content Authentication',
      excerpt: 'Content Credentials are becoming the industry standard for proving content authenticity. Here\'s what you need to know.',
      date: 'June 28, 2025',
      author: 'The CoreValidate Team',
      category: 'Technology',
      slug: 'c2pa-content-authentication',
    },
    {
      title: 'The Deepfake Problem: Why Verification Matters Now',
      excerpt: 'Deepfakes are getting better every day. Here\'s why verification is more important than ever.',
      date: 'June 20, 2025',
      author: 'The CoreValidate Team',
      category: 'Industry',
      slug: 'deepfake-problem',
    },
    {
      title: 'Building Trust in the Age of AI',
      excerpt: 'As AI generates more content, trust becomes the most valuable currency. Here\'s how we\'re building it.',
      date: 'June 15, 2025',
      author: 'The CoreValidate Team',
      category: 'Vision',
      slug: 'building-trust-ai',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="CoreValidate Logo" className="h-8 w-auto object-contain" />
              <span className="font-semibold text-gray-900">CoreValidate</span>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-lg text-gray-600 mb-12">Insights on trust, verification, and the future of content.</p>

        <div className="space-y-8">
          {posts.map((post, i) => (
            <article key={i} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">{post.category}</span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.date}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-500">{post.author}</span>
                </div>
                <span className="text-sm text-emerald-600 flex items-center gap-1">
                  Read more <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
