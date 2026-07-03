'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Search, 
  CheckCircle, 
  Globe, 
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
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
  Sparkles,
  Fingerprint,
  ScanLine,
  Play,
  ChevronRight,
  TrendingUp,
  BadgeCheck,
  Layers,
  FileText,
  Upload,
  Link2,
  BarChart3
} from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [verifyUrl, setVerifyUrl] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [demoScore, setDemoScore] = useState(0);
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate demo score on load
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    const timer = setTimeout(() => {
      let score = 0;
      const target = 87;
      interval = setInterval(() => {
        score += 2;
        if (score >= target) {
          score = target;
          clearInterval(interval!);
          interval = null;
        }
        setDemoScore(score);
      }, 20);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleDemoVerify = () => {
    if (!verifyUrl) return;
    setDemoLoading(true);
    setTimeout(() => {
      setDemoScore(Math.floor(Math.random() * 40) + 60);
      setDemoLoading(false);
    }, 1500);
  };

  const features = [
    {
      icon: Globe,
      title: 'Source Credibility',
      description: 'Score publishers based on reputation, fact-checking history, and editorial standards.',
      color: 'blue'
    },
    {
      icon: ScanLine,
      title: 'AI Content Detection',
      description: 'Detect AI-generated text and content with advanced analysis.',
      color: 'purple'
    },
    {
      icon: FileText,
      title: 'Claims Analysis',
      description: 'Extract and verify factual claims from any text content.',
      color: 'green'
    },
    {
      icon: Shield,
      title: 'Trust Scoring',
      description: 'Get instant trust scores from 0-100 with detailed breakdowns.',
      color: 'orange'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get trust scores in under 1 second. No waiting, no guessing.',
      color: 'yellow'
    },
    {
      icon: Globe,
      title: 'API Access',
      description: 'Integrate verification into your apps with our developer API.',
      color: 'indigo'
    }
  ];

  const stats = [
    { value: '10M+', label: 'Content verified', icon: ShieldCheck },
    { value: '95%', label: 'Detection accuracy', icon: BadgeCheck },
    { value: '<1s', label: 'Verification time', icon: Clock },
    { value: '500K+', label: 'Users worldwide', icon: Users }
  ];

  const steps = [
    { step: '01', title: 'Capture or provide', description: 'Upload an image, paste a URL, or enter text. C2PA provenance data is automatically extracted when available.', icon: Upload, bgClass: 'bg-emerald-600' },
    { step: '02', title: 'Verify provenance', description: 'We check C2PA chain of custody, validate digital signatures, and analyze content authenticity.', icon: Link2, bgClass: 'bg-blue-600' },
    { step: '03', title: 'Get trust score', description: 'Instant score from 0–100 with full breakdown: provenance, AI detection, source credibility, and claims.', icon: BarChart3, bgClass: 'bg-purple-600' }
  ];

  const testimonials = [
    {
      quote: "CoreValidate has become essential for our newsroom. We verify every source before publishing.",
      author: "Sarah Chen",
      role: "Editor-in-Chief",
      company: "Tech Daily"
    },
    {
      quote: "The browser extension catches deepfakes I would have missed. Incredible accuracy.",
      author: "Michael Rodriguez",
      role: "Security Analyst",
      company: "CyberGuard"
    },
    {
      quote: "Our team uses CoreValidate to protect our brand from misinformation. Worth every penny.",
      author: "Emily Thompson",
      role: "VP Communications",
      company: "GlobalCorp"
    }
  ];

  const pricing = [
    { name: 'Free', price: 0, features: ['15 Credits / month', 'Text & Image Verification', 'Shareable reports', 'Browser extension'], popular: false },
    { name: 'Consumer', price: 10, features: ['1,000 Credits / month', 'Video & Audio Verification', 'Detailed breakdowns', 'Priority support'], popular: true },
    { name: 'Professional', price: 50, features: ['10,000 Credits / month', 'API access', 'Batch verification', 'Team features'], popular: false },
    { name: 'Enterprise', price: null, features: ['Custom Credit Limits', 'On-Premise Deployment', 'Dedicated support SLAs', 'Custom integrations'], popular: false }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center gap-2.5">
                <img src="/logo.png" alt="CoreValidate Logo" className="h-9 w-auto object-contain" />
                <span className="hidden sm:block text-lg font-semibold text-gray-900 tracking-tight">CoreValidate</span>
              </Link>
              <nav className="hidden lg:flex items-center gap-8">
                <a href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">How it works</a>
                <a href="#pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Pricing</a>
              </nav>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/sign-in"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link href="/sign-up"><Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Get started free</Button></Link>
            </div>
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 p-4 space-y-3">
            <a href="#features" className="block text-sm text-gray-600">Features</a>
            <a href="#how-it-works" className="block text-sm text-gray-600">How it works</a>
            <a href="#pricing" className="block text-sm text-gray-600">Pricing</a>
            <div className="pt-3 border-t space-y-2">
              <Link href="/sign-in"><Button variant="ghost" className="w-full justify-center">Log in</Button></Link>
              <Link href="/sign-up"><Button className="w-full justify-center bg-emerald-600">Get started free</Button></Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_50%)]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-8">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Now with image verification</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 mb-6">
              The trust layer<br /><span className="text-emerald-600">for the internet</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Verify any content in seconds. Get instant trust scores for images, text, and URLs.
            </p>

            {/* Verify Input */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input type="text" value={verifyUrl} onChange={(e) => setVerifyUrl(e.target.value)} placeholder="Paste URL, image, or text to verify..." className="flex-1 bg-transparent outline-none text-sm" onKeyDown={(e) => e.key === 'Enter' && handleDemoVerify()} />
                </div>
                <Button onClick={handleDemoVerify} disabled={demoLoading} className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-xl">
                  {demoLoading ? 'Analyzing...' : 'Verify now'}
                  {!demoLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-500" /> Free to use</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-500" /> Instant results</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-500" /> No sign up required</span>
              </div>
            </div>

            {/* Demo Trust Score */}
            {demoScore > 0 && (
              <div className="max-w-md mx-auto mb-10 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm animate-fadeIn">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${demoScore >= 80 ? 'bg-green-100 text-green-600' : demoScore >= 60 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                      {demoScore}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{demoScore >= 80 ? 'Authentic' : demoScore >= 60 ? 'Caution' : 'Suspicious'}</div>
                      <div className="text-sm text-gray-500">Confidence: {demoScore + 5}%</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${demoScore >= 80 ? 'bg-green-100 text-green-700' : demoScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {demoScore >= 80 ? '✓ Trusted' : demoScore >= 60 ? '⚠ Caution' : '✗ Risk'}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['C2PA', 'AI Detection', 'Source', 'Community'].map((check, i) => (
                    <div key={i} className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">{check}</div>
                      <div className={`text-sm font-bold ${demoScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>{demoScore - 5 + i * 3}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />)}
                </div>
                <span>500K+ users</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
                <span className="ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-12 border-y border-gray-100">
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
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-emerald-600" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-6">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Verify any content,<br /><span className="text-gray-600">anywhere on the internet</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Multiple verification methods for the most accurate trust scores</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="group bg-white rounded-2xl border border-gray-200 p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-200">
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-50 flex items-center justify-center mb-6`}>
                  <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Three steps to truth</h2>
            <p className="text-lg text-gray-600">Verify any content in seconds</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-6xl font-bold text-gray-100 mb-4">{step.step}</div>
                <div className={`w-14 h-14 ${step.bgClass} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Trusted by professionals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{t.author[0]}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t.author}</div>
                    <div className="text-sm text-gray-500">{t.role} at {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple pricing</h2>
            <p className="text-lg text-gray-600">Start free, upgrade when ready</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricing.map((plan, i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 ${plan.popular ? 'border-2 border-emerald-600 shadow-xl relative' : 'border border-gray-200'}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-medium">Most popular</div>}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  {plan.price !== null ? (
                    <div className="flex items-baseline gap-1"><span className="text-3xl font-bold text-gray-900">${plan.price}</span><span className="text-gray-500 text-sm">/mo</span></div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">Custom</span>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{f}</li>
                  ))}
                </ul>
                <Link href="/sign-up">
                  <Button className={`w-full rounded-xl ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`} variant={plan.popular ? 'default' : 'outline'}>{plan.price === 0 ? 'Get started' : plan.price ? 'Start trial' : 'Contact sales'}</Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center max-w-2xl mx-auto bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">How Credits Work</h4>
            <p className="text-sm text-gray-600">
              Verifying different types of content requires varying amounts of AI compute power. 
              <br className="hidden sm:block" />
              <strong>1 Credit</strong> = Text/URL check. <strong>5 Credits</strong> = Image check. <strong>10 Credits/min</strong> = Video/Audio check.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-12 lg:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Start verifying today</h2>
            <p className="text-lg text-emerald-100 mb-10 max-w-xl mx-auto">Join 500,000+ users who trust CoreValidate</p>
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-50 px-8 rounded-xl shadow-lg">Get started free<ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.png" alt="CoreValidate Logo" className="h-9 w-auto object-contain" />
                <span className="hidden sm:block text-lg font-semibold text-gray-900">CoreValidate</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">The trust layer for the internet.</p>
            </div>
            {[
              { title: 'Product', links: [
                { name: 'Features', href: '#features' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'API', href: '/docs' },
                { name: 'Extension', href: '#' },
              ]},
              { title: 'Company', links: [
                { name: 'About', href: '/about' },
                { name: 'Blog', href: '/blog' },
                { name: 'Careers', href: '/careers' },
              ]},
              { title: 'Support', links: [
                { name: 'Help Center', href: '/help' },
                { name: 'Contact', href: '/contact' },
                { name: 'Status', href: '/status' },
              ]},
              { title: 'Legal', links: [
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Cookie Policy', href: '/cookies' },
              ]},
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-semibold text-gray-900 text-sm mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, j) => <li key={j}><a href={link.href} className="text-sm text-gray-500 hover:text-gray-900">{link.name}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">© 2025 CoreValidate. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
