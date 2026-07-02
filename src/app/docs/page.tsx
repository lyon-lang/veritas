'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code, Book, Zap, Shield, ArrowRight, Copy, Check, ExternalLink } from 'lucide-react';
import { Navbar } from '@/components/navbar';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('quickstart');
  const [copied, setCopied] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar ctaText="Dashboard" ctaHref="/dashboard" />

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="sticky top-20 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <section.icon className="h-4 w-4" />
                  {section.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">
            {/* Mobile Navigation */}
            <div className="lg:hidden mb-6">
              <select 
                value={activeSection} 
                onChange={(e) => setActiveSection(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>{section.label}</option>
                ))}
              </select>
            </div>

            {/* Overview */}
            {activeSection === 'overview' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">CoreValidate API</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Verify any content programmatically. Get trust scores for URLs, text, images, and videos.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <Zap className="h-6 w-6 text-emerald-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Fast</h3>
                    <p className="text-sm text-gray-600">Results in under 1 second</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <Shield className="h-6 w-6 text-green-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Accurate</h3>
                    <p className="text-sm text-gray-600">95% detection accuracy</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <Globe className="h-6 w-6 text-purple-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Global</h3>
                    <p className="text-sm text-gray-600">Works with any content</p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Start</h2>
                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">cURL</span>
                    <button 
                      onClick={() => copyToClipboard(`curl -X POST https://corevalidate.app/api/v1/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"content": "https://example.com", "type": "url"}'`, 'curl')}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedCode === 'curl' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`curl -X POST https://corevalidate.app/api/v1/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"content": "https://example.com", "type": "url"}'`}
                  </pre>
                </div>

                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Response</span>
                    <button 
                      onClick={() => copyToClipboard(`{
  "success": true,
  "data": {
    "content": "https://example.com",
    "type": "url",
    "trustScore": 85,
    "verdict": "authentic",
    "confidence": 85,
    "checks": [...],
    "timestamp": "2025-07-02T10:00:00Z"
  }
}`, 'response')}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedCode === 'response' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "content": "https://example.com",
    "type": "url",
    "trustScore": 85,
    "verdict": "authentic",
    "confidence": 85,
    "checks": [...],
    "timestamp": "2025-07-02T10:00:00Z"
  }
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* Authentication */}
            {activeSection === 'authentication' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication</h1>
                <p className="text-gray-600 mb-6">
                  All API requests require an API key. Get yours from the dashboard.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Your API Key</h2>
                <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-600">
                  <li>Sign up for a CoreValidate account</li>
                  <li>Go to Dashboard → Settings → API Keys</li>
                  <li>Click "Create API Key"</li>
                  <li>Copy and save your key securely</li>
                </ol>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Your API key is shown only once. Save it securely. If lost, you'll need to create a new one.
                  </p>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Using Your API Key</h2>
                <p className="text-gray-600 mb-4">Include your API key in requests using one of these methods:</p>

                <h3 className="font-semibold text-gray-900 mb-2">Method 1: Authorization Header (Recommended)</h3>
                <div className="bg-gray-900 rounded-xl p-4 mb-4">
                  <pre className="text-green-400 text-sm">
{`Authorization: Bearer vrt_your_api_key_here`}
                  </pre>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">Method 2: Query Parameter</h3>
                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                  <pre className="text-green-400 text-sm">
{`https://corevalidate.app/api/v1/verify?api_key=vrt_your_api_key_here`}
                  </pre>
                </div>
              </div>
            )}

            {/* Verify Content */}
            {activeSection === 'verify' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Verify Content</h1>
                <p className="text-gray-600 mb-6">
                  Verify any content and get a trust score.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Endpoint</h2>
                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                  <pre className="text-green-400 text-sm">
{`POST /api/v1/verify`}
                  </pre>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Body</h2>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Parameter</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Required</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-mono text-emerald-600">content</td>
                        <td className="py-3 px-4">string</td>
                        <td className="py-3 px-4">Yes</td>
                        <td className="py-3 px-4">URL, text, or image URL to verify</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-mono text-emerald-600">type</td>
                        <td className="py-3 px-4">string</td>
                        <td className="py-3 px-4">Yes</td>
                        <td className="py-3 px-4">Content type: url, text, image, video</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-emerald-600">options</td>
                        <td className="py-3 px-4">object</td>
                        <td className="py-3 px-4">No</td>
                        <td className="py-3 px-4">Additional options (checkC2PA, checkAI, etc.)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Response</h2>
                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "content": "https://example.com",
    "type": "url",
    "trustScore": 85,
    "verdict": "authentic",
    "confidence": 85,
    "checks": [
      {
        "name": "Source",
        "status": "passed",
        "score": 90,
        "details": "example.com - Trusted source"
      }
    ],
    "timestamp": "2025-07-02T10:00:00Z"
  }
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* Batch Verify */}
            {activeSection === 'batch' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Batch Verify</h1>
                <p className="text-gray-600 mb-6">
                  Verify multiple items at once (up to 50 per request).
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Endpoint</h2>
                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                  <pre className="text-green-400 text-sm">
{`POST /api/v1/verify/batch`}
                  </pre>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Body</h2>
                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "items": [
    { "content": "https://example.com/1", "type": "url" },
    { "content": "https://example.com/2", "type": "url" },
    { "content": "Some text to verify", "type": "text" }
  ]
}`}
                  </pre>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Response</h2>
                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "results": [...],
    "summary": {
      "total": 3,
      "successful": 3,
      "failed": 0,
      "authentic": 2,
      "suspicious": 1,
      "fake": 0,
      "avgScore": 72
    }
  }
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* Source Credibility */}
            {activeSection === 'sources' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Source Credibility</h1>
                <p className="text-gray-600 mb-6">
                  Check the credibility score of any domain.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Endpoint</h2>
                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                  <pre className="text-green-400 text-sm">
{`GET /api/v1/sources?domain=example.com`}
                  </pre>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Response</h2>
                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "domain": "reuters.com",
    "score": 95,
    "category": "news",
    "reputation": "high",
    "bias": "center",
    "factCheckRating": "highly factual",
    "description": "International news organization"
  }
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* Rate Limits */}
            {activeSection === 'rate-limits' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Rate Limits</h1>
                <p className="text-gray-600 mb-6">
                  API requests are rate limited based on your plan.
                </p>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Plan</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Requests/Minute</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Requests/Day</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">Free</td>
                        <td className="py-3 px-4">10</td>
                        <td className="py-3 px-4">100</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">Pro ($10/mo)</td>
                        <td className="py-3 px-4">100</td>
                        <td className="py-3 px-4">10,000</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Enterprise</td>
                        <td className="py-3 px-4">1,000</td>
                        <td className="py-3 px-4">100,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Rate Limit Headers</h2>
                <p className="text-gray-600 mb-4">Responses include these headers:</p>
                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                  <pre className="text-green-400 text-sm">
{`X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2025-07-02T10:01:00Z`}
                  </pre>
                </div>
              </div>
            )}

            {/* Error Codes */}
            {activeSection === 'errors' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Codes</h1>
                <p className="text-gray-600 mb-6">
                  The API returns standard HTTP status codes.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Code</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-mono">200</td>
                        <td className="py-3 px-4">Success</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-mono">400</td>
                        <td className="py-3 px-4">Bad request (missing parameters)</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-mono">401</td>
                        <td className="py-3 px-4">Unauthorized (invalid API key)</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-mono">429</td>
                        <td className="py-3 px-4">Rate limit exceeded</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono">500</td>
                        <td className="py-3 px-4">Internal server error</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
