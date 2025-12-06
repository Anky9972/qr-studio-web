'use client';

import { useState } from 'react';
import {
  QrCode,
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
  FileText,
  Send
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactMethods = [
    {
      icon: <Mail className="text-4xl" />,
      title: 'Email Support',
      description: 'Get help via email',
      detail: 'support@qrstudio.com',
      availability: 'Response within 24 hours',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      icon: <MessageCircle className="text-4xl" />,
      title: 'Live Chat',
      description: 'Chat with our team',
      detail: 'Available in-app',
      availability: 'Mon-Fri, 9am-6pm PST',
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
    {
      icon: <Phone className="text-4xl" />,
      title: 'Phone Support',
      description: 'Business & Enterprise plans',
      detail: '+1 (555) 123-4567',
      availability: 'Mon-Fri, 9am-6pm PST',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    {
      icon: <FileText className="text-4xl" />,
      title: 'Documentation',
      description: 'Guides and tutorials',
      detail: 'docs.qrstudio.com',
      availability: 'Available 24/7',
      color: 'text-orange-400',
      bg: 'bg-orange-400/10'
    }
  ];

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create my first QR code?',
          a: 'Sign up for a free account, navigate to the Generate tab, choose your QR code type, enter your content, customize the design, and click Generate. You can download your QR code immediately or save it to your account.'
        },
        {
          q: 'What QR code types are supported?',
          a: 'We support 25+ types including URL, vCard (business cards), WiFi, Email, SMS, Phone, Calendar events, Location, and more. Each type has specific fields optimized for that use case.'
        },
        {
          q: 'Can I try QR Studio for free?',
          a: 'Yes! Our Free plan includes 50 QR codes, basic analytics, and standard customization. Paid plans start at $19/month and include a 14-day free trial with no credit card required.'
        }
      ]
    },
    {
      category: 'Dynamic QR Codes',
      questions: [
        {
          q: 'What is a dynamic QR code?',
          a: 'A dynamic QR code allows you to change the destination URL after the code is created and printed. The QR code contains a short URL that redirects to your actual destination, which you can edit anytime from your dashboard.'
        },
        {
          q: 'Can I edit static QR codes?',
          a: 'No, static QR codes permanently encode the content. Once generated, they cannot be changed. That\'s why we recommend dynamic QR codes for marketing materials, product packaging, and any long-term use.'
        },
        {
          q: 'Do dynamic QR codes expire?',
          a: 'Dynamic QR codes remain active as long as your subscription is active. You can also set optional expiration dates for time-sensitive campaigns. After cancellation, dynamic codes remain active for 30 days.'
        }
      ]
    },
    {
      category: 'Analytics & Tracking',
      questions: [
        {
          q: 'What analytics data can I track?',
          a: 'We track scan counts, timestamps, geographic location (city/country), device types, browsers, operating systems, and referral sources. All data is anonymized and GDPR-compliant—we don\'t collect personal identifiable information.'
        },
        {
          q: 'How accurate is location tracking?',
          a: 'Location is determined by the scanner\'s IP address and provides city/country-level accuracy. We don\'t use GPS or require location permissions, making scanning frictionless for users.'
        },
        {
          q: 'Can I export analytics data?',
          a: 'Yes! All plans allow CSV export of scan data. Business and Enterprise plans include custom reports and API access for advanced analytics integrations.'
        }
      ]
    },
    {
      category: 'Billing & Plans',
      questions: [
        {
          q: 'Can I change plans anytime?',
          a: 'Yes! Upgrade or downgrade at any time. Upgrades are prorated for the remainder of your billing cycle. Downgrades take effect at the end of your current billing period to ensure you receive full value.'
        },
        {
          q: 'What happens if I exceed my plan limits?',
          a: 'You\'ll receive notifications at 80% and 100% of your limits. If you exceed your QR code limit, you\'ll need to delete existing codes or upgrade. Scans are always unlimited on all plans.'
        },
        {
          q: 'Do you offer refunds?',
          a: 'Yes! We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact support within 30 days for a full refund, no questions asked.'
        }
      ]
    },
    {
      category: 'Technical',
      questions: [
        {
          q: 'What image formats can I export?',
          a: 'Free plan: PNG and SVG. Pro plan adds JPEG. Business plan adds PDF. All formats support high resolution up to 4096x4096 pixels for print quality.'
        },
        {
          q: 'Can I use my own domain for short URLs?',
          a: 'Yes! Business and Enterprise plans support custom domains (e.g., qr.yourbrand.com) for white-label dynamic QR codes. This increases brand trust and looks professional.'
        },
        {
          q: 'Is there an API?',
          a: 'Yes! Business plans include API access with 10,000 calls/month. Enterprise plans have unlimited API access. Our REST API supports QR code generation, campaign management, and analytics retrieval.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-4 bg-white/5 border-white/10 text-blue-400">
            SUPPORT
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
            How Can We Help You?
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find answers in our FAQ or reach out to our support team
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card key={index} variant="glass" className="text-center group hover:border-blue-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className={cn("w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110", method.bg, method.color)}>
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {method.description}
                  </p>
                  <p className="text-white font-medium mb-1">
                    {method.detail}
                  </p>
                  <p className="text-xs text-gray-500">
                    {method.availability}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Send Us a Message</h2>
            <p className="text-gray-400">Fill out the form below and we'll get back to you within 24 hours</p>
          </div>

          <Card variant="glass" className="p-2 border-white/10">
            <CardContent className="p-6 md:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-400 mb-2">
                    <Send className="text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                  <p className="text-gray-400 max-w-sm">
                    Thank you for contacting us! We'll respond to your message within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSubmitted(false)}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Name</label>
                      <Input
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-black/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email</label>
                      <Input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-black/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Subject</label>
                    <Input
                      required
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-black/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Message</label>
                    <Textarea
                      required
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-black/30 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="premium"
                    size="lg"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-black/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-400">Find quick answers to common questions</p>
          </div>

          <div className="space-y-12">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-xl font-bold text-white mb-6 pl-4 border-l-4 border-blue-500">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <FaqItem key={faqIndex} question={faq.q} answer={faq.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-t from-blue-900/20 to-black border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Our team is here to help you succeed
          </p>
          <Button
            size="lg"
            variant="premium"
            className="px-8 h-14 text-lg shadow-lg shadow-blue-500/25"
            onClick={() => window.location.href = 'mailto:support@qrstudio.com'}
          >
            Contact Support
          </Button>
        </div>
      </section>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden transition-all duration-300 hover:border-white/20">
      <button
        className="w-full text-left p-6 flex justify-between items-center text-white font-medium text-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <ChevronDown className={cn("transition-transform duration-300 text-gray-400", isOpen && "rotate-180")} />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5">
          {answer}
        </div>
      </div>
    </div>
  );
}
