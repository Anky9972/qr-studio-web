'use client';

import { QrCode, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function TermsPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <QrCode className="text-blue-500" size={32} />
              <h1 className="text-xl font-bold">QR Studio</h1>
            </Link>
            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: December 2, 2025</p>

        <div className="space-y-8 prose prose-invert max-w-none">
          <div>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
            By accessing and using QR Studio ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p className="text-gray-300 mb-4">
              Permission is granted to temporarily download one copy of the materials on QR Studio's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-8 mb-4 space-y-2 text-gray-300">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on QR Studio's website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">3. Account Terms</h2>
            <p className="text-gray-300">
              • You must be 18 years or older to use this Service.<br/>
              • You must provide your legal full name, a valid email address, and any other information requested in order to complete the signup process.<br/>
              • You are responsible for maintaining the security of your account and password.<br/>
              • You may not use the Service for any illegal or unauthorized purpose.<br/>
              • You must not transmit any worms or viruses or any code of a destructive nature.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">4. QR Code Usage</h2>
            <p className="text-gray-300">
              • QR codes generated using QR Studio remain your property.<br/>
              • You are solely responsible for the content encoded in QR codes you create.<br/>
              • QR Studio reserves the right to disable QR codes that violate our Acceptable Use Policy.<br/>
              • Dynamic QR codes require an active subscription to remain functional.<br/>
              • Static QR codes will continue to work independently of your subscription status.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">5. Payment Terms</h2>
            <p className="text-gray-300">
              • Paid plans are billed in advance on a monthly or annual basis.<br/>
              • All fees are exclusive of all taxes, levies, or duties.<br/>
              • Refunds are processed according to our 30-day money-back guarantee.<br/>
              • Failure to pay will result in suspension of your account.<br/>
              • Price changes will be notified 30 days in advance.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">6. Cancellation and Termination</h2>
            <p className="text-gray-300">
              • You may cancel your account at any time from your account settings.<br/>
              • Upon cancellation, your content will remain accessible for 30 days.<br/>
              • QR Studio reserves the right to suspend or terminate accounts that violate these terms.<br/>
              • All provisions of this agreement which by their nature should survive termination shall survive termination.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">7. Modifications to Service</h2>
            <p className="text-gray-300">
              QR Studio reserves the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. QR Studio shall not be liable to you or to any third party for any modification, price change, suspension or discontinuance of the Service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-300">
              In no event shall QR Studio or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use QR Studio's services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
            <p className="text-gray-300">
              Questions about the Terms of Service should be sent to us at legal@qrstudio.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
