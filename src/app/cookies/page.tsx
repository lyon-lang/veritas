'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center h-14">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-gray-900">Veritas</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: July 2, 2025</p>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. What Are Cookies</h2>
          <p className="text-gray-600 mb-4">
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Cookies</h2>
          <p className="text-gray-600 mb-4">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for the Service to function properly (e.g., keeping you logged in)</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use the Service</li>
            <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Types of Cookies We Use</h2>
          
          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Essential Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies are necessary for the Service to function. They enable core functionality such as security, authentication, and accessibility. You cannot opt out of these cookies.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Analytics Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies help us understand how visitors interact with the Service by collecting and reporting information anonymously. This helps us improve the Service.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Functional Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Third-Party Cookies</h2>
          <p className="text-gray-600 mb-4">
            We may use third-party services that place cookies on your device, including:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li><strong>Google Analytics:</strong> Website usage analysis</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Clerk:</strong> Authentication services</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Managing Cookies</h2>
          <p className="text-gray-600 mb-4">
            You can control and manage cookies through your browser settings. Most browsers allow you to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>View what cookies are stored</li>
            <li>Delete individual or all cookies</li>
            <li>Block cookies from specific sites</li>
            <li>Block all cookies</li>
            <li>Accept all cookies</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Please note that blocking cookies may affect the functionality of the Service.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Browser Settings</h2>
          <p className="text-gray-600 mb-4">
            You can manage cookies through your browser settings:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
            <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
            <li><strong>Edge:</strong> Settings → Privacy → Cookies</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Do Not Track</h2>
          <p className="text-gray-600 mb-4">
            Some browsers have a "Do Not Track" feature that lets you tell websites that you do not want to have your online activities tracked. We currently do not respond to Do Not Track signals.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Updates to This Policy</h2>
          <p className="text-gray-600 mb-4">
            We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about our use of cookies, please contact us at:
          </p>
          <p className="text-gray-600 mb-4">
            Email: privacy@veritas.app
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 text-sm">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
