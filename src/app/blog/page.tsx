'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, Tag, User } from 'lucide-react';
import { Navbar } from '@/components/navbar';

const posts = [
  {
    title: 'Why Trust Scores Matter More Than Ever',
    excerpt: 'In an era of deepfakes and AI-generated content, trust scores are becoming the new currency of credibility.',
    category: 'Trust',
    date: 'Dec 15, 2024',
    author: 'CoreValidate Team',
  },
  {
    title: 'Understanding C2PA Content Credentials',
    excerpt: 'A deep dive into the Content Provenance and Authenticity standard and how it helps verify content.',
    category: 'Technology',
    date: 'Dec 10, 2024',
    author: 'CoreValidate Team',
  },
  {
    title: 'How AI Detection Works',
    excerpt: 'Exploring the methods and techniques used to detect AI-generated text, images, and videos.',
    category: 'AI',
    date: 'Dec 5, 2024',
    author: 'CoreValidate Team',
  },
];

import { Footer } from '@/components/footer';
export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

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
      <Footer />
    </div>
  );
}
