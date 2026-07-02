'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Globe, Zap, Heart, Target, ArrowRight, Shield } from 'lucide-react';
import { Navbar } from '@/components/navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Building trust in the digital age
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're on a mission to make the internet trustworthy. In a world of deepfakes and misinformation, 
              CoreValidate gives everyone the power to verify what's real.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Target, title: 'Truth First', description: 'We believe in objective truth. Our algorithms are designed to be unbiased and transparent.' },
                { icon: Globe, title: 'For Everyone', description: 'Verification should be accessible to everyone, not just enterprises or governments.' },
                { icon: Shield, title: 'Privacy Protected', description: 'We verify content, not people. Your privacy is our priority.' },
              ].map((value, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our story</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">
                CoreValidate was born from a simple observation: in an age where anyone can create convincing fake content, 
                how do we know what to trust?
              </p>
              <p className="text-gray-600 mb-4">
                We saw deepfakes getting better every day. We saw misinformation spreading faster than truth. 
                We saw people losing trust in everything they see online.
              </p>
              <p className="text-gray-600 mb-4">
                So we built CoreValidate - a platform that uses AI, content credentials, and source analysis 
                to give every piece of content a trust score. Simple, instant, accessible.
              </p>
              <p className="text-gray-600">
                Today, CoreValidate helps hundreds of thousands of people verify what they see online. 
                We're just getting started.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'The Builder', role: 'CEO & Founder', bio: 'Former engineer who saw the trust crisis firsthand.' },
                { name: 'The Technologist', role: 'CTO', bio: 'AI expert with a passion for truth.' },
                { name: 'The Designer', role: 'Head of Product', bio: 'Making verification simple and beautiful.' },
              ].map((member, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-emerald-600 mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join us</h2>
            <p className="text-lg text-gray-600 mb-8">
              Help us build the trust layer for the internet.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Get started free</Button>
              </Link>
              <Link href="/careers">
                <Button variant="outline">View careers</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
