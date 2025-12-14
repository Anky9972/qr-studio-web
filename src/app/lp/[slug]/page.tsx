import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

interface Section {
    id: string;
    type: string;
    content: Record<string, any>;
}

interface LandingPageContent {
    sections: Section[];
}

interface Theme {
    primaryColor?: string;
    backgroundColor?: string;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    const page = await prisma.landingPage.findUnique({
        where: { slug },
        select: { title: true, seoTitle: true, seoDescription: true },
    });

    if (!page) {
        return { title: 'Page Not Found' };
    }

    return {
        title: page.seoTitle || page.title,
        description: page.seoDescription || '',
    };
}

export default async function PublicLandingPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const page = await prisma.landingPage.findUnique({
        where: { slug },
    });

    if (!page || !page.published) {
        notFound();
    }

    // Increment view count
    await prisma.landingPage.update({
        where: { id: page.id },
        data: { views: { increment: 1 } },
    });

    const content = (page.content as unknown) as LandingPageContent;
    const theme = ((page.theme || {}) as unknown) as Theme;
    const sections = content?.sections || [];

    const primaryColor = theme.primaryColor || '#2563eb';
    const backgroundColor = theme.backgroundColor || '#ffffff';

    return (
        <div
            className="landing-page"
            style={{
                minHeight: '100vh',
                backgroundColor,
                color: backgroundColor === '#ffffff' ? '#1a1a1a' : '#ffffff',
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: page.customCss || '' }} />

            {sections.map((section: Section) => (
                <div key={section.id}>
                    {section.type === 'hero' && (
                        <div
                            style={{
                                padding: '80px 20px',
                                textAlign: 'center',
                                background: `linear-gradient(135deg, ${primaryColor}22 0%, transparent 100%)`,
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: '3rem',
                                    fontWeight: 700,
                                    marginBottom: '1rem',
                                    maxWidth: '800px',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                            >
                                {String(section.content.heading || '')}
                            </h1>
                            <p
                                style={{
                                    fontSize: '1.25rem',
                                    opacity: 0.8,
                                    marginBottom: '2rem',
                                    maxWidth: '600px',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                            >
                                {String(section.content.subheading || '')}
                            </p>
                            {section.content.buttonText && (
                                <a
                                    href={String(section.content.buttonUrl || '#')}
                                    style={{
                                        display: 'inline-block',
                                        padding: '12px 32px',
                                        backgroundColor: primaryColor,
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                    }}
                                >
                                    {String(section.content.buttonText)}
                                </a>
                            )}
                        </div>
                    )}

                    {section.type === 'text' && (
                        <div
                            style={{
                                padding: '40px 20px',
                                maxWidth: '800px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                        >
                            <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                                {String(section.content.text || '')}
                            </p>
                        </div>
                    )}

                    {section.type === 'image' && section.content.url && (
                        <div
                            style={{
                                padding: '40px 20px',
                                textAlign: 'center',
                            }}
                        >
                            <img
                                src={String(section.content.url)}
                                alt={String(section.content.alt || '')}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '500px',
                                    borderRadius: '8px',
                                }}
                            />
                            {section.content.caption && (
                                <p style={{ marginTop: '1rem', opacity: 0.7 }}>
                                    {String(section.content.caption)}
                                </p>
                            )}
                        </div>
                    )}

                    {section.type === 'button' && (
                        <div
                            style={{
                                padding: '20px',
                                textAlign: 'center',
                            }}
                        >
                            <a
                                href={String(section.content.url || '#')}
                                style={{
                                    display: 'inline-block',
                                    padding: '12px 32px',
                                    backgroundColor:
                                        section.content.style === 'outline' ? 'transparent' : primaryColor,
                                    color: section.content.style === 'outline' ? primaryColor : '#ffffff',
                                    textDecoration: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    border: `2px solid ${primaryColor}`,
                                }}
                            >
                                {String(section.content.text || 'Click')}
                            </a>
                        </div>
                    )}

                    {section.type === 'spacer' && (
                        <div style={{ height: Number(section.content.height) || 40 }} />
                    )}

                    {section.type === 'form' && (
                        <div
                            style={{
                                padding: '40px 20px',
                                maxWidth: '500px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                        >
                            <form
                                action={`/api/landing-pages/${page.id}/submit`}
                                method="POST"
                                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                            >
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    required
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        fontSize: '1rem',
                                    }}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    required
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        fontSize: '1rem',
                                    }}
                                />
                                <textarea
                                    name="message"
                                    placeholder="Your Message"
                                    rows={4}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        fontSize: '1rem',
                                        resize: 'vertical',
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        padding: '12px 32px',
                                        backgroundColor: primaryColor,
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {String(section.content.submitText || 'Submit')}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            ))}

            {sections.length === 0 && (
                <div
                    style={{
                        padding: '100px 20px',
                        textAlign: 'center',
                    }}
                >
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{page.title}</h1>
                    {page.description && <p style={{ opacity: 0.7 }}>{page.description}</p>}
                </div>
            )}

            <footer
                style={{
                    padding: '20px',
                    textAlign: 'center',
                    opacity: 0.5,
                    fontSize: '0.875rem',
                }}
            >
                Powered by QR Studio
            </footer>
        </div>
    );
}
