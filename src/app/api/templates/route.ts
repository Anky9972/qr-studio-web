import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Predefined templates
const PREDEFINED_TEMPLATES = [
  {
    id: 'business-card',
    name: 'Professional Network',
    category: 'Business',
    qrType: 'vcard',
    thumbnail: '/templates/business-card.png',
    design: {
      dotsOptions: { type: 'rounded', color: '#1e88e5' },
      backgroundOptions: { color: '#ffffff' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#0d47a1' },
      cornersDotOptions: { type: 'dot', color: '#1565c0' },
      frameStyle: 'box',
      frameText: 'CONNECT',
      frameColor: '#0d47a1',
    },
    isPredefined: true,
  },
  {
    id: 'wifi',
    name: 'Guest WiFi',
    category: 'Connectivity',
    qrType: 'wifi',
    thumbnail: '/templates/wifi.png',
    design: {
      dotsOptions: { type: 'dots', color: '#43a047' },
      backgroundOptions: { color: '#ffffff' },
      cornersSquareOptions: { type: 'dot', color: '#2e7d32' },
      cornersDotOptions: { type: 'dot', color: '#1b5e20' },
      frameStyle: 'balloon',
      frameText: 'JOIN WIFI',
      frameColor: '#2e7d32',
      image: '/icons/wifi.svg'
    },
    isPredefined: true,
  },
  {
    id: 'menu',
    name: 'Digital Menu',
    category: 'Restaurant',
    qrType: 'url',
    thumbnail: '/templates/menu.png',
    design: {
      dotsOptions: { type: 'classy', color: '#ff6f00' },
      backgroundOptions: { color: '#fff8e1' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#e65100' },
      cornersDotOptions: { type: 'dot', color: '#bf360c' },
      frameStyle: 'banner',
      frameText: 'SCAN MENU',
      frameColor: '#e65100',
      image: '/icons/utensils.svg'
    },
    isPredefined: true,
  },
  {
    id: 'event',
    name: 'VIP Access',
    category: 'Events',
    qrType: 'url',
    thumbnail: '/templates/event.png',
    design: {
      dotsOptions: { type: 'square', color: '#6a1b9a' },
      backgroundOptions: { color: '#f3e5f5' },
      cornersSquareOptions: { type: 'square', color: '#4a148c' },
      cornersDotOptions: { type: 'square', color: '#4a148c' },
      frameStyle: 'box',
      frameText: 'VIP TICKET',
      frameColor: '#4a148c',
    },
    isPredefined: true,
  },
  {
    id: 'product',
    name: 'Product Details',
    category: 'E-commerce',
    qrType: 'url',
    thumbnail: '/templates/product.png',
    design: {
      dotsOptions: { type: 'dots', color: '#d32f2f' },
      backgroundOptions: { color: '#ffffff' },
      cornersSquareOptions: { type: 'dot', color: '#b71c1c' },
      cornersDotOptions: { type: 'dot', color: '#b71c1c' },
      frameStyle: 'none',
      image: '/icons/tag.svg'
    },
    isPredefined: true,
  },
  {
    id: 'social',
    name: 'Social Hub',
    category: 'Social',
    qrType: 'url',
    thumbnail: '/templates/social.png',
    design: {
      dotsOptions: { type: 'rounded', color: '#ec407a' },
      backgroundOptions: { color: '#fce4ec' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#880e4f' },
      cornersDotOptions: { type: 'dot', color: '#c2185b' },
      frameStyle: 'banner',
      frameText: 'FOLLOW US',
      frameColor: '#ad1457',
    },
    isPredefined: true,
  },
  {
    id: 'email',
    name: 'Support Email',
    category: 'Business',
    qrType: 'email',
    thumbnail: '/templates/email.png',
    design: {
      dotsOptions: { type: 'rounded', color: '#5c6bc0' },
      backgroundOptions: { color: '#e8eaf6' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#283593' },
      cornersDotOptions: { type: 'dot', color: '#1a237e' },
      frameStyle: 'balloon',
      frameText: 'EMAIL US',
      frameColor: '#303f9f',
      image: '/icons/mail.svg'
    },
    isPredefined: true,
  },
  {
    id: 'location',
    name: 'Store Location',
    category: 'Maps',
    qrType: 'location',
    thumbnail: '/templates/location.png',
    design: {
      dotsOptions: { type: 'dots', color: '#ef5350' },
      backgroundOptions: { color: '#ffebee' },
      cornersSquareOptions: { type: 'dot', color: '#c62828' },
      cornersDotOptions: { type: 'dot', color: '#b71c1c' },
      frameStyle: 'box',
      frameText: 'FIND US',
      frameColor: '#d32f2f',
      image: '/icons/map-pin.svg'
    },
    isPredefined: true,
  },
  {
    id: 'app-download',
    name: 'Get the App',
    category: 'Mobile',
    qrType: 'url',
    thumbnail: '/templates/app.png',
    design: {
      dotsOptions: { type: 'square', color: '#000000' },
      backgroundOptions: { color: '#ffffff' },
      cornersSquareOptions: { type: 'square', color: '#000000' },
      cornersDotOptions: { type: 'square', color: '#000000' },
      frameStyle: 'banner',
      frameText: 'DOWNLOAD',
      frameColor: '#000000',
    },
    isPredefined: true,
  },
  {
    id: 'coupon',
    name: 'Summer Sale',
    category: 'Marketing',
    qrType: 'url',
    thumbnail: '/templates/coupon.png',
    design: {
      dotsOptions: { type: 'classy', color: '#ff9800' },
      backgroundOptions: { color: '#fff3e0' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#ef6c00' },
      cornersDotOptions: { type: 'dot', color: '#e65100' },
      frameStyle: 'balloon',
      frameText: '50% OFF',
      frameColor: '#f57c00',
    },
    isPredefined: true,
  },
  {
    id: 'instagram',
    name: 'Insta Growth',
    category: 'Social',
    qrType: 'url',
    thumbnail: '/templates/instagram.png',
    design: {
      dotsOptions: { type: 'rounded', color: '#d81b60' }, // Pink-ish
      backgroundOptions: { gradient: { type: 'linear', rotation: 45, colorStops: [{ offset: 0, color: '#f3e5f5' }, { offset: 1, color: '#e1bee7' }] } },
      cornersSquareOptions: { type: 'extra-rounded', color: '#880e4f' },
      cornersDotOptions: { type: 'dot', color: '#ad1457' },
      frameStyle: 'none',
      image: '/icons/instagram.svg'
    },
    isPredefined: true,
  },
  {
    id: 'feedback',
    name: 'Customer Voice',
    category: 'Business',
    qrType: 'url',
    thumbnail: '/templates/feedback.png',
    design: {
      dotsOptions: { type: 'dots', color: '#00acc1' },
      backgroundOptions: { color: '#e0f7fa' },
      cornersSquareOptions: { type: 'dot', color: '#00838f' },
      cornersDotOptions: { type: 'dot', color: '#006064' },
      frameStyle: 'banner',
      frameText: 'RATE US',
      frameColor: '#0097a7',
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
