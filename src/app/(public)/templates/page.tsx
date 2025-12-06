'use client';

import { useState, useMemo } from 'react';
import { QrCode, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import TemplateCard from '@/components/templates/TemplateCard';
import TemplateFilter from '@/components/templates/TemplateFilter';
import TemplatePreview from '@/components/templates/TemplatePreview';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

// Mock templates data - in production, this would come from API
const TEMPLATES = [
  {
    id: 'business-card-1',
    name: 'Professional Business Card',
    description: 'Modern business card template with contact information and social media links',
    category: 'Business Cards',
    rating: 4.8,
    usageCount: 2500,
    isPro: false,
    features: [
      'vCard format',
      'Multiple contact methods',
      'Social media integration',
      'Professional design'
    ]
  },
  {
    id: 'wifi-simple',
    name: 'WiFi Access QR',
    description: 'Simple WiFi connection template for guests and visitors',
    category: 'WiFi Access',
    rating: 4.9,
    usageCount: 5200,
    isPro: false,
    features: [
      'One-tap connection',
      'WPA/WPA2 support',
      'Hidden SSID compatible',
      'Password encryption'
    ]
  },
  {
    id: 'restaurant-menu-1',
    name: 'Digital Menu',
    description: 'Contactless restaurant menu with categories and pricing',
    category: 'Restaurant Menus',
    rating: 4.7,
    usageCount: 3800,
    isPro: false,
    features: [
      'Multi-category support',
      'Price display',
      'Allergy information',
      'Multi-language'
    ]
  },
  {
    id: 'event-ticket-1',
    name: 'Event Ticket',
    description: 'Scannable event ticket with validation and attendee info',
    category: 'Event Tickets',
    rating: 4.6,
    usageCount: 1900,
    isPro: true,
    features: [
      'Unique ticket ID',
      'Real-time validation',
      'Check-in tracking',
      'Anti-counterfeit'
    ]
  },
  {
    id: 'product-label-1',
    name: 'Product Information',
    description: 'Product details, specifications, and warranty information',
    category: 'Product Labels',
    rating: 4.5,
    usageCount: 1500,
    isPro: false,
    features: [
      'Product specifications',
      'Serial number tracking',
      'Warranty details',
      'Support links'
    ]
  },
  {
    id: 'social-media-1',
    name: 'Social Media Hub',
    description: 'Link to all your social media profiles in one place',
    category: 'Social Media',
    rating: 4.9,
    usageCount: 4200,
    isPro: false,
    features: [
      'All major platforms',
      'Bio/description',
      'Custom branding',
      'Analytics tracking'
    ]
  },
  {
    id: 'url-simple',
    name: 'Website Link',
    description: 'Simple QR code that redirects to any URL',
    category: 'URLs & Links',
    rating: 4.8,
    usageCount: 8500,
    isPro: false,
    features: [
      'Any URL supported',
      'Redirect tracking',
      'Custom short URLs',
      'Link expiration'
    ]
  },
  {
    id: 'location-map-1',
    name: 'Location/Map',
    description: 'GPS coordinates with map integration for easy navigation',
    category: 'Location/Maps',
    rating: 4.7,
    usageCount: 2100,
    isPro: false,
    features: [
      'GPS coordinates',
      'Google Maps integration',
      'Directions link',
      'Street view'
    ]
  },
  {
    id: 'contact-vcard',
    name: 'Contact Information',
    description: 'Complete contact details in vCard format',
    category: 'Contact Information',
    rating: 4.6,
    usageCount: 3200,
    isPro: false,
    features: [
      'vCard 3.0 format',
      'Phone, email, address',
      'Company information',
      'Save to contacts'
    ]
  },
  {
    id: 'email-template',
    name: 'Email QR Code',
    description: 'Pre-filled email with recipient, subject, and body',
    category: 'Email & SMS',
    rating: 4.4,
    usageCount: 1800,
    isPro: false,
    features: [
      'Pre-filled recipient',
      'Custom subject line',
      'Message body',
      'CC/BCC support'
    ]
  },
  {
    id: 'sms-template',
    name: 'SMS Message',
    description: 'Pre-filled SMS message for quick texting',
    category: 'Email & SMS',
    rating: 4.5,
    usageCount: 1600,
    isPro: false,
    features: [
      'Phone number pre-filled',
      'Message body',
      'Unicode support',
      'Multi-platform'
    ]
  },
  {
    id: 'payment-link',
    name: 'Payment Link',
    description: 'Quick payment link for online transactions',
    category: 'URLs & Links',
    rating: 4.7,
    usageCount: 2900,
    isPro: true,
    features: [
      'Payment gateway integration',
      'Amount pre-fill',
      'Currency support',
      'Transaction tracking'
    ]
  }
];

const CATEGORIES = Array.from(new Set(TEMPLATES.map(t => t.category))).sort();

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<typeof TEMPLATES[0] | null>(null);
  const isAuthenticated = false; // TODO: Get from auth context

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Popular templates (top 4 by usage)
  const popularTemplates = useMemo(() => {
    return [...TEMPLATES].sort((a, b) => b.usageCount - a.usageCount).slice(0, 4);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-6 text-blue-400 border-blue-400/30 bg-blue-400/10">
            READY-TO-USE TEMPLATES
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
            QR Code Templates
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Choose from professionally designed templates and start creating in seconds.
            No design skills required.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              variant="premium"
              className="text-lg px-8 py-6"
              asChild
            >
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-transparent border-white/20 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/use-cases">
                View Use Cases
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Templates Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
          <TrendingUp className="text-blue-500 w-6 h-6" />
          <h2 className="text-2xl font-bold">
            Popular Templates
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {popularTemplates.map(template => (
            <div key={template.id} onClick={() => setPreviewTemplate(template)} className="cursor-pointer">
              <TemplateCard {...template} isAuthenticated={isAuthenticated} />
            </div>
          ))}
        </div>

        {!isAuthenticated && (
          <div className="mb-12 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg flex items-start gap-3 text-blue-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
            <p className="text-sm">
              <strong>Sign up for free</strong> to use any template and create unlimited QR codes.
              No credit card required.
            </p>
          </div>
        )}

        {/* All Templates Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            All Templates <span className="text-gray-500 text-lg font-normal ml-2">({filteredTemplates.length})</span>
          </h2>

          <TemplateFilter
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
            categories={CATEGORIES}
          />

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
              <QrCode className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-white mb-2">
                No templates found
              </h3>
              <p className="text-gray-400">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <div key={template.id} onClick={() => setPreviewTemplate(template)} className="cursor-pointer">
                  <TemplateCard {...template} isAuthenticated={isAuthenticated} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-3xl p-12 text-center border border-white/10 relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:30px_30px]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Create Your QR Code?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto">
                Sign up for free and start using any template in seconds
              </p>
              <Button
                size="lg"
                variant="premium"
                className="px-8 h-12 text-lg"
                asChild
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Template Preview Modal */}
      <TemplatePreview
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
