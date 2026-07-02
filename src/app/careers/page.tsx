'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, MapPin, Clock, Briefcase, ArrowRight, Users, Zap, Heart } from 'lucide-react';

export default function CareersPage() {
  const positions = [
    {
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build the AI models that verify content authenticity.',
    },
    {
      title: 'Full-Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build the platform that millions will use to verify content.',
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Design beautiful, simple interfaces for complex verification.',
    },
    {
      title: 'Growth Marketing Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help us reach millions of users who need verification.',
    },
    {
      title: 'Developer Advocate',
      department: 'DevRel',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build the developer community around our API.',
    },
  ];

  const perks = [
    { icon: Users, title: 'Remote-first', description: 'Work from anywhere in the world' },
    { icon: Zap, title: 'Equity', description: 'Meaningful ownership in the company' },
    { icon: Heart, title: 'Health benefits', description: 'Comprehensive health coverage' },
    { icon: Clock, title: 'Flexible hours', description: 'Work when you\'re most productive' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-gray-900">Veritas</span>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Build the future of trust
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join us in making the internet trustworthy. We're looking for passionate people 
              who want to solve one of the biggest problems of our time.
            </p>
          </div>
        </section>

        {/* Perks */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {perks.map((perk, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <perk.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{perk.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{perk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Open positions</h2>
            <div className="space-y-4">
              {positions.map((position, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Briefcase className="h-3.5 w-3.5" />
                          {position.department}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          {position.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">{position.description}</p>
                    </div>
                    <Button variant="outline" size="sm" className="flex-shrink-0">
                      Apply <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Don't see your role?</h2>
            <p className="text-gray-600 mb-6">
              We're always looking for talented people. Send us your resume and tell us how you can help.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Send us your resume
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
