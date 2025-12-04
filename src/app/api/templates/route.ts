import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Predefined templates
const PREDEFINED_TEMPLATES = [
  {
    id: 'business-card',
    name: 'Business Card',
    category: 'Business',
    qrType: 'vcard',
    thumbnail: '/templates/business-card.png',
    design: {
      foreground: '#1976d2',
      background: '#ffffff',
      pattern: 'rounded',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
  {
    id: 'wifi',
    name: 'WiFi Access',
    category: 'Connectivity',
    qrType: 'wifi',
    thumbnail: '/templates/wifi.png',
    design: {
      foreground: '#4caf50',
      background: '#ffffff',
      pattern: 'dots',
      errorLevel: 'H',
    },
    isPredefined: true,
  },
  {
    id: 'menu',
    name: 'Restaurant Menu',
    category: 'Restaurant',
    qrType: 'url',
    thumbnail: '/templates/menu.png',
    design: {
      foreground: '#ff9800',
      background: '#ffffff',
      pattern: 'square',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
  {
    id: 'event',
    name: 'Event Ticket',
    category: 'Events',
    qrType: 'url',
    thumbnail: '/templates/event.png',
    design: {
      foreground: '#9c27b0',
      background: '#ffffff',
      pattern: 'rounded',
      errorLevel: 'H',
    },
    isPredefined: true,
  },
  {
    id: 'product',
    name: 'Product Info',
    category: 'E-commerce',
    qrType: 'url',
    thumbnail: '/templates/product.png',
    design: {
      foreground: '#f44336',
      background: '#ffffff',
      pattern: 'dots',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
  {
    id: 'social',
    name: 'Social Media',
    category: 'Social',
    qrType: 'url',
    thumbnail: '/templates/social.png',
    design: {
      foreground: '#e91e63',
      background: '#ffffff',
      pattern: 'rounded',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
  {
    id: 'email',
    name: 'Email Contact',
    category: 'Business',
    qrType: 'email',
    thumbnail: '/templates/email.png',
    design: {
      foreground: '#3f51b5',
      background: '#ffffff',
      pattern: 'square',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
  {
    id: 'phone',
    name: 'Phone Number',
    category: 'Business',
    qrType: 'phone',
    thumbnail: '/templates/phone.png',
    design: {
      foreground: '#009688',
      background: '#ffffff',
      pattern: 'dots',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
  {
    id: 'location',
    name: 'Location Pin',
    category: 'Maps',
    qrType: 'location',
    thumbnail: '/templates/location.png',
    design: {
      foreground: '#f44336',
      background: '#ffffff',
      pattern: 'rounded',
      errorLevel: 'H',
    },
    isPredefined: true,
  },
  {
    id: 'sms',
    name: 'SMS Message',
    category: 'Communication',
    qrType: 'sms',
    thumbnail: '/templates/sms.png',
    design: {
      foreground: '#4caf50',
      background: '#ffffff',
      pattern: 'square',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
  {
    id: 'app-download',
    name: 'App Download',
    category: 'Mobile',
    qrType: 'url',
    thumbnail: '/templates/app.png',
    design: {
      foreground: '#000000',
      background: '#ffffff',
      pattern: 'rounded',
      errorLevel: 'H',
    },
    isPredefined: true,
  },
  {
    id: 'coupon',
    name: 'Discount Coupon',
    category: 'Marketing',
    qrType: 'url',
    thumbnail: '/templates/coupon.png',
    design: {
      foreground: '#ff5722',
      background: '#ffffff',
      pattern: 'dots',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
  {
    id: 'payment',
    name: 'Payment Link',
    category: 'Finance',
    qrType: 'url',
    thumbnail: '/templates/payment.png',
    design: {
      foreground: '#4caf50',
      background: '#ffffff',
      pattern: 'square',
      errorLevel: 'H',
    },
    isPredefined: true,
  },
  {
    id: 'youtube',
    name: 'YouTube Video',
    category: 'Social',
    qrType: 'url',
    thumbnail: '/templates/youtube.png',
    design: {
      foreground: '#ff0000',
      background: '#ffffff',
      pattern: 'rounded',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
  {
    id: 'pdf',
    name: 'PDF Document',
    category: 'Documents',
    qrType: 'url',
    thumbnail: '/templates/pdf.png',
    design: {
      foreground: '#d32f2f',
      background: '#ffffff',
      pattern: 'square',
      errorLevel: 'H',
    },
    isPredefined: true,
  },
  {
    id: 'calendar',
    name: 'Calendar Event',
    category: 'Events',
    qrType: 'calendar',
    thumbnail: '/templates/calendar.png',
    design: {
      foreground: '#2196f3',
      background: '#ffffff',
      pattern: 'dots',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
  {
    id: 'feedback',
    name: 'Feedback Form',
    category: 'Business',
    qrType: 'url',
    thumbnail: '/templates/feedback.png',
    design: {
      foreground: '#ff9800',
      background: '#ffffff',
      pattern: 'rounded',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
  {
    id: 'review',
    name: 'Leave a Review',
    category: 'Marketing',
    qrType: 'url',
    thumbnail: '/templates/review.png',
    design: {
      foreground: '#ffc107',
      background: '#ffffff',
      pattern: 'dots',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Profile',
    category: 'Social',
    qrType: 'url',
    thumbnail: '/templates/linkedin.png',
    design: {
      foreground: '#0077b5',
      background: '#ffffff',
      pattern: 'square',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
  {
    id: 'instagram',
    name: 'Instagram Profile',
    category: 'Social',
    qrType: 'url',
    thumbnail: '/templates/instagram.png',
    design: {
      foreground: '#c13584',
      background: '#ffffff',
      pattern: 'rounded',
      errorLevel: 'M',
    },
    isPredefined: true,
  },
];

// GET /api/templates - List all templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let templates = [...PREDEFINED_TEMPLATES];

    // Add user custom templates if authenticated
    if (session?.user) {
      const userId = (session.user as any).id;
      const customTemplates = await prisma.template.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          category: true,
          preview: true,
          design: true,
        },
      });

      templates = [
        ...templates,
        ...customTemplates.map((t: any) => ({
          ...t,
          isPredefined: false,
        })),
      ];
    }

    // Filter by category if provided
    if (category) {
      templates = templates.filter((t) => t.category === category);
    }

    // Group by category
    const categories = Array.from(new Set(templates.map((t) => t.category)));
    const grouped = categories.map((cat) => ({
      category: cat,
      templates: templates.filter((t) => t.category === cat),
    }));

    return NextResponse.json({
      templates,
      grouped,
      categories,
    });
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST /api/templates - Create custom template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { name, description, category, design } = body;

    const template = await prisma.template.create({
      data: {
        name,
        description,
        category,
        design,
        userId,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
