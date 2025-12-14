import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const linkInBio = await prisma.linkInBio.findUnique({
    where: { slug },
  });

  if (!linkInBio) {
    return { title: 'Not Found' };
  }

  return {
    title: linkInBio.title,
    description: linkInBio.description || `${linkInBio.title}'s links`,
  };
}

export default async function LinkInBioPage({ params }: Props) {
  const { slug } = await params;
  const linkInBio = await prisma.linkInBio.findUnique({
    where: { slug },
  });

  if (!linkInBio) {
    notFound();
  }

  const theme = linkInBio.theme as any || {
    backgroundColor: '#0f172a',
    primaryColor: '#3b82f6',
    textColor: '#ffffff',
    backgroundType: 'solid',
    backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    buttonStyle: 'rounded',
    cardStyle: 'glass',
    fontFamily: 'Inter, sans-serif',
  };

  const links = linkInBio.links as any[] || [];
  const socialLinks = linkInBio.socialLinks as any[] || [];

  // Determine background style
  const getBackgroundStyle = () => {
    if (theme.backgroundType === 'gradient' && theme.backgroundGradient) {
      return { background: theme.backgroundGradient };
    }
    if (theme.backgroundType === 'image' && theme.backgroundImage) {
      return { 
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return { backgroundColor: theme.backgroundColor || '#0f172a' };
  };

  // Button style classes
  const getButtonClasses = () => {
    const baseClasses = 'w-full py-4 px-6 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2';
    const styleMap = {
      rounded: 'rounded-lg',
      pill: 'rounded-full',
      square: 'rounded-none',
      soft: 'rounded-2xl',
    };
    return `${baseClasses} ${styleMap[theme.buttonStyle as keyof typeof styleMap] || 'rounded-lg'}`;
  };

  // Card style classes
  const getCardClasses = () => {
    const baseClasses = 'backdrop-blur-sm border transition-all duration-300';
    const styleMap = {
      glass: 'bg-white/5 border-white/10',
      solid: 'bg-white/10 border-white/20',
      outline: 'bg-transparent border-white/30',
      none: 'bg-transparent border-transparent',
    };
    return `${baseClasses} ${styleMap[theme.cardStyle as keyof typeof styleMap] || 'bg-white/5 border-white/10'}`;
  };

  return (
    <div 
      className="min-h-screen py-12 px-4"
      style={{
        ...getBackgroundStyle(),
        color: theme.textColor || '#ffffff',
        fontFamily: theme.fontFamily || 'Inter, sans-serif',
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Profile Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {linkInBio.profileImage && (
            <div className="relative w-32 h-32 mx-auto mb-6">
              <Image
                src={linkInBio.profileImage}
                alt={linkInBio.title}
                fill
                className="rounded-full object-cover border-4 border-white/20 shadow-2xl"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            {linkInBio.title}
          </h1>
          {linkInBio.description && (
            <p className="text-lg opacity-80 max-w-md mx-auto">
              {linkInBio.description}
            </p>
          )}
        </div>

        {/* Links Section */}
        <div className="space-y-4 mb-8">
          {links.filter((link: any) => link.visible).length > 0 ? (
            links.filter((link: any) => link.visible).map((link: any, index: number) => (
              <a
                key={link.id || index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${getButtonClasses()} ${getCardClasses()} group`}
                style={{
                  backgroundColor: theme.primaryColor ? `${theme.primaryColor}20` : 'rgba(59, 130, 246, 0.2)',
                  borderColor: theme.primaryColor ? `${theme.primaryColor}40` : 'rgba(59, 130, 246, 0.4)',
                }}
              >
                <span className="flex-1 text-center">{link.title}</span>
                <ExternalLink size={18} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            ))
          ) : (
            <div className={`${getCardClasses()} p-8 text-center opacity-60`}>
              <p className="text-lg">No links added yet</p>
            </div>
          )}
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4 mb-8">
            {socialLinks.filter((link: any) => link.visible).map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300"
                title={link.platform}
              >
                <span className="text-sm font-medium">{link.platform}</span>
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 opacity-60 hover:opacity-100 transition-opacity">
          <Link href="/" className="text-sm">
            Powered by QR Studio
          </Link>
        </div>
      </div>
    </div>
  );
}
