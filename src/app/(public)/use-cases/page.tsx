'use client';

import {
  UtensilsCrossed,
  Store,
  Home,
  Calendar,
  GraduationCap,
  Hospital,
  Target,
  Megaphone,
  ArrowRight,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import IndustryCard from '@/components/use-cases/IndustryCard';
import CaseStudy from '@/components/use-cases/CaseStudy';
import TestimonialCard from '@/components/use-cases/TestimonialCard';
import SuccessStory from '@/components/use-cases/SuccessStory';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function UseCasesPage() {
  const industries = [
    {
      title: 'Restaurant & Hospitality',
      description:
        'Transform dining experiences with contactless menus, table ordering, and instant feedback collection.',
      icon: <UtensilsCrossed size={32} />,
      useCases: ['Digital Menus', 'Table Ordering', 'WiFi Sharing', 'Feedback'],
      benefits: [
        'Reduce printing costs by 90%',
        'Update menus in real-time',
        'Collect customer feedback instantly',
        'Enable contactless ordering'
      ],
      cta: {
        text: 'View Restaurant Templates',
        href: '/dashboard?tab=templates&category=restaurant'
      }
    },
    {
      title: 'Retail & E-commerce',
      description:
        'Bridge physical and digital shopping with product information, reviews, and loyalty programs.',
      icon: <Store size={32} />,
      useCases: ['Product Info', 'Inventory Tracking', 'Reviews', 'Loyalty Programs'],
      benefits: [
        'Increase customer engagement',
        'Reduce checkout time',
        'Track inventory in real-time',
        'Boost loyalty program signups'
      ],
      cta: {
        text: 'View Retail Templates',
        href: '/dashboard?tab=templates&category=retail'
      }
    },
    {
      title: 'Real Estate',
      description:
        'Showcase properties with virtual tours, instant contact information, and scheduling.',
      icon: <Home size={32} />,
      useCases: ['Property Listings', 'Virtual Tours', 'Contact Info', 'Scheduling'],
      benefits: [
        'Generate more qualified leads',
        'Reduce time to schedule viewings',
        'Provide 24/7 property information',
        'Track interested buyers'
      ],
      cta: {
        text: 'View Real Estate Templates',
        href: '/dashboard?tab=templates&category=realestate'
      }
    },
    {
      title: 'Events & Ticketing',
      description:
        'Streamline event management with registration, ticket validation, and attendee networking.',
      icon: <Calendar size={32} />,
      useCases: ['Registration', 'Ticket Validation', 'Networking', 'Surveys'],
      benefits: [
        'Eliminate paper tickets',
        'Speed up check-in by 75%',
        'Enable attendee networking',
        'Collect instant feedback'
      ],
      cta: {
        text: 'View Event Templates',
        href: '/dashboard?tab=templates&category=events'
      }
    },
    {
      title: 'Education',
      description:
        'Enhance learning experiences with campus navigation, course materials, and digital ID cards.',
      icon: <GraduationCap size={32} />,
      useCases: ['Campus Navigation', 'Course Materials', 'Library', 'Student IDs'],
      benefits: [
        'Improve student engagement',
        'Reduce paper waste',
        'Simplify resource access',
        'Modernize campus experience'
      ],
      cta: {
        text: 'View Education Templates',
        href: '/dashboard?tab=templates&category=education'
      }
    },
    {
      title: 'Healthcare',
      description:
        'Improve patient care with appointment scheduling, medical records access, and emergency contacts.',
      icon: <Hospital size={32} />,
      useCases: ['Patient Info', 'Appointments', 'Medical Records', 'Emergency'],
      benefits: [
        'Reduce administrative workload',
        'Improve patient satisfaction',
        'Enhance data security',
        'Streamline check-in process'
      ],
      cta: {
        text: 'View Healthcare Templates',
        href: '/dashboard?tab=templates&category=healthcare'
      }
    },
    {
      title: 'Manufacturing',
      description:
        'Optimize operations with inventory tracking, quality control, and equipment maintenance.',
      icon: <Target size={32} />,
      useCases: ['Inventory', 'Quality Control', 'Maintenance', 'Supply Chain'],
      benefits: [
        'Reduce inventory errors by 80%',
        'Improve traceability',
        'Streamline maintenance',
        'Enhance supply chain visibility'
      ],
      cta: {
        text: 'View Manufacturing Templates',
        href: '/dashboard?tab=templates&category=manufacturing'
      }
    },
    {
      title: 'Marketing Campaigns',
      description:
        'Bridge print and digital with campaign tracking, social media integration, and analytics.',
      icon: <Megaphone size={32} />,
      useCases: ['Print to Digital', 'Social Media', 'Promotions', 'Analytics'],
      benefits: [
        'Track campaign ROI accurately',
        'Increase engagement rates',
        'Gather real-time analytics',
        'Reduce marketing costs'
      ],
      cta: {
        text: 'View Marketing Templates',
        href: '/dashboard?tab=templates&category=marketing'
      }
    }
  ];

  const caseStudies = [
    {
      company: 'Bella Vista Restaurant',
      industry: 'Restaurant',
      challenge:
        'Bella Vista was spending over $2,000/month on menu printing and struggled to update pricing quickly during supply chain disruptions.',
      solution:
        'Implemented QR code digital menus with real-time updates, table ordering integration, and customer feedback collection.',
      results: [
        {
          metric: 'Cost Savings',
          value: '95%',
          description: 'Reduction in printing costs'
        },
        {
          metric: 'Order Time',
          value: '-40%',
          description: 'Faster order processing'
        },
        {
          metric: 'Customer Satisfaction',
          value: '+35%',
          description: 'Improved rating scores'
        }
      ],
      quote: {
        text: 'QR Studio transformed how we operate. We can update our menu instantly and our customers love the convenience. The ROI was immediate.',
        author: 'Marco Rossi',
        role: 'Owner, Bella Vista Restaurant'
      }
    },
    {
      company: 'Summit Realty Group',
      industry: 'Real Estate',
      challenge:
        'Property signs generated interest but converting passersby into qualified leads was inefficient. Only 15% of interested parties would call.',
      solution:
        'Placed QR codes on all property signs linking to virtual tours, detailed listings, and instant contact forms with SMS notifications.',
      results: [
        {
          metric: 'Lead Generation',
          value: '+180%',
          description: 'More qualified leads'
        },
        {
          metric: 'Time to Schedule',
          value: '-65%',
          description: 'Faster viewing bookings'
        },
        {
          metric: 'Conversion Rate',
          value: '+45%',
          description: 'More closed deals'
        }
      ],
      quote: {
        text: 'QR codes on our property signs became our best lead generation tool. We went from 15% engagement to over 60% overnight.',
        author: 'Jennifer Park',
        role: 'Senior Agent, Summit Realty Group'
      }
    }
  ];

  const successStories = [
    {
      title: 'Fashion Week Event Goes Paperless',
      company: 'New York Fashion Collective',
      industry: 'Events',
      summary:
        'NYFC eliminated 50,000 paper tickets and reduced check-in time by 80% using QR code tickets with real-time validation.',
      achievements: [
        'Zero paper tickets for 15,000 attendees',
        'Check-in time reduced from 10 minutes to 2 minutes',
        'Real-time attendance tracking and analytics',
        'Integrated with mobile app for networking'
      ],
      tags: ['Events', 'Ticketing', 'Sustainability', 'Mobile']
    },
    {
      title: 'University Modernizes Campus Navigation',
      company: 'Riverside University',
      industry: 'Education',
      summary:
        'Deployed 500+ QR codes across campus for building information, wayfinding, and resource access, improving student experience.',
      achievements: [
        '500+ QR codes deployed campus-wide',
        'Reduced lost student incidents by 90%',
        'Multilingual support for international students',
        '85% student satisfaction increase'
      ],
      tags: ['Education', 'Navigation', 'Accessibility', 'Mobile']
    },
    {
      title: 'Medical Center Streamlines Patient Check-In',
      company: 'Healthbridge Medical Center',
      industry: 'Healthcare',
      summary:
        'Implemented QR code-based patient check-in and form submission, reducing wait times and administrative burden.',
      achievements: [
        'Check-in time reduced from 15 to 3 minutes',
        'Paper forms eliminated (5,000+ sheets/month)',
        'Data accuracy improved by 95%',
        'HIPAA compliant secure data handling'
      ],
      tags: ['Healthcare', 'HIPAA', 'Efficiency', 'Digital Forms']
    },
    {
      title: 'Manufacturer Achieves 99.9% Inventory Accuracy',
      company: 'TechParts Manufacturing',
      industry: 'Manufacturing',
      summary:
        'Implemented QR code inventory tracking across 3 warehouses, achieving near-perfect accuracy and reducing auditing time.',
      achievements: [
        'Inventory accuracy improved from 92% to 99.9%',
        'Audit time reduced by 75%',
        'Real-time stock visibility across facilities',
        'Reduced carrying costs by $200K annually'
      ],
      tags: ['Manufacturing', 'Inventory', 'Automation', 'ROI']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Marketing Director',
      company: 'Urban Outfitters',
      rating: 5,
      text: 'QR Studio helped us bridge our print campaigns with digital engagement. We saw a 200% increase in campaign interaction rates within the first month.',
      industry: 'Retail'
    },
    {
      name: 'Michael Torres',
      role: 'Operations Manager',
      company: 'GreenLeaf Hotels',
      rating: 5,
      text: 'The contactless check-in and room service ordering via QR codes has been a game-changer. Guest satisfaction scores increased by 28% and operational costs decreased.',
      industry: 'Hospitality'
    },
    {
      name: 'Emily Watson',
      role: 'Event Coordinator',
      company: 'Premier Events',
      rating: 5,
      text: 'Managing 50+ events per year became so much easier with QR Studio. Ticket validation is instant, and the analytics help us improve every event.',
      industry: 'Events'
    },
    {
      name: 'David Kim',
      role: 'Real Estate Broker',
      company: 'Pinnacle Properties',
      rating: 5,
      text: "QR codes on property signs transformed how we generate leads. We're getting 3x more qualified inquiries and closing deals 40% faster.",
      industry: 'Real Estate'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black pointer-events-none" />
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-6">
            <Badge variant="outline" className="text-purple-400 border-purple-400/30 bg-purple-400/10">
              REAL-WORLD APPLICATIONS
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-6">
            QR Codes Across Industries
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Discover how businesses worldwide use QR codes to enhance customer
            experiences, streamline operations, and drive measurable results.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              variant="premium"
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = '/dashboard'}
            >
              Start Creating
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-transparent border-white/20 text-white hover:bg-white/10"
              onClick={() => window.location.href = '/pricing'}
            >
              View Pricing
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 border-t border-white/10 pt-12">
            {[
              { value: '10,000+', label: 'Active Users' },
              { value: '8', label: 'Industries Served' },
              { value: '5M+', label: 'QR Codes Generated' },
              { value: '99.9%', label: 'Uptime Guarantee' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Cards Section */}
      <section className="py-24 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Industry Solutions
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Tailored QR code solutions for every industry with proven results and
              best practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div key={index} className="flex">
                <IndustryCard {...industry} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute left-[-20%] top-[20%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Success Stories
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real businesses achieving real results with QR Studio
            </p>
          </div>

          <div className="grid gap-12 relative z-10">
            {caseStudies.map((study, index) => (
              <CaseStudy key={index} {...study} />
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Grid */}
      <section className="py-24 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              More Success Stories
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Quick wins and transformative results from our customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <SuccessStory key={index} {...story} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-black to-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Trusted by businesses worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-3xl p-12 text-center border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:30px_30px]" />
            <div className="relative z-10">
              <QrCode className="text-white w-20 h-20 mb-6 mx-auto opacity-80" />
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Join 10,000+ businesses using QR Studio to enhance customer experiences
                and drive results.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant="premium"
                  className="px-8 h-14 text-lg"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 h-14 text-lg bg-transparent border-white/20 text-white hover:bg-white/10"
                  onClick={() => window.location.href = '/pricing'}
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

