import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Get a single landing page
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const landingPage = await prisma.landingPage.findFirst({
            where: { id, userId: user.id },
            include: {
                FormSubmissions: {
                    orderBy: { createdAt: 'desc' },
                    take: 50,
                },
                _count: {
                    select: { FormSubmissions: true },
                },
            },
        });

        if (!landingPage) {
            return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
        }

        return NextResponse.json({ landingPage });
    } catch (error) {
        console.error('Error fetching landing page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update a landing page
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check ownership
        const existingPage = await prisma.landingPage.findFirst({
            where: { id, userId: user.id },
        });

        if (!existingPage) {
            return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
        }

        const body = await request.json();
        const { title, description, slug, content, theme, published, seoTitle, seoDescription, customCss } = body;

        // Check slug uniqueness if changed
        if (slug && slug !== existingPage.slug) {
            const slugExists = await prisma.landingPage.findUnique({
                where: { slug },
            });
            if (slugExists) {
                return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
            }
        }

        const landingPage = await prisma.landingPage.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(slug !== undefined && { slug }),
                ...(content !== undefined && { content }),
                ...(theme !== undefined && { theme }),
                ...(published !== undefined && { published }),
                ...(seoTitle !== undefined && { seoTitle }),
                ...(seoDescription !== undefined && { seoDescription }),
                ...(customCss !== undefined && { customCss }),
            },
        });

        return NextResponse.json({ landingPage });
    } catch (error) {
        console.error('Error updating landing page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete a landing page
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check ownership
        const existingPage = await prisma.landingPage.findFirst({
            where: { id, userId: user.id },
        });

        if (!existingPage) {
            return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
        }

        await prisma.landingPage.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Landing page deleted' });
    } catch (error) {
        console.error('Error deleting landing page:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
