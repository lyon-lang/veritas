'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, ChevronRight, HelpCircle, Book, MessageSquare, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { icon: HelpCircle, title: 'Getting Started', count: 12 },
    { icon: Book, title: 'Using CoreValidate', count: 24 },
    { icon: MessageSquare, title: 'API & Integration', count: 18 },
  ];

  const faqs = [
    {
      question: 'How does CoreValidate verify content?',
      answer: 'CoreValidate uses multiple methods to verify content: C2PA content credentials (when available), AI detection for deepfakes and generated content, source credibility scoring, and metadata analysis. These signals are combined to produce a trust score from 0-100.',
    },
    {
      question: 'What types of content can I verify?',
      answer: 'You can verify URLs, text, images, and videos. Each content type uses different verification methods appropriate for that format.',
    },
    {
      question: 'How accurate is CoreValidate?',
      answer: 'Our detection accuracy is approximately 95% for known manipulation techniques. Accuracy varies by content type and manipulation method. C2PA-verified content has near-100% accuracy.',
    },
    {
      question: 'What is a trust score?',
      answer: 'A trust score is a number from 0-100 indicating how trustworthy content is. Scores above 80 indicate authentic content, 60-80 suggest caution, and below 60 indicate potential issues.',
    },
    {
      question: 'Is my data private?',
      answer: 'Yes. We process content to generate trust scores but do not sell your data to third parties. You control your verification history and can delete it at any time.',
    },
    {
      question: 'How do I use the API?',
      answer: 'Get an API key from your dashboard, then make requests to our REST API. See our API documentation at /docs for detailed instructions and code examples.',
    },
    {
      question: 'What is C2PA?',
      answer: 'C2PA (Coalition for Content Provenance and Authenticity) is an industry standard for content credentials. When content has C2PA credentials, we can verify its creator, edit history, and authenticity with high confidence.',
    },
    {
      question: 'Can I use CoreValidate for my business?',
      answer: 'Yes! We offer enterprise plans with API access, team features, and custom integrations. Contact our sales team for details.',
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

      <main>
        {/* Hero */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help?</h1>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category, i) => (
                <div key={i} className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer">
                  <category.icon className="h-8 w-8 text-emerald-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-500">{category.count} articles</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently asked questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Contact support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
