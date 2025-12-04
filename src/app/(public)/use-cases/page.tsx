'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Grid
} from '@mui/material';
import {
  Restaurant,
  StoreMallDirectory,
  Home,
  Event,
  School,
  LocalHospital,
  Adjust,
  Campaign,
  ArrowForward,
  QrCode2
} from '@mui/icons-material';
import Link from 'next/link';
import IndustryCard from '@/components/use-cases/IndustryCard';
import CaseStudy from '@/components/use-cases/CaseStudy';
import TestimonialCard from '@/components/use-cases/TestimonialCard';
import SuccessStory from '@/components/use-cases/SuccessStory';

export default function UseCasesPage() {
  const industries = [
    {
      title: 'Restaurant & Hospitality',
      description:
        'Transform dining experiences with contactless menus, table ordering, and instant feedback collection.',
      icon: <Restaurant sx={{ fontSize: 32 }} />,
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
      icon: <StoreMallDirectory sx={{ fontSize: 32 }} />,
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
      icon: <Home sx={{ fontSize: 32 }} />,
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
      icon: <Event sx={{ fontSize: 32 }} />,
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
      icon: <School sx={{ fontSize: 32 }} />,
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
      icon: <LocalHospital sx={{ fontSize: 32 }} />,
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
      icon: <Adjust sx={{ fontSize: 32 }} />,
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
      icon: <Campaign sx={{ fontSize: 32 }} />,
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
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.default',
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 10 }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              color="primary"
              fontWeight="bold"
              sx={{ display: 'block', mb: 2 }}
            >
              Real-World Applications
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              sx={{
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              QR Codes Across Industries
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
            >
              Discover how businesses worldwide use QR codes to enhance customer
              experiences, streamline operations, and drive measurable results.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/dashboard"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
              >
                Start Creating
              </Button>
              <Button
                component={Link}
                href="/pricing"
                variant="outlined"
                size="large"
              >
                View Pricing
              </Button>
            </Box>
          </Box>

          {/* Stats */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              { value: '10,000+', label: 'Active Users' },
              { value: '8', label: 'Industries Served' },
              { value: '5M+', label: 'QR Codes Generated' },
              { value: '99.9%', label: 'Uptime Guarantee' }
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    component="div"
                    fontWeight="bold"
                    color="primary"
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Industry Cards Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
            Industry Solutions
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Tailored QR code solutions for every industry with proven results and
            best practices.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {industries.map((industry, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <IndustryCard {...industry} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Case Studies Section */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              Success Stories
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Real businesses achieving real results with QR Studio
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {caseStudies.map((study, index) => (
              <Grid item xs={12} key={index}>
                <CaseStudy {...study} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Success Stories Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
            More Success Stories
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Quick wins and transformative results from our customers
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {successStories.map((story, index) => (
            <Grid item xs={12} md={6} key={index}>
              <SuccessStory {...story} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              What Our Customers Say
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Trusted by businesses worldwide
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <TestimonialCard {...testimonial} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 4,
            p: { xs: 4, md: 8 },
            textAlign: 'center'
          }}
        >
          <QrCode2 sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
            Ready to Transform Your Business?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Join 10,000+ businesses using QR Studio to enhance customer experiences
            and drive results.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                '&:hover': { bgcolor: 'background.default' }
              }}
              endIcon={<ArrowForward />}
            >
              Get Started Free
            </Button>
            <Button
              component={Link}
              href="/pricing"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'primary.contrastText',
                color: 'primary.contrastText',
                '&:hover': {
                  borderColor: 'primary.contrastText',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              View Pricing
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
