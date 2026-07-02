'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: July 2, 2025</p>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-4">
            By accessing or using CoreValidate ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
          <p className="text-gray-600 mb-4">
            CoreValidate is a content verification platform that provides trust scores for digital content including URLs, text, images, and videos. The Service uses artificial intelligence, content credentials (C2PA), and source credibility analysis to assess content authenticity.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
          <p className="text-gray-600 mb-4">
            To access certain features, you must create an account. You are responsible for:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Providing accurate and complete information</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Acceptable Use</h2>
          <p className="text-gray-600 mb-4">You agree not to:</p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Use the Service for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Use the Service to harass, abuse, or harm others</li>
            <li>Attempt to reverse engineer the Service</li>
            <li>Use automated systems to access the Service without authorization</li>
            <li>Resell or redistribute the Service without permission</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. API Usage</h2>
          <p className="text-gray-600 mb-4">
            If you access the Service through our API:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>You must use a valid API key</li>
            <li>You must comply with rate limits</li>
            <li>You must not share your API key</li>
            <li>You must attribute CoreValidate when displaying results</li>
            <li>You must not use the API to build a competing service</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
          <p className="text-gray-600 mb-4">
            The Service and its original content, features, and functionality are owned by CoreValidate and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. User Content</h2>
          <p className="text-gray-600 mb-4">
            You retain ownership of any content you submit to the Service. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, process, and analyze such content for the purpose of providing the Service.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Accuracy of Results</h2>
          <p className="text-gray-600 mb-4">
            While we strive for accuracy, the Service provides trust scores and analysis for informational purposes only. We do not guarantee the accuracy, completeness, or reliability of any verification results. Users should use their own judgment when evaluating content.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-600 mb-4">
            To the maximum extent permitted by law, CoreValidate shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Your use or inability to use the Service</li>
            <li>Any unauthorized access to your account</li>
            <li>Any interruption or cessation of the Service</li>
            <li>Any bugs, viruses, or other harmful code</li>
            <li>Any errors or inaccuracies in the Service</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Disclaimer of Warranties</h2>
          <p className="text-gray-600 mb-4">
            The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Indemnification</h2>
          <p className="text-gray-600 mb-4">
            You agree to defend, indemnify, and hold harmless CoreValidate and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of the Service.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">12. Termination</h2>
          <p className="text-gray-600 mb-4">
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">13. Governing Law</h2>
          <p className="text-gray-600 mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">14. Changes to Terms</h2>
          <p className="text-gray-600 mb-4">
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">15. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="text-gray-600 mb-4">
            Email: legal@corevalidate.app<br />
            Address: [Your Address]
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
