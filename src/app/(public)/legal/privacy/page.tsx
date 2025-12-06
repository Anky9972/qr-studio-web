'use client';

import { QrCode, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-gray-400">Last updated: December 2, 2025</p>
        </div>

        <div className="space-y-12 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <div className="space-y-4">
              <p>
                <strong className="text-white">Account Information:</strong> When you create an account, we collect your name, email address, password, and profile information.
              </p>
              <p>
                <strong className="text-white">QR Code Data:</strong> We store the QR codes you create, including their content, design settings, and metadata.
              </p>
              <p>
                <strong className="text-white">Scan Analytics:</strong> When someone scans your QR codes, we collect anonymized data including timestamp, location (city/country), device type, browser, and referral source. We do NOT collect personal identifying information about scanners.
              </p>
              <p>
                <strong className="text-white">Usage Data:</strong> We collect information about how you use our service, including features accessed, pages viewed, and time spent.
              </p>
              <p>
                <strong className="text-white">Payment Information:</strong> Payment details are processed securely by Stripe. We do not store full credit card numbers on our servers.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>To provide, maintain, and improve our services</li>
              <li>To process your transactions and manage your account</li>
              <li>To send you technical notices, updates, and support messages</li>
              <li>To respond to your comments, questions, and requests</li>
              <li>To analyze usage trends and improve user experience</li>
              <li>To detect, prevent, and address technical issues and fraud</li>
              <li>To send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Sharing and Disclosure</h2>
            <p className="mb-4">
              We do not sell your personal information. We may share your information only in these circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-white">Service Providers:</strong> We share data with third-party vendors who perform services on our behalf (e.g., Stripe for payments, AWS for hosting)</li>
              <li><strong className="text-white">Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests</li>
              <li><strong className="text-white">Business Transfers:</strong> Information may be transferred if we are involved in a merger, acquisition, or sale of assets</li>
              <li><strong className="text-white">With Your Consent:</strong> We may share information with your explicit permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Encryption in transit (HTTPS/TLS) and at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication requirements</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>Regular backups and disaster recovery procedures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Active account data is retained while your account is active</li>
              <li>After account deletion, personal data is removed within 30 days</li>
              <li>QR code scan analytics are retained for 24 months</li>
              <li>Backup copies are purged within 90 days</li>
              <li>Legal requirements may require longer retention periods</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights (GDPR Compliance)</h2>
            <p className="mb-4">
              If you are in the European Economic Area (EEA), you have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
              <li><strong className="text-white">Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong className="text-white">Erasure:</strong> Request deletion of your personal data (&quot;right to be forgotten&quot;)</li>
              <li><strong className="text-white">Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong className="text-white">Objection:</strong> Object to processing of your data</li>
              <li><strong className="text-white">Restriction:</strong> Request restriction of processing</li>
              <li><strong className="text-white">Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar technologies for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-white">Essential Cookies:</strong> Required for authentication and service functionality</li>
              <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how you use our service</li>
              <li><strong className="text-white">Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings. Disabling cookies may affect service functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Children&apos;s Privacy</h2>
            <p>
              Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal data, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Standard Contractual Clauses approved by the European Commission</li>
              <li>Privacy Shield Framework compliance (where applicable)</li>
              <li>Adequate country determinations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes via email or prominent notice on our website. Continued use of the service after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
            <p className="mb-4">
              For privacy-related questions or to exercise your rights, contact us at:
            </p>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-2">
              <p>
                <strong className="text-white">Email:</strong> <a href="mailto:privacy@qrstudio.com" className="text-blue-400 hover:text-blue-300">privacy@qrstudio.com</a>
              </p>
              <p>
                <strong className="text-white">Data Protection Officer:</strong> <a href="mailto:dpo@qrstudio.com" className="text-blue-400 hover:text-blue-300">dpo@qrstudio.com</a>
              </p>
              <p>
                <strong className="text-white">Address:</strong> QR Studio, Inc., 123 Tech Street, San Francisco, CA 94105, USA
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
