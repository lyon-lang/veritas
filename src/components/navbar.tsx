'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  ctaText?: string;
  ctaHref?: string;
}

export function Navbar({ ctaText = 'Get started', ctaHref = '/sign-up' }: NavbarProps) {
  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="CoreValidate Logo" className="h-8 w-auto object-contain" />
            <span className="hidden sm:block font-semibold text-gray-900">CoreValidate</span>
          </Link>
          <Link href={ctaHref}>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">{ctaText}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
