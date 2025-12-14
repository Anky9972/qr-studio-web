'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import {
    QrCode,
    BarChart3,
    Palette,
    Zap,
    Users,
    Shield,
    CloudUpload,
    Edit,
    TrendingUp,
    Lock,
    Code,
    Smartphone,
    Check,
    X,
    ChevronDown,
    ArrowRight,
    Grid,
    LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { featuresFaqs } from '@/lib/data';

export default function FeaturesClient() {
    const { data: session } = useSession();

    const featureCategories = [
        {
            title: 'QR Code Generation',
            icon: <QrCode className="text-4xl" />,
            color: 'text-pink-500',
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/20',
            features: [
                {
                    name: '25+ QR Code Types',
                    description: 'Support for URL, vCard, WiFi, Email, SMS, Phone, Calendar, Location, and more',
                    icon: <Grid />
                },
                {
                    name: 'Dynamic QR Codes',
                    description: 'Edit the destination URL anytime without reprinting the QR code',
                    icon: <Edit />
                },
                {
                    name: 'Bulk Generation',
                    description: 'Generate up to 10,000 QR codes at once from CSV or Excel files',
                    icon: <Zap />
                },
                {
                    name: 'High Resolution Export',
                    description: 'Export in PNG, SVG, JPEG, or PDF formats up to 4096x4096 pixels',
                    icon: <CloudUpload />
                }
            ]
        },
        {
            title: 'Design & Customization',
            icon: <Palette className="text-4xl" />,
            color: 'text-teal-400',
            bg: 'bg-teal-400/10',
            border: 'border-teal-400/20',
            features: [
                {
                    name: 'Full Color Control',
                    description: 'Customize colors, gradients, and transparency for all QR elements',
                    icon: <Palette />
                },
                {
                    name: 'Logo Upload',
                    description: 'Add your brand logo to the center of QR codes with automatic sizing',
                    icon: <QrCode />
                },
                {
                    name: 'Pattern Styles',
                    description: 'Choose from 10+ dot patterns and corner styles for unique designs',
                    icon: <Grid />
                },
                {
                    name: 'Frames & Templates',
                    description: 'Apply professional frames and use pre-designed templates for quick creation',
                    icon: <Edit />
                }
            ]
        },
        {
            title: 'Analytics & Tracking',
            icon: <BarChart3 className="text-4xl" />,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            border: 'border-blue-400/20',
            features: [
                {
                    name: 'Real-time Scan Tracking',
                    description: 'Monitor scans as they happen with live dashboard updates',
                    icon: <TrendingUp />
                },
                {
                    name: 'Geographic Insights',
                    description: 'See where your QR codes are being scanned with interactive maps',
                    icon: <Smartphone />
                },
                {
                    name: 'Device Analytics',
                    description: 'Track devices, browsers, and operating systems used for scanning',
                    icon: <Smartphone />
                },
                {
                    name: 'Custom Reports',
                    description: 'Generate detailed reports and export data to CSV for further analysis',
                    icon: <BarChart3 />
                }
            ]
        },
        {
            title: 'Team Collaboration',
            icon: <Users className="text-4xl" />,
            color: 'text-green-400',
            bg: 'bg-green-400/10',
            border: 'border-green-400/20',
            features: [
                {
                    name: 'Team Workspaces',
                    description: 'Collaborate with unlimited team members on shared QR code libraries',
                    icon: <Users />
                },
                {
                    name: 'Role-based Access',
                    description: 'Control permissions with Admin, Editor, Viewer, and Analyst roles',
                    icon: <Lock />
                },
                {
                    name: 'Brand Kit',
                    description: 'Create shared brand kits with logos, colors, and templates for consistency',
                    icon: <Palette />
                },
                {
                    name: 'Activity Logs',
                    description: 'Track all team actions with detailed audit logs and timestamps',
                    icon: <TrendingUp />
                }
            ]
        },
        {
            title: 'Security & Management',
            icon: <Shield className="text-4xl" />,
            color: 'text-orange-400',
            bg: 'bg-orange-400/10',
            border: 'border-orange-400/20',
            features: [
                {
                    name: 'Password Protection',
                    description: 'Secure QR codes with password requirements before revealing content',
                    icon: <Lock />
                },
                {
                    name: 'Expiration Dates',
                    description: 'Set automatic expiration dates for time-sensitive campaigns',
                    icon: <TrendingUp />
                },
                {
                    name: 'White-label Options',
                    description: 'Remove QR Studio branding and use custom domains (Business plan)',
                    icon: <Edit />
                },
                {
                    name: 'API Access',
                    description: 'Integrate QR code generation into your applications with REST API',
                    icon: <Code />
                }
            ]
        }
    ];

    const comparisonFeatures = [
        { name: 'Dynamic QR Codes', qrStudio: true, competitor1: false, competitor2: true },
        { name: 'Unlimited Scans', qrStudio: true, competitor1: false, competitor2: false },
        { name: 'Bulk Generation (10,000+)', qrStudio: true, competitor1: '1,000', competitor2: '500' },
        { name: 'Advanced Analytics', qrStudio: true, competitor1: 'Basic', competitor2: true },
        { name: 'Team Collaboration', qrStudio: true, competitor1: false, competitor2: 'Limited' },
        { name: 'White-label', qrStudio: true, competitor1: 'Enterprise', competitor2: false },
        { name: 'API Access', qrStudio: true, competitor1: false, competitor2: 'Paid Add-on' },
        { name: 'Custom Domains', qrStudio: true, competitor1: false, competitor2: false },
        { name: 'Password Protection', qrStudio: true, competitor1: false, competitor2: false },
        { name: 'Export Formats', qrStudio: 'PNG/SVG/PDF/JPEG', competitor1: 'PNG only', competitor2: 'PNG/SVG' }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Badge variant="outline" className="mb-4 bg-white/5 border-white/10 text-blue-400">
                        FEATURES
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
                        {session?.user ? 'All Features at Your Fingertips' : 'Everything You Need in One Platform'}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        {session?.user
                            ? 'Explore the full power of QR Studio to create, manage, and analyze QR codes.'
                            : 'Powerful features designed for marketers, developers, and businesses'
                        }
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none mx-auto">
                        {session?.user ? (
                            <>
                                <Button
                                    size="lg"
                                    variant="premium"
                                    className="px-8 shadow-lg shadow-blue-500/25 w-full sm:w-auto"
                                    onClick={() => window.location.href = '/dashboard'}
                                >
                                    <LayoutDashboard className="mr-2" size={20} />
                                    Go to Dashboard
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-8 bg-white/5 border-white/10 hover:bg-white/10 w-full sm:w-auto"
                                    onClick={() => window.location.href = '/dashboard/generate'}
                                >
                                    <QrCode className="mr-2" size={20} />
                                    Create QR Code
                                </Button>
                            </>
                        ) : (
                            <Button
                                size="lg"
                                variant="premium"
                                className="px-8 text-lg h-14 shadow-lg shadow-blue-500/25 w-full sm:w-auto"
                                onClick={() => window.location.href = '/signup'}
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2" size={20} />
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Feature Categories */}
            <section className="py-20 bg-black/50">
                <div className="container mx-auto px-4">
                    {featureCategories.map((category, catIndex) => (
                        <div key={catIndex} className="mb-24 last:mb-0">
                            <div className="flex items-center gap-4 mb-8">
                                <div className={cn("p-3 rounded-xl", category.bg, category.color)}>
                                    {category.icon}
                                </div>
                                <h2 className="text-3xl font-bold text-white">
                                    {category.title}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {category.features.map((feature, index) => (
                                    <Card key={index} variant="glass" className="h-full hover:border-blue-500/30 transition-colors">
                                        <CardContent className="p-6">
                                            <div className="flex gap-4 items-start">
                                                <div className={cn("mt-1", category.color)}>
                                                    {feature.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white mb-2">
                                                        {feature.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 bg-gradient-to-b from-black to-blue-950/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How We Compare</h2>
                        <p className="text-xl text-gray-400">See why QR Studio is the best choice for your business</p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-6 text-white font-bold text-lg">Feature</th>
                                    <th className="p-6 text-center text-blue-400 font-bold text-lg bg-blue-500/10">QR Studio</th>
                                    <th className="p-6 text-center text-gray-400 font-bold">Competitor A</th>
                                    <th className="p-6 text-center text-gray-400 font-bold">Competitor B</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFeatures.map((feature, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 px-6 text-white font-medium">{feature.name}</td>
                                        <td className="p-4 px-6 text-center bg-blue-500/5">
                                            {typeof feature.qrStudio === 'boolean' ? (
                                                feature.qrStudio ? <Check className="inline text-green-400" /> : <X className="inline text-red-400" />
                                            ) : (
                                                <span className="font-bold text-green-400">{feature.qrStudio}</span>
                                            )}
                                        </td>
                                        <td className="p-4 px-6 text-center text-gray-400">
                                            {typeof feature.competitor1 === 'boolean' ? (
                                                feature.competitor1 ? <Check className="inline text-green-400" /> : <X className="inline text-red-400" />
                                            ) : (
                                                feature.competitor1
                                            )}
                                        </td>
                                        <td className="p-4 px-6 text-center text-gray-400">
                                            {typeof feature.competitor2 === 'boolean' ? (
                                                feature.competitor2 ? <Check className="inline text-green-400" /> : <X className="inline text-red-400" />
                                            ) : (
                                                feature.competitor2
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-400">Everything you need to know about our features</p>
                    </div>

                    <div className="space-y-4">
                        {featuresFaqs.map((faq, index) => (
                            <FaqItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-t from-blue-900/20 to-black border-t border-white/10">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Ready to Try All Features?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Start your free trial today. No credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none mx-auto">
                        <Button
                            size="lg"
                            variant="premium"
                            className="px-8 h-14 text-lg shadow-lg shadow-blue-500/25 w-full sm:w-auto"
                            onClick={() => window.location.href = '/signup'}
                        >
                            Start Free Trial
                            <ArrowRight className="ml-2" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="px-8 h-14 text-lg bg-white/5 border-white/10 hover:bg-white/10 w-full sm:w-auto"
                            onClick={() => window.location.href = '/pricing'}
                        >
                            View Pricing
                        </Button>
                    </div>
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
