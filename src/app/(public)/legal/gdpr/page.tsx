'use client';

import Link from 'next/link';
import {
  QrCode,
  ArrowLeft,
  CheckCircle,
  Lock,
  Download,
  Trash2,
  Settings,
  Shield,
  Gavel,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Separator } from '@/components/ui/separator';

export default function GDPRPage() {
  const rights = [
    {
      icon: <Shield size={24} />,
      title: 'Right to Access',
      description: 'You have the right to request a copy of all personal data we hold about you.'
    },
    {
      icon: <Settings size={24} />,
      title: 'Right to Rectification',
      description: 'You can request correction of inaccurate or incomplete personal data.'
    },
    {
      icon: <Trash2 size={24} />,
      title: 'Right to Erasure',
      description: 'You can request deletion of your personal data (right to be forgotten).'
    },
    {
      icon: <Lock size={24} />,
      title: 'Right to Restrict Processing',
      description: 'You can request limitation of how we process your personal data.'
    },
    {
      icon: <Download size={24} />,
      title: 'Right to Data Portability',
      description: 'You can request your data in a structured, machine-readable format.'
    },
    {
      icon: <Gavel size={24} />,
      title: 'Right to Object',
      description: 'You can object to processing of your personal data for specific purposes.'
    }
  ];

  const dataWeCollect = [
    {
      category: 'Account Information',
      items: ['Name', 'Email address', 'Password (encrypted)', 'Profile picture', 'Company name']
    },
    {
      category: 'QR Code Data',
      items: ['QR code content', 'Design settings', 'Custom domains', 'Metadata', 'Creation timestamps']
    },
    {
      category: 'Analytics Data',
      items: ['Scan timestamps', 'Geographic location (city/country)', 'Device type', 'Browser information', 'Referral source']
    },
    {
      category: 'Usage Data',
      items: ['Features accessed', 'Pages viewed', 'Session duration', 'IP address (anonymized)', 'Cookies']
    },
    {
      category: 'Payment Information',
      items: ['Billing address', 'Payment method (via Stripe)', 'Transaction history', 'Invoice details']
    }
  ];

  const howWeUseData = [
    'Provide and maintain our QR code services',
    'Process your transactions and manage subscriptions',
    'Send you important service notifications',
    'Provide customer support',
    'Analyze usage patterns to improve our platform',
    'Prevent fraud and abuse',
    'Comply with legal obligations',
    'Send marketing communications (with your consent)'
  ];

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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-500 text-white">GDPR Compliant</Badge>
          <h1 className="text-4xl font-bold mb-4">GDPR Compliance</h1>
          <p className="text-lg text-gray-400 mb-2">
            Your data protection rights under the General Data Protection Regulation
          </p>
          <p className="text-sm text-gray-500">Last updated: December 3, 2025</p>
        </div>

        <Alert className="mb-8 bg-blue-500/10 border-blue-500/20 text-blue-400">
          <AlertDescription>
            QR Studio is committed to protecting your privacy and ensuring compliance with GDPR.
            This page explains your rights and how we handle your personal data.
          </AlertDescription>
        </Alert>

        {/* Your Rights Section */}
        <Card variant="glass" className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-blue-500" size={32} />
              <h2 className="text-3xl font-bold">Your Data Protection Rights</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Under GDPR, you have the following rights regarding your personal data:
            </p>

            <div className="grid gap-4">
              {rights.map((right, index) => (
                <Card key={index} variant="glass" className="border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                        {right.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">{right.title}</h3>
                        <p className="text-sm text-gray-400">{right.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data We Collect */}
        <Card variant="glass" className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4">Data We Collect</h2>
            <p className="text-gray-400 mb-6">
              We collect the following categories of personal data:
            </p>

            {dataWeCollect.map((category, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <h3 className="text-xl font-bold mb-3">{category.category}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <CheckCircle className="text-blue-500 mt-0.5 shrink-0" size={18} />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                {index < dataWeCollect.length - 1 && <Separator className="mt-6 bg-white/10" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* How We Use Data */}
        <Card variant="glass" className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4">How We Use Your Data</h2>
            <p className="text-gray-400 mb-6">
              We process your personal data for the following purposes:
            </p>

            <ul className="space-y-3">
              {howWeUseData.map((purpose, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-blue-500 mt-0.5 shrink-0" size={20} />
                  <span className="text-gray-300">{purpose}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Legal Basis */}
        <Card variant="glass" className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4">Legal Basis for Processing</h2>
            <p className="text-gray-400 mb-6">We process your data based on:</p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Gavel className="text-blue-500 mt-1 shrink-0" size={20} />
                <div>
                  <h3 className="font-bold mb-1">Contract Performance</h3>
                  <p className="text-sm text-gray-400">Processing necessary to provide our services as per our Terms of Service</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gavel className="text-blue-500 mt-1 shrink-0" size={20} />
                <div>
                  <h3 className="font-bold mb-1">Legitimate Interest</h3>
                  <p className="text-sm text-gray-400">Improving our services, fraud prevention, and security</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gavel className="text-blue-500 mt-1 shrink-0" size={20} />
                <div>
                  <h3 className="font-bold mb-1">Consent</h3>
                  <p className="text-sm text-gray-400">Marketing communications and non-essential cookies (when you opt-in)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gavel className="text-blue-500 mt-1 shrink-0" size={20} />
                <div>
                  <h3 className="font-bold mb-1">Legal Obligation</h3>
                  <p className="text-sm text-gray-400">Compliance with applicable laws and regulations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card variant="glass" className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4">Data Retention</h2>
            <p className="text-gray-400 mb-4">We retain your personal data only as long as necessary:</p>

            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Active accounts:</strong> Data retained while your account is active</li>
              <li><strong className="text-white">Deleted accounts:</strong> Most data deleted within 30 days; some retained for legal compliance (e.g., billing records)</li>
              <li><strong className="text-white">Analytics data:</strong> Anonymized data may be retained for statistical purposes</li>
              <li><strong className="text-white">Backups:</strong> Deleted data may persist in backups for up to 90 days</li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Controls */}
        <Card className="mb-8 bg-gradient-to-br from-blue-600 to-purple-600 border-none">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4">Exercise Your Rights</h2>
            <p className="mb-6 opacity-90">
              You can manage your data and privacy settings directly from your account:
            </p>

            <div className="grid gap-3">
              <Button variant="secondary" size="lg" className="w-full justify-start" asChild>
                <Link href="/dashboard/settings/privacy" className="flex items-center gap-2">
                  <Settings size={20} />
                  Privacy Settings
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full justify-start border-white text-white hover:bg-white/10" asChild>
                <Link href="/dashboard/settings/privacy?action=export" className="flex items-center gap-2">
                  <Download size={20} />
                  Export My Data
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full justify-start border-white text-white hover:bg-white/10" asChild>
                <Link href="/dashboard/settings/privacy?action=delete" className="flex items-center gap-2">
                  <Trash2 size={20} />
                  Delete My Account
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card variant="glass" className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4">International Data Transfers</h2>
            <p className="text-gray-400 mb-4">
              Your data may be transferred to and processed in countries outside the European Economic Area (EEA).
              We ensure appropriate safeguards are in place:
            </p>

            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="text-blue-500 mt-0.5 shrink-0" size={18} />
                <span className="text-gray-300">EU-US Data Privacy Framework compliance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="text-blue-500 mt-0.5 shrink-0" size={18} />
                <span className="text-gray-300">Standard Contractual Clauses (SCCs)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="text-blue-500 mt-0.5 shrink-0" size={18} />
                <span className="text-gray-300">Data encryption in transit and at rest</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card variant="glass" className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="text-blue-500" size={32} />
              <h2 className="text-3xl font-bold">Questions or Concerns?</h2>
            </div>
            <p className="text-gray-400 mb-6">
              If you have questions about our GDPR compliance or wish to exercise your rights, please contact us:
            </p>

            <div className="bg-zinc-900 p-6 rounded-lg">
              <p className="text-sm mb-1"><strong>Data Protection Officer:</strong></p>
              <p className="text-gray-400 mb-4">Email: dpo@qrstudio.com</p>

              <p className="text-sm mb-1"><strong>Support Team:</strong></p>
              <p className="text-gray-400 mb-4">Email: privacy@qrstudio.com</p>

              <p className="text-xs text-gray-500">
                We will respond to your request within 30 days as required by GDPR.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center mt-12 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400 mb-4">Related Documents:</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="outline" size="sm" asChild>
              <Link href="/legal/privacy">Privacy Policy</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/legal/terms">Terms of Service</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/legal/cookies">Cookie Policy</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
