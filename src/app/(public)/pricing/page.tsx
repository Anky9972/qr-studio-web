'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  QrCode,
  Check,
  X,
  ChevronDown,
  ArrowRight,
  Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/Input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function PricingPage() {
  const { data: session } = useSession();
  const [isAnnual, setIsAnnual] = useState(false);
  const [qrCodes, setQrCodes] = useState(100);
  const [teamMembers, setTeamMembers] = useState(1);

  const pricingPlans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Perfect for personal projects and trying out QR Studio',
      features: [
        { text: '50 QR codes', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'Standard customization', included: true },
        { text: 'PNG/SVG export', included: true },
        { text: 'Scan history (100 items)', included: true },
        { text: 'Dynamic QR codes', included: false },
        { text: 'Bulk generation', included: false },
        { text: 'Team collaboration', included: false },
        { text: 'API access', included: false },
        { text: 'Priority support', included: false }
      ],
      cta: 'Get Started',
      highlighted: false,
      limits: {
        qrCodes: 50,
        scans: 'Unlimited',
        dynamic: 0,
        bulk: 0,
        teamMembers: 1,
        apiCalls: 0
      }
    },
    {
      name: 'Pro',
      monthlyPrice: 19,
      annualPrice: 190,
      description: 'Ideal for professionals and small businesses',
      features: [
        { text: '100 dynamic QR codes', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Full customization', included: true },
        { text: 'All export formats', included: true },
        { text: 'Unlimited scan history', included: true },
        { text: 'Bulk generation (1,000/batch)', included: true },
        { text: 'Password protection', included: true },
        { text: 'Custom expiration dates', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Team collaboration', included: false }
      ],
      cta: 'Start Free Trial',
      highlighted: true,
      limits: {
        qrCodes: 100,
        scans: 'Unlimited',
        dynamic: 100,
        bulk: 1000,
        teamMembers: 1,
        apiCalls: 0
      }
    },
    {
      name: 'Business',
      monthlyPrice: 49,
      annualPrice: 490,
      description: 'For growing teams and businesses',
      features: [
        { text: '1,000 dynamic QR codes', included: true },
        { text: 'Advanced analytics & reports', included: true },
        { text: 'Full customization + frames', included: true },
        { text: 'All export formats + PDF', included: true },
        { text: 'Unlimited scan history', included: true },
        { text: 'Bulk generation (10,000/batch)', included: true },
        { text: 'Team collaboration (10 members)', included: true },
        { text: 'Role-based access control', included: true },
        { text: 'API access (10,000 calls/month)', included: true },
        { text: 'Priority support + phone', included: true }
      ],
      cta: 'Start Free Trial',
      highlighted: false,
      limits: {
        qrCodes: 1000,
        scans: 'Unlimited',
        dynamic: 1000,
        bulk: 10000,
        teamMembers: 10,
        apiCalls: 10000
      }
    },
    {
      name: 'Enterprise',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Custom solutions for large organizations',
      features: [
        { text: 'Unlimited QR codes', included: true },
        { text: 'Custom analytics & reports', included: true },
        { text: 'White-label options', included: true },
        { text: 'All export formats', included: true },
        { text: 'Unlimited scan history', included: true },
        { text: 'Unlimited bulk generation', included: true },
        { text: 'Unlimited team members', included: true },
        { text: 'Custom roles & permissions', included: true },
        { text: 'Unlimited API access', included: true },
        { text: 'Dedicated account manager', included: true }
      ],
      cta: 'Contact Sales',
      highlighted: false,
      limits: {
        qrCodes: 'Unlimited',
        scans: 'Unlimited',
        dynamic: 'Unlimited',
        bulk: 'Unlimited',
        teamMembers: 'Unlimited',
        apiCalls: 'Unlimited'
      }
    }
  ];

  const allFeatures = [
    { category: 'QR Code Generation', features: [
      { name: 'Static QR codes', free: '50', pro: '100', business: '1,000', enterprise: 'Unlimited' },
      { name: 'Dynamic QR codes', free: '0', pro: '100', business: '1,000', enterprise: 'Unlimited' },
      { name: 'Bulk generation', free: '-', pro: '1,000/batch', business: '10,000/batch', enterprise: 'Unlimited' },
      { name: 'QR code types', free: '25+', pro: '25+', business: '25+', enterprise: '25+' },
      { name: 'Custom expiration', free: false, pro: true, business: true, enterprise: true },
      { name: 'Password protection', free: false, pro: true, business: true, enterprise: true }
    ]},
    { category: 'Design & Customization', features: [
      { name: 'Color customization', free: true, pro: true, business: true, enterprise: true },
      { name: 'Logo upload', free: true, pro: true, business: true, enterprise: true },
      { name: 'Pattern styles', free: '5', pro: '10+', business: '10+', enterprise: 'Custom' },
      { name: 'Frames & templates', free: false, pro: '20+', business: '50+', enterprise: 'Custom' },
      { name: 'Export formats', free: 'PNG/SVG', pro: 'PNG/SVG/JPEG', business: 'All + PDF', enterprise: 'All' }
    ]},
    { category: 'Analytics & Tracking', features: [
      { name: 'Scan tracking', free: 'Basic', pro: 'Advanced', business: 'Advanced', enterprise: 'Custom' },
      { name: 'Scan history', free: '100 items', pro: 'Unlimited', business: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'Geographic insights', free: false, pro: true, business: true, enterprise: true },
      { name: 'Device analytics', free: false, pro: true, business: true, enterprise: true },
      { name: 'Custom reports', free: false, pro: false, business: true, enterprise: true },
      { name: 'Real-time dashboard', free: false, pro: true, business: true, enterprise: true }
    ]},
    { category: 'Collaboration', features: [
      { name: 'Team members', free: '1', pro: '1', business: '10', enterprise: 'Unlimited' },
      { name: 'Shared libraries', free: false, pro: false, business: true, enterprise: true },
      { name: 'Role-based access', free: false, pro: false, business: true, enterprise: true },
      { name: 'Activity logs', free: false, pro: false, business: true, enterprise: true },
      { name: 'Brand kits', free: false, pro: false, business: true, enterprise: true }
    ]},
    { category: 'Integrations', features: [
      { name: 'API access', free: false, pro: false, business: '10k calls/mo', enterprise: 'Unlimited' },
      { name: 'Webhooks', free: false, pro: false, business: true, enterprise: true },
      { name: 'Custom domains', free: false, pro: false, business: true, enterprise: true },
      { name: 'White-label', free: false, pro: false, business: false, enterprise: true }
    ]},
    { category: 'Support', features: [
      { name: 'Email support', free: 'Community', pro: 'Priority', business: 'Priority', enterprise: '24/7' },
      { name: 'Response time', free: '48h', pro: '24h', business: '12h', enterprise: '1h' },
      { name: 'Phone support', free: false, pro: false, business: true, enterprise: true },
      { name: 'Dedicated manager', free: false, pro: false, business: false, enterprise: true }
    ]}
  ];

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged a prorated amount for the remainder of your billing cycle. When downgrading, the change takes effect at the end of your current billing period.'
    },
    {
      question: 'What happens when I exceed my plan limits?',
      answer: 'We\'ll send you a notification when you reach 80% of your limits. If you exceed your QR code limit, you\'ll need to delete existing codes or upgrade. Scans are always unlimited on all plans.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact support within 30 days of purchase for a full refund, no questions asked.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal. Enterprise plans can be invoiced with NET-30 terms.'
    },
    {
      question: 'Is there a discount for annual billing?',
      answer: 'Yes! Annual plans receive 2 months free (save 16%). Toggle between monthly and annual pricing above to see the savings.'
    },
    {
      question: 'What happens to my QR codes if I cancel?',
      answer: 'Static QR codes continue working forever. Dynamic QR codes will redirect to a generic page after 30 days. You can export all your data before canceling.'
    },
    {
      question: 'Do you offer educational or nonprofit discounts?',
      answer: 'Yes! We offer 50% off Pro and Business plans for verified educational institutions and registered nonprofits. Contact sales@qrstudio.com with proof of status.'
    }
  ];

  const calculateRecommendedPlan = () => {
    if (qrCodes <= 50 && teamMembers === 1) return 'Free';
    if (qrCodes <= 100 && teamMembers === 1) return 'Pro';
    if (qrCodes <= 1000 && teamMembers <= 10) return 'Business';
    return 'Enterprise';
  };

  const renderFeatureValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? <Check className="text-green-500" size={20} /> : <X className="text-red-500" size={20} />;
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 bg-white/20 border-white/30 text-white">PRICING</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {session?.user ? `${session.user.name?.split(' ')[0]}, Choose Your Plan` : 'Simple, Transparent Pricing'}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {session?.user 
                ? 'Upgrade to unlock more features and grow your QR code capabilities.'
                : 'Choose the perfect plan for your needs. All plans include a 14-day free trial.'
              }
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className={cn("text-lg font-medium", !isAnnual && "opacity-100", isAnnual && "opacity-60")}>Monthly</span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
              <div className="flex items-center gap-2">
                <span className={cn("text-lg font-medium", isAnnual && "opacity-100", !isAnnual && "opacity-60")}>Annual</span>
                <Badge className="bg-green-500 text-white">Save 16%</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-wrap gap-6 justify-center">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              variant="glass"
              className={cn(
                "flex-1 min-w-[280px] max-w-[350px] relative",
                plan.highlighted && "border-2 border-blue-500 scale-105 shadow-xl shadow-blue-500/20"
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white">
                  MOST POPULAR
                </Badge>
              )}
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
                  {plan.description}
                </p>
                <div className="mb-6">
                  {plan.name === 'Enterprise' ? (
                    <h4 className="text-3xl font-bold">Custom</h4>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">
                        ${isAnnual ? Math.floor(plan.annualPrice / 12) : plan.monthlyPrice}
                      </span>
                      <span className="text-gray-400">/month</span>
                      {isAnnual && plan.monthlyPrice > 0 && (
                        <p className="text-xs text-green-500 mt-1">
                          ${plan.annualPrice}/year - Save ${(plan.monthlyPrice * 12) - plan.annualPrice}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <Button
                  variant={plan.highlighted ? 'premium' : 'outline'}
                  className="w-full mb-6"
                  size="lg"
                  asChild
                >
                  <Link
                    href={
                      plan.name === 'Enterprise' 
                        ? '/support' 
                        : session?.user 
                          ? '/dashboard/billing'
                          : '/signup'
                    }
                  >
                    {plan.name === 'Enterprise' ? plan.cta : session?.user ? 'Upgrade Now' : plan.cta}
                  </Link>
                </Button>
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      {feature.included ? (
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                      ) : (
                        <X className="text-red-500 mt-0.5 opacity-30 flex-shrink-0" size={18} />
                      )}
                      <span className={cn("text-sm", feature.included ? "text-white" : "text-gray-500")}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing Calculator */}
      <div className="py-16 bg-zinc-900">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <Calculator className="text-blue-500 mx-auto mb-4" size={48} />
            <h2 className="text-3xl font-bold mb-2">Not Sure Which Plan?</h2>
            <p className="text-lg text-gray-400">Use our calculator to find the perfect plan for your needs</p>
          </div>
          <Card variant="glass" className="p-6">
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">How many QR codes do you need?</label>
                <Input
                  type="number"
                  value={qrCodes}
                  onChange={(e) => setQrCodes(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Estimate the total number of QR codes you'll create</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">How many team members?</label>
                <Input
                  type="number"
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Number of people who will access the account</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 rounded-lg text-center">
                <p className="text-lg mb-2">Recommended Plan:</p>
                <h3 className="text-4xl font-bold mb-4">{calculateRecommendedPlan()}</h3>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-2">Detailed Feature Comparison</h2>
        <p className="text-lg text-gray-400 text-center mb-8">Compare all features across plans</p>
        {allFeatures.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h3 className="text-2xl font-bold mb-4">{section.category}</h3>
            <div className="rounded-lg border border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-900">
                    <TableHead className="font-bold text-white">Feature</TableHead>
                    <TableHead className="text-center font-bold text-white">Free</TableHead>
                    <TableHead className="text-center font-bold text-white">Pro</TableHead>
                    <TableHead className="text-center font-bold text-white">Business</TableHead>
                    <TableHead className="text-center font-bold text-white">Enterprise</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.features.map((feature, featureIndex) => (
                    <TableRow key={featureIndex} className="border-white/10">
                      <TableCell>{feature.name}</TableCell>
                      <TableCell className="text-center">{renderFeatureValue(feature.free)}</TableCell>
                      <TableCell className="text-center">{renderFeatureValue(feature.pro)}</TableCell>
                      <TableCell className="text-center">{renderFeatureValue(feature.business)}</TableCell>
                      <TableCell className="text-center">{renderFeatureValue(feature.enterprise)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-zinc-900">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-400 text-center mb-8">Everything you need to know about pricing</p>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/signup" className="flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight size={20} />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/support">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
