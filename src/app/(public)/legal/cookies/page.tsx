'use client';

import { QrCode, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 py-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all">
                <QrCode className="text-white h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight">QR Studio</span>
            </Link>
            <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => window.location.href = '/'}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Cookie Policy
          </h1>
          <p className="text-gray-400">Last updated: December 2, 2025</p>
        </div>

        <div className="space-y-12 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember information about your visit, making your next visit easier and the site more useful to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How We Use Cookies</h2>
            <p className="mb-4">
              QR Studio uses cookies to enhance your experience, improve our services, and provide functionality. We use the following types of cookies:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">1. Essential Cookies</h3>
                <p className="mb-2">
                  These cookies are necessary for the website to function properly. Without these cookies, services you have requested cannot be provided.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-400">
                  <li><strong className="text-gray-200">Authentication:</strong> Keep you logged in to your account</li>
                  <li><strong className="text-gray-200">Security:</strong> Protect against cross-site request forgery (CSRF) attacks</li>
                  <li><strong className="text-gray-200">Session Management:</strong> Maintain your session state across pages</li>
                  <li><strong className="text-gray-200">Load Balancing:</strong> Distribute traffic across our servers</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2. Functional Cookies</h3>
                <p className="mb-2">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-400">
                  <li><strong className="text-gray-200">Preferences:</strong> Remember your language, theme, and display settings</li>
                  <li><strong className="text-gray-200">UI State:</strong> Remember sidebar collapse state, tab selections</li>
                  <li><strong className="text-gray-200">Recently Used:</strong> Store recently accessed QR codes for quick access</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">3. Analytics Cookies</h3>
                <p className="mb-2">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-400">
                  <li><strong className="text-gray-200">Usage Patterns:</strong> Track which features are most used</li>
                  <li><strong className="text-gray-200">Performance:</strong> Measure page load times and errors</li>
                  <li><strong className="text-gray-200">Traffic Sources:</strong> Understand how you found our website</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">4. Marketing Cookies</h3>
                <p className="mb-2">
                  These cookies may be set through our site by our advertising partners to build a profile of your interests.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-400">
                  <li><strong className="text-gray-200">Advertising:</strong> Show relevant ads across other websites</li>
                  <li><strong className="text-gray-200">Campaign Tracking:</strong> Measure effectiveness of marketing campaigns</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Third-Party Cookies</h2>
            <p className="mb-4">
              We use the following third-party services that may set cookies:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-400">
              <li><strong className="text-gray-200">Google Analytics:</strong> Website traffic analysis</li>
              <li><strong className="text-gray-200">Stripe:</strong> Payment processing</li>
              <li><strong className="text-gray-200">Intercom:</strong> Customer support chat</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Managing Cookies</h2>
            <p className="mb-4">
              You have several options for managing cookies:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Browser Settings</h3>
                <p className="mb-2">
                  Most browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-400">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies only</li>
                  <li>Delete cookies when you close your browser</li>
                  <li>View and delete individual cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Browser-Specific Instructions</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-400">
                  <li><strong className="text-gray-200">Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                  <li><strong className="text-gray-200">Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                  <li><strong className="text-gray-200">Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                  <li><strong className="text-gray-200">Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Cookie Consent Tool</h3>
                <p className="mb-2">
                  When you first visit QR Studio, you&apos;ll see a cookie consent banner. You can:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-400">
                  <li>Accept all cookies</li>
                  <li>Reject non-essential cookies</li>
                  <li>Customize your cookie preferences</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Impact of Disabling Cookies</h2>
            <p className="mb-4">
              Disabling certain cookies may affect your experience:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-400">
              <li><strong className="text-gray-200">Essential Cookies:</strong> You may not be able to log in or use key features</li>
              <li><strong className="text-gray-200">Functional Cookies:</strong> Your preferences won&apos;t be saved</li>
              <li><strong className="text-gray-200">Analytics Cookies:</strong> We won&apos;t be able to improve based on usage data</li>
              <li><strong className="text-gray-200">Marketing Cookies:</strong> You may see less relevant advertising</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cookie Retention</h2>
            <p className="mb-4">
              Different cookies have different lifespans:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-400">
              <li><strong className="text-gray-200">Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong className="text-gray-200">Persistent Cookies:</strong> Remain until they expire or you delete them (typically 30 days to 2 years)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy to reflect changes in our practices or for legal reasons. We will notify you of significant changes by posting a notice on our website or sending you an email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions about our use of cookies, please contact us at:
            </p>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
              <p className="mb-2">
                <strong className="text-white">Email:</strong> <a href="mailto:privacy@qrstudio.com" className="text-blue-400 hover:text-blue-300">privacy@qrstudio.com</a>
              </p>
              <p>
                <strong className="text-white">Website:</strong> <Link href="/support" className="text-blue-400 hover:text-blue-300">qrstudio.com/support</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
