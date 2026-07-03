'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';

import { Footer } from '@/components/footer';
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: July 2, 2025</p>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            CoreValidate ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
          
          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">2.1 Information You Provide</h3>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, password</li>
            <li><strong>Content:</strong> URLs, text, images, and videos you submit for verification</li>
            <li><strong>Payment Information:</strong> Credit card details (processed by Stripe)</li>
            <li><strong>Communications:</strong> Messages you send to our support team</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">2.2 Information Collected Automatically</h3>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li><strong>Usage Data:</strong> How you interact with the Service</li>
            <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
            <li><strong>Log Data:</strong> IP address, access times, pages viewed</li>
            <li><strong>Cookies:</strong> Session cookies, preference cookies</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">We use your information to:</p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Provide, maintain, and improve the Service</li>
            <li>Process and analyze content for verification</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Develop new products and services</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, investigate, and prevent fraudulent transactions</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Content Processing</h2>
          <p className="text-gray-600 mb-4">
            When you submit content for verification:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Content is processed to generate trust scores</li>
            <li>We may store verification results for your history</li>
            <li>Content may be used in aggregate to improve our models</li>
            <li>We do not sell your individual content to third parties</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Information Sharing</h2>
          <p className="text-gray-600 mb-4">
            We may share your information with:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li><strong>Service Providers:</strong> Companies that assist us in operating the Service</li>
            <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>With Your Consent:</strong> When you agree to sharing</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Data Security</h2>
          <p className="text-gray-600 mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
          <p className="text-gray-600 mb-4">
            We retain your personal information for as long as your account is active or as needed to provide you services. We will also retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Your Rights</h2>
          <p className="text-gray-600 mb-4">
            Depending on your location, you may have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
            <li>Withdraw consent</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Cookies</h2>
          <p className="text-gray-600 mb-4">
            We use cookies to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Keep you logged in</li>
            <li>Remember your preferences</li>
            <li>Analyze usage patterns</li>
            <li>Improve the Service</li>
          </ul>
          <p className="text-gray-600 mb-4">
            You can control cookies through your browser settings.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Third-Party Services</h2>
          <p className="text-gray-600 mb-4">
            The Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Children's Privacy</h2>
          <p className="text-gray-600 mb-4">
            The Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">12. International Data Transfers</h2>
          <p className="text-gray-600 mb-4">
            Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">13. Changes to This Policy</h2>
          <p className="text-gray-600 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">14. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-600 mb-4">
            Email: privacy@corevalidate.app<br />
            Address: [Your Address]
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 text-sm">
            ← Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
