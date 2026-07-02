'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Globe, 
  Clock,
  ExternalLink,
  Share2,
  Copy,
  CheckCircle,
  ArrowRight,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon
} from 'lucide-react';

interface Report {
  id: string;
  url?: string;
  contentType: string;
  trustScore: number;
  verdict: string;
  confidence: number;
  checks: Array<{
    name: string;
    status: string;
    score: number;
    details: string;
  }>;
  createdAt: string;
  shareUrl: string;
}

export default function ReportPage() {
  const params = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchReport(params.id as string);
    }
  }, [params.id]);

  const fetchReport = async (id: string) => {
    try {
      const res = await fetch(`/api/reports?id=${id}`);
      const data = await res.json();

      if (res.ok) {
        setReport(data);
      } else {
        setError(data.error || 'Report not found');
      }
    } catch (err) {
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    if (!report) return;
    const text = getShareText();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(report.shareUrl)}`, '_blank');
  };

  const shareOnFacebook = () => {
    if (!report) return;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(report.shareUrl)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    if (!report) return;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(report.shareUrl)}`, '_blank');
  };

  const getShareText = () => {
    if (!report) return '';
    const score = report.trustScore;
    const verdict = report.verdict;

    if (verdict === 'fake') {
      return `🚨 This content is FAKE (Trust Score: ${score}/100)`;
    } else if (verdict === 'suspicious') {
      return `⚠️ This content is SUSPICIOUS (Trust Score: ${score}/100)`;
    } else {
      return `✅ This content is AUTHENTIC (Trust Score: ${score}/100)`;
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'authentic': return <ShieldCheck className="h-12 w-12 text-green-600" />;
      case 'suspicious': return <ShieldAlert className="h-12 w-12 text-yellow-600" />;
      case 'fake': return <ShieldX className="h-12 w-12 text-red-600" />;
      default: return <Shield className="h-12 w-12 text-gray-600" />;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'authentic': return 'text-green-600 bg-green-50 border-green-200';
      case 'suspicious': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'fake': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'text': return <FileText className="h-5 w-5" />;
      case 'url': return <LinkIcon className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
          <p className="text-gray-500 mb-6">{error || 'This verification report does not exist.'}</p>
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Go to CoreValidate
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`Verification Report - Trust Score: ${report.trustScore}/100 | CoreValidate`}</title>
        <meta name="description" content={`Content verification report with trust score ${report.trustScore}/100. Verdict: ${report.verdict}. Verified by CoreValidate.`} />
        <meta property="og:title" content={`Verification Report - Trust Score: ${report.trustScore}/100`} />
        <meta property="og:description" content={`Verdict: ${report.verdict}. Confidence: ${report.confidence}%. Verified by CoreValidate.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={report.shareUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`Verification Report - Trust Score: ${report.trustScore}/100`} />
        <meta name="twitter:description" content={`Verdict: ${report.verdict}. Verified by CoreValidate.`} />
      </Head>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-gray-900">CoreValidate</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Verify Content
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
        {/* Trust Score Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="p-8 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 ${getScoreBg(report.trustScore)}`}>
              <span className={`text-3xl font-bold ${getScoreColor(report.trustScore)}`}>
                {report.trustScore}
              </span>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getVerdictColor(report.verdict)} mb-4`}>
              {getVerdictIcon(report.verdict)}
              <span className="text-lg font-semibold capitalize">{report.verdict}</span>
            </div>
            <div className="text-sm text-gray-500">
              Confidence: {report.confidence}%
            </div>
          </div>

          {/* Content Info */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-3">
              {getContentTypeIcon(report.contentType)}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {report.url || `${report.contentType} content`}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {report.contentType} • Verified {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>
              {report.url && (
                <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Verification Checks */}
        {report.checks && report.checks.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Verification Details</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {report.checks.map((check, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{check.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      check.status === 'passed' ? 'bg-green-100 text-green-700' :
                      check.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {check.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          check.score >= 80 ? 'bg-green-500' :
                          check.score >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${check.score}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-bold ${getScoreColor(check.score)}`}>{check.score}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{check.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Share This Report</h2>
          </div>
          <div className="p-6">
            {/* Share URL */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={report.shareUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(report.shareUrl)}>
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={shareOnTwitter} className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter
              </Button>
              <Button variant="outline" size="sm" onClick={shareOnFacebook} className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
              <Button variant="outline" size="sm" onClick={shareOnLinkedIn} className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </Button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            Want to verify more content?
          </p>
          <Link href="/sign-up">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Try CoreValidate Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
    </>
  );
}
