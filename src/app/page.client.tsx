'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  QrCode,
  Activity,
  Palette,
  Zap,
  Users,
  Shield,
  Check,
  ArrowRight,
  Download,
  Star as StarIcon,
  Lock,
  LayoutDashboard
} from 'lucide-react';
import { StructuredData, createFAQItems } from '@/components/StructuredData';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

interface Stats {
  activeUsers: string;
  qrCodesCreated: string;
  uptime: string;
  support: string;
}

export default function HomePageClient() {
  const { data: session } = useSession();
  const [demoUrl, setDemoUrl] = useState('https://qrstudio.app');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    activeUsers: '10,000+',
    qrCodesCreated: '5M+',
    uptime: '99.9%',
    support: '24/7'
  });
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  // FAQ data for structured data
  const faqs = [
    {
      question: "What is a QR code generator?",
      answer: "A QR code generator is a tool that creates Quick Response (QR) codes that can store URLs, text, contact information, WiFi credentials, and more. QR Studio allows you to create custom, trackable QR codes with advanced features."
    },
    {
      question: "How do I create a QR code for free?",
      answer: "Simply enter your URL or data in the QR code generator above, customize the design and colors if desired, and download your QR code instantly. No registration required for basic QR codes."
    },
    {
      question: "What are dynamic QR codes?",
      answer: "Dynamic QR codes can be edited after creation without changing the printed code. They include analytics tracking, link updating, password protection, and expiration dates. Perfect for marketing campaigns."
    },
    {
      question: "Can I track QR code scans?",
      answer: "Yes! QR Studio provides comprehensive analytics including scan count, location, device type, time of scan, and unique vs returning visitors. Upgrade to Pro for full analytics access."
    }
  ];

  // Initialize QR Code
  useEffect(() => {
    setMounted(true);

    const initQR = async () => {
      if (qrRef.current && !qrInstance.current) {
        try {
          const QRCodeStyling = (await import('qr-code-styling')).default;

          // Clear any existing content
          qrRef.current.innerHTML = '';

          qrInstance.current = new QRCodeStyling({
            width: 250,
            height: 250,
            data: demoUrl,
            margin: 5,
            qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' },
            dotsOptions: { type: 'rounded', color: '#2563eb' },
            backgroundOptions: { color: '#ffffff' },
            cornersSquareOptions: { type: 'extra-rounded', color: '#1e40af' },
            cornersDotOptions: { type: 'dot', color: '#1e40af' }
          });

          qrInstance.current.append(qrRef.current);
          setQrGenerated(true);
        } catch (error) {
          console.error('Error initializing QR code:', error);
        }
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      initQR();
    }, 100);
  }, []);

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    setIsLoading(false); // Fallback if fetch fails or is slow
  }, []);

  // Update QR Code when URL changes
  useEffect(() => {
    if (qrInstance.current && demoUrl && mounted) {
      try {
        qrInstance.current.update({ data: demoUrl });
        setQrGenerated(true);
      } catch (error) {
        console.error('Error updating QR code:', error);
      }
    }
  }, [demoUrl, mounted]);

  const handleDownloadQR = () => {
    if (qrInstance.current) {
      qrInstance.current.download({
        name: 'qr-code',
        extension: 'png'
      });
    }
  };

  const features = [
    {
      icon: <QrCode className="w-8 h-8 text-blue-500" />,
      title: 'Dynamic QR Codes',
      description: 'Create editable QR codes that you can update anytime without reprinting'
    },
    {
      icon: <Activity className="w-8 h-8 text-purple-500" />,
      title: 'Advanced Analytics',
      description: 'Track scans with detailed insights: location, device, time, and more'
    },
    {
      icon: <Palette className="w-8 h-8 text-pink-500" />,
      title: 'Full Customization',
      description: 'Design stunning QR codes with colors, logos, patterns, and frames'
    },
    {
      icon: <Zap className="w-8 h-8 text-cyan-500" />,
      title: 'Bulk Generation',
      description: 'Generate thousands of QR codes at once from CSV or Excel files'
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: 'Team Collaboration',
      description: 'Work together with your team, share libraries, and manage permissions'
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: 'Enterprise Security',
      description: 'Password protection, expiration dates, and white-label options'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechFlow Inc.',
      avatar: 'SJ',
      content: 'QR Studio has transformed how we run our marketing campaigns. The dynamic QR codes and analytics are game-changers!'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'StartupHub',
      avatar: 'MC',
      content: 'Best QR code platform we\'ve used. The customization options and team collaboration features are outstanding.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Operations Lead',
      company: 'EventPro',
      avatar: 'ER',
      content: 'We generate thousands of QR codes for events. The bulk generation and analytics save us hours every week.'
    }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black overflow-hidden selection:bg-purple-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <StructuredData type="Organization" />
      <StructuredData type="WebApplication" />
      <StructuredData type="FAQPage" data={{ questions: createFAQItems(faqs) }} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="text-left space-y-8 animate-in slide-in-from-left duration-700">
              <Badge variant="premium" className="animate-float">
                <StarIcon className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                Trusted by 10,000+ businesses
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                {session?.user ? `Welcome Back, ${session.user.name?.split(' ')[0] || 'User'}!` : (
                  <>
                    Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">Powerful</span> QR Codes
                  </>
                )}
              </h1>

              <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                {session?.user
                  ? 'Ready to create more amazing QR codes? Access your dashboard to manage your codes, view analytics, and more.'
                  : 'Generate dynamic, customizable QR codes with advanced analytics. Track every scan and update content anytime—no reprinting needed.'
                }
              </p>

              <div className="flex flex-wrap gap-4">
                {session?.user ? (
                  <>
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-gray-100"
                      asChild
                    >
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 w-5 h-5" />
                        Go to Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/20 text-white hover:bg-white/10"
                      asChild
                    >
                      <Link href="/dashboard/generate">
                        <QrCode className="mr-2 w-5 h-5" />
                        Create New QR Code
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="premium"
                      size="lg"
                      className="text-lg px-8 py-6 h-auto"
                      asChild
                    >
                      <Link href="/signup">
                        Start Free Trial
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
                      asChild
                    >
                      <Link href="/features">
                        Explore Features
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {!session?.user && (
                <div className="flex flex-wrap gap-6 text-sm text-gray-500 pt-4">
                  {['No credit card required', '14-day free trial', 'Cancel anytime'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-500" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Content - QR Generator */}
            <div className="relative animate-in slide-in-from-right duration-700 delay-200">
              {/* Decorative elements */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-30 animate-pulse" />

              <Card variant="glass" className="relative p-6 lg:p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">🚀 Live QR Generator</h3>
                  <p className="text-sm text-gray-400">Try it now - No sign up required</p>
                </div>

                <div className="space-y-4">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                  />

                  <div className="bg-white rounded-xl p-8 flex items-center justify-center min-h-[280px] relative overflow-hidden group">
                    {/* Scan Me Frame */}
                    <div className="absolute inset-4 border-2 border-dashed border-gray-200 rounded-lg pointer-events-none group-hover:border-blue-500 transition-colors" />

                    {!qrGenerated && isLoading && (
                      <div className="text-center absolute z-10">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <span className="text-sm text-gray-500">Generating...</span>
                      </div>
                    )}
                    <div ref={qrRef} className={cn("transition-transform duration-300 hover:scale-105", !qrGenerated && "opacity-0")} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      className="bg-white/10 text-white hover:bg-white/20 border border-white/10"
                      onClick={handleDownloadQR}
                    >
                      <Download className="mr-2 w-4 h-4" />
                      Download
                    </Button>
                    <Button
                      variant="premium"
                      asChild
                    >
                      <Link href={session?.user ? "/dashboard/generate" : "/signup"}>
                        {session?.user ? <QrCode className="mr-2 w-4 h-4" /> : <Lock className="mr-2 w-4 h-4" />}
                        {session?.user ? "Create Advanced" : "Unlock Pro"}
                      </Link>
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-center text-gray-500">
                  🔒 Secure & Private - Your data is never stored in demo mode
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-white/5 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Users', value: stats.activeUsers },
              { label: 'QR Codes Created', value: stats.qrCodesCreated },
              { label: 'Uptime', value: stats.uptime },
              { label: 'Support', value: stats.support },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-1">
                <h4 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">
                  {stat.value}
                </h4>
                <p className="text-sm text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge variant="outline" className="border-blue-500/50 text-blue-400">
              POWERFUL FEATURES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-400 text-lg">
              Create, manage, and track your QR codes with professional tools designed for growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                variant="glass"
                className="group hover:bg-white/5 transition-all duration-300 border-white/5 hover:border-white/10"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10" asChild>
              <Link href="/features">
                View All Features <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-transparent to-white/5 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-purple-500/50 text-purple-400 mb-4">
              TESTIMONIALS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Loved by Thousands
            </h2>
            <p className="text-gray-400">
              See what our community has to say about QR Studio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} variant="glass" className="h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                      <p className="text-xs text-blue-400">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="border-green-500/50 text-green-400 mb-4">
              PRICING
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400">
              Choose the perfect plan for your needs. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card variant="glass" className="relative group">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <div className="text-4xl font-bold text-white mb-6">
                  $0<span className="text-lg text-gray-500 font-normal">/mo</span>
                </div>
                <p className="text-gray-400 mb-6">Perfect for personal projects</p>
                <ul className="space-y-4 mb-8">
                  {['50 QR codes', 'Basic analytics', 'Standard customization', 'PNG/SVG export'].map((feature) => (
                    <li key={feature} className="flex items-center text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card variant="default" className="relative border-purple-500 shadow-neon-purple/20 scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">MOST POPULAR</Badge>
              </div>
              <CardContent className="p-8 bg-gray-900">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-white mb-6">
                  $19<span className="text-lg text-gray-500 font-normal">/mo</span>
                </div>
                <p className="text-gray-400 mb-6">Ideal for professionals</p>
                <ul className="space-y-4 mb-8">
                  {['Unlimited dynamic QR codes', 'Advanced analytics', 'Full customization', 'Bulk generation (1,000)', 'Priority support'].map((feature) => (
                    <li key={feature} className="flex items-center text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-purple-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="premium" className="w-full" asChild>
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Business Plan */}
            <Card variant="glass" className="relative group">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Business</h3>
                <div className="text-4xl font-bold text-white mb-6">
                  $49<span className="text-lg text-gray-500 font-normal">/mo</span>
                </div>
                <p className="text-gray-400 mb-6">For growing teams</p>
                <ul className="space-y-4 mb-8">
                  {['Everything in Pro', 'Team collaboration', 'White-label', 'Bulk generation (10,000)', 'API access'].map((feature) => (
                    <li key={feature} className="flex items-center text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" asChild>
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <Badge variant="premium" className="mb-8">
            LIMITED TIME OFFER
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Ready to Create Amazing QR Codes?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join 10,000+ businesses transforming their QR code campaigns with dynamic tracking and beautiful designs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="premium" size="lg" className="text-lg px-10 py-6" asChild>
              <Link href="/signup">Start Free Today</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-10 py-6" asChild>
              <Link href="/contact">Talk to Sales</Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            ✨ No credit card required • ⚡ Setup in 2 minutes • 🎯 14-day free trial
          </p>
        </div>
      </section>
    </div>
  );
}
