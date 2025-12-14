import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - List all landing pages for the current user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const landingPages = await prisma.landingPage.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: {
                    select: { FormSubmissions: true },
                },
            },
        });

        return NextResponse.json({ landingPages });
    } catch (error) {
        console.error('Error fetching landing pages:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create a new landing page
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { title, description, slug, content, theme, published, seoTitle, seoDescription } = body;

        if (!title || !slug) {
            return NextResponse.json(
                { error: 'Title and slug are required' },
                { status: 400 }
            );
        }

        // Check if slug is unique
        const existingPage = await prisma.landingPage.findUnique({
            where: { slug },
        });

        if (existingPage) {
            return NextResponse.json(
                { error: 'Slug already exists' },
                { status: 400 }
            );
        }

        const landingPage = await prisma.landingPage.create({
            data: {
                userId: user.id,
                title,
                description: description || null,
                slug,
                content: content || { sections: [] },
                theme: theme || { primaryColor: '#2563eb', backgroundColor: '#ffffff' },
                published: published || false,
                seoTitle: seoTitle || title,
                seoDescription: seoDescription || description || '',
            },
        });

        return NextResponse.json({ landingPage }, { status: 201 });
    } catch (error) {
        console.error('Error creating landing page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
