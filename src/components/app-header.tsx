'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';

interface AppHeaderProps {
  showNav?: boolean;
}

export function AppHeader({ showNav = true }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="CoreValidate Logo" className="h-8 w-auto object-contain" />
              <span className="hidden sm:block font-semibold text-gray-900">CoreValidate</span>
            </Link>
            {showNav && (
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/docs" className="text-sm text-gray-600 hover:text-gray-900">
                  API Docs
                </Link>
              </nav>
            )}
          </div>
          {showNav && (
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>
      {showNav && mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-3">
          <Link href="/dashboard" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/docs" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
            API Docs
          </Link>
        </div>
      )}
    </header>
  );
}
