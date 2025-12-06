'use client';

import {
  QrCode,
  ArrowRight,
  TrendingUp,
  Users,
  Globe,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function AboutPage() {
  const stats = [
    { label: 'Active Users', value: '10,000+', icon: <Users className="text-4xl" size={40} /> },
    { label: 'QR Codes Generated', value: '5M+', icon: <QrCode className="text-4xl" size={40} /> },
    { label: 'Countries', value: '120+', icon: <Globe className="text-4xl" size={40} /> },
    { label: 'Uptime', value: '99.9%', icon: <Shield className="text-4xl" size={40} /> }
  ];

  const team = [
    {
      name: 'Alex Thompson',
      role: 'CEO & Co-Founder',
      initials: 'AT',
      bio: '15+ years in SaaS, former VP at Adobe',
      color: 'bg-blue-500'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO & Co-Founder',
      initials: 'SC',
      bio: 'Ex-Google engineer, PhD in Computer Science',
      color: 'bg-purple-500'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Product',
      initials: 'MR',
      bio: 'Product leader from Salesforce and Dropbox',
      color: 'bg-green-500'
    },
    {
      name: 'Emma Williams',
      role: 'Head of Design',
      initials: 'EW',
      bio: 'Award-winning designer from Figma',
      color: 'bg-pink-500'
    }
  ];

  const values = [
    {
      title: 'Customer-First',
      description: 'We build features based on your feedback and needs',
      icon: <Users className="text-4xl" />,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      title: 'Innovation',
      description: 'Constantly improving with cutting-edge technology',
      icon: <TrendingUp className="text-4xl" />,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    {
      title: 'Privacy & Security',
      description: 'Your data is protected with enterprise-grade security',
      icon: <Shield className="text-4xl" />,
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
    {
      title: 'Global Reach',
      description: 'Supporting businesses in over 120 countries',
      icon: <Globe className="text-4xl" />,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10'
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
            ABOUT US
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
            Making QR Codes Simple and Powerful
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We're on a mission to help businesses connect with their customers through innovative QR code solutions
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-blue-500 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-xl text-gray-400 mb-12">Founded in 2022 by a team of passionate technologists</p>
          </div>

          <div className="prose prose-invert prose-lg max-w-none text-gray-300 space-y-8 leading-relaxed">
            <p>
              QR Studio was born out of frustration with existing QR code solutions. As marketers and developers ourselves, we experienced firsthand the limitations of traditional QR code generators—lack of analytics, poor customization, and no way to update codes after printing.
            </p>
            <p>
              We envisioned a platform that would combine powerful features with an intuitive interface, making professional QR code management accessible to everyone—from solo entrepreneurs to enterprise teams.
            </p>
            <p>
              Today, QR Studio serves over 10,000 businesses across 120 countries, generating millions of QR codes that power marketing campaigns, product packaging, event management, and more. Our commitment remains the same: empower businesses with the best QR code technology available.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-400">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} variant="glass" className="hover:bg-white/10 transition-colors">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className={cn("p-4 rounded-xl shrink-0", value.bg, value.color)}>
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-400">Experienced leaders from top tech companies</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} variant="glass" className="text-center group hover:-translate-y-2 transition-transform duration-300">
                <CardContent className="p-8">
                  <div className={cn("w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg shadow-black/50 ring-4 ring-white/5", member.color)}>
                    {member.initials}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-blue-400 text-sm font-medium mb-4">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-t from-blue-900/20 to-black border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Join Thousands of Happy Users
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Start creating professional QR codes today
          </p>
          <Button
            size="lg"
            variant="premium"
            className="px-8 h-14 text-lg shadow-lg shadow-blue-500/25"
            onClick={() => window.location.href = '/signup'}
          >
            Get Started Free
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}

