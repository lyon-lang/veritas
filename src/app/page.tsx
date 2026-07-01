'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Globe, 
  Image as ImageIcon, 
  FileText, 
  Video,
  ArrowRight,
  Star,
  Menu,
  X,
  Zap,
  Lock,
  Eye,
  Users,
  Building2,
  Newspaper,
  ShoppingCart,
  Landmark,
  ChevronRight,
  Play,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
  TrendingUp,
  BadgeCheck,
  Fingerprint,
  ScanLine,
  Layers
} from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [verifyUrl, setVerifyUrl] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trustDemo = {
    score: 87,
    verdict: 'authentic',
    checks: [
      { name: 'C2PA Credentials', score: 95, status: 'passed', icon: Lock },
      { name: 'AI Detection', score: 82, status: 'passed', icon: Eye },
      { name: 'Source Credibility', score: 88, status: 'passed', icon: Globe },
      { name: 'Community Trust', score: 75, status: 'warning', icon: Users },
    ]
  };

  const testimonials = [
    {
      quote: "Veritas has become essential for our newsroom. We verify every source before publishing.",
      author: "Sarah Chen",
      role: "Editor-in-Chief",
      company: "Tech Daily",
      rating: 5
    },
    {
      quote: "The browser extension catches deepfakes I would have missed. Incredible accuracy.",
      author: "Michael Rodriguez",
      role: "Security Analyst",
      company: "CyberGuard",
      rating: 5
    },
    {
      quote: "Our team uses Veritas to protect our brand from misinformation. Worth every penny.",
      author: "Emily Thompson",
      role: "VP Communications",
      company: "GlobalCorp",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900 tracking-tight">Veritas</span>
              </Link>
              <nav className="hidden lg:flex items-center gap-8">
                <a href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">How it works</a>
                <a href="#pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Pricing</a>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">API</a>
              </nav>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="text-gray-600">Log in</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                  Start free trial
                </Button>
              </Link>
            </div>
            <button 
              className="lg:hidden p-2 -mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 py-4 space-y-1">
              <a href="#features" className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Features</a>
              <a href="#how-it-works" className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">How it works</a>
              <a href="#pricing" className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Pricing</a>
              <a href="#" className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">API</a>
              <div className="pt-4 space-y-2">
                <Link href="/sign-in" className="block">
                  <Button variant="ghost" className="w-full justify-center">Log in</Button>
                </Link>
                <Link href="/sign-up" className="block">
                  <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700">Start free trial</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-8">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Now with C2PA support</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 mb-6">
              The trust layer
              <br />
              <span className="text-blue-600">for the internet</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Verify any content in seconds. Get instant trust scores for images, 
              videos, text, and URLs. Know what's real.
            </p>

            {/* Verify Input */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={verifyUrl}
                    onChange={(e) => setVerifyUrl(e.target.value)}
                    placeholder="Paste a URL, image, or text to verify..."
                    className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl shadow-sm">
                  Verify now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  Free to use
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  Instant results
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  No sign up required
                </span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                  ))}
                </div>
                <span>500K+ users</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Score Demo */}
      <section className="py-20 px-4 bg-gray-50/50">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Content Analysis</div>
                    <div className="text-sm text-gray-500">reuters.com/article/123</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-green-600">{trustDemo.score}</div>
                  <div className="text-sm text-gray-500">/ 100</div>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div className="px-8 py-4 bg-green-50/50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-green-900">Authentic Content</div>
                  <div className="text-sm text-green-700">This content appears to be from a trusted source with verified credentials</div>
                </div>
              </div>
            </div>

            {/* Checks */}
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trustDemo.checks.map((check, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      check.status === 'passed' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <check.icon className={`h-5 w-5 ${
                        check.status === 'passed' ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{check.name}</span>
                        <span className={`text-sm font-semibold ${
                          check.score >= 80 ? 'text-green-600' : 'text-yellow-600'
                        }`}>{check.score}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            check.score >= 80 ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${check.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-16 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-8">Trusted by leading organizations</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40">
            {['Reuters', 'BBC', 'NYT', 'Bloomberg', 'Nature', 'AP News'].map((name, i) => (
              <span key={i} className="text-lg font-semibold text-gray-400">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '10M+', label: 'Content verified', icon: ShieldCheck },
              { value: '95%', label: 'Detection accuracy', icon: Target },
              { value: '<1s', label: 'Verification time', icon: Clock },
              { value: '500K+', label: 'Users worldwide', icon: Users },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-gray-50/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Verify any content,
              <br />
              <span className="text-gray-600">anywhere on the internet</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Multiple verification methods combine to give you the most accurate trust scores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Fingerprint,
                title: 'C2PA Credentials',
                description: 'Read and verify Content Credentials - the industry standard for content provenance and authenticity.',
                color: 'blue',
                gradient: 'from-blue-500 to-blue-600'
              },
              {
                icon: ScanLine,
                title: 'AI Detection',
                description: 'Detect deepfakes and AI-generated images, videos, and text with state-of-the-art accuracy.',
                color: 'purple',
                gradient: 'from-purple-500 to-purple-600'
              },
              {
                icon: Globe,
                title: 'Source Credibility',
                description: 'Score publishers based on reputation, fact-checking history, and editorial bias analysis.',
                color: 'green',
                gradient: 'from-green-500 to-emerald-600'
              },
              {
                icon: ImageIcon,
                title: 'Image Verification',
                description: 'Verify images for manipulation, metadata integrity, and reverse image search matching.',
                color: 'orange',
                gradient: 'from-orange-500 to-orange-600'
              },
              {
                icon: FileText,
                title: 'Text Analysis',
                description: 'Analyze text for AI generation patterns, factual accuracy, and source verification.',
                color: 'red',
                gradient: 'from-red-500 to-red-600'
              },
              {
                icon: Video,
                title: 'Video Verification',
                description: 'Detect deepfake videos and verify video authenticity, provenance, and editing history.',
                color: 'indigo',
                gradient: 'from-indigo-500 to-indigo-600'
              },
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white rounded-2xl border border-gray-200 p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-200">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-sm`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Three steps to truth
            </h2>
            <p className="text-lg text-gray-600">
              Verify any content in seconds, not minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Paste content',
                description: 'Enter a URL, upload an image, or paste text you want to verify.',
                icon: Search,
                color: 'bg-blue-600'
              },
              {
                step: '02',
                title: 'We analyze',
                description: 'Our AI checks C2PA credentials, detects fakes, and evaluates the source.',
                icon: ScanLine,
                color: 'bg-purple-600'
              },
              {
                step: '03',
                title: 'Get trust score',
                description: 'Receive an instant trust score with detailed breakdown and verdict.',
                icon: ShieldCheck,
                color: 'bg-green-600'
              },
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="text-6xl font-bold text-gray-100 mb-4">{step.step}</div>
                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              For everyone who needs
              <br />
              <span className="text-gray-600">to know what's real</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Newspaper, title: 'Journalists', description: 'Verify sources and content before publishing stories', color: 'blue' },
              { icon: Users, title: 'Consumers', description: 'Check what you see on social media and news', color: 'green' },
              { icon: Building2, title: 'Businesses', description: 'Protect your brand from misinformation attacks', color: 'purple' },
              { icon: Landmark, title: 'Governments', description: 'Combat election interference and propaganda', color: 'orange' },
            ].map((useCase, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200">
                <div className={`w-14 h-14 rounded-2xl bg-${useCase.color}-50 flex items-center justify-center mb-6`}>
                  <useCase.icon className={`h-7 w-7 text-${useCase.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Trusted by professionals
            </h2>
            <p className="text-lg text-gray-600">
              See what our users are saying
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{testimonial.author[0]}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-gray-50/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600">
              Start verifying for free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Free', price: 0, features: ['Basic trust scores', '5 verifications/day', 'Browser extension'], cta: 'Get started', popular: false },
              { name: 'Consumer', price: 10, features: ['Detailed scores', 'Unlimited verifications', 'Mobile app', 'API access'], cta: 'Start trial', popular: true },
              { name: 'Professional', price: 50, features: ['Everything in Consumer', 'Priority support', 'Custom reports', 'Team access'], cta: 'Start trial', popular: false },
              { name: 'Enterprise', price: null, features: ['Custom integrations', 'Dedicated support', 'SLA', 'White label'], cta: 'Contact sales', popular: false },
            ].map((plan, i) => (
              <div key={i} className={`relative bg-white rounded-2xl p-8 ${
                plan.popular 
                  ? 'border-2 border-blue-600 shadow-xl shadow-blue-600/10' 
                  : 'border border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                    Most popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  {plan.price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">Custom</span>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up">
                  <Button 
                    className={`w-full rounded-xl ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 lg:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                Start verifying content today
              </h2>
              <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">
                Join 500,000+ users who trust Veritas to verify what they see online
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 rounded-xl shadow-lg">
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 rounded-xl">
                    <Play className="mr-2 h-4 w-4" />
                    Watch demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">Veritas</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                The trust layer for the internet. Verify any content, anywhere, instantly.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API', 'Extension'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Resources', links: ['Documentation', 'Help Center', 'Status', 'Security'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookie Policy'] },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-semibold text-gray-900 text-sm mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© 2025 Veritas. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Target(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );
}
