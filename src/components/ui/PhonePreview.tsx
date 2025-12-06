
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ThemeConfig } from '@/types/theme';

interface PhonePreviewProps {
    theme: ThemeConfig;
    children: React.ReactNode;
    showNotch?: boolean;
    className?: string;
    logo?: string;
}

export default function PhonePreview({
    theme,
    children,
    showNotch = true,
    className,
    logo
}: PhonePreviewProps) {

    const getBackgroundStyle = () => {
        switch (theme.backgroundType) {
            case 'gradient':
                return { background: theme.backgroundGradient };
            case 'image':
                return {
                    backgroundImage: `url(${theme.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: theme.backgroundColor // fallback
                };
            case 'pattern':
                return {
                    backgroundImage: theme.backgroundImage, // CSS gradient/pattern string
                    backgroundSize: 'auto', // Patterns usually tile
                    backgroundColor: theme.backgroundColor
                };
            default:
                return { backgroundColor: theme.backgroundColor };
        }
    };

    return (
        <div className={cn("sticky top-6", className)}>
            <div className="bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden aspect-[9/19] max-w-[320px] mx-auto relative">
                {/* Notch */}
                {showNotch && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-6 bg-gray-800 rounded-b-xl z-20"></div>
                )}

                {/* Screen Content */}
                <div
                    className="w-full h-full overflow-y-auto hide-scrollbar p-6 pt-12 relative"
                    style={{
                        ...getBackgroundStyle(),
                        fontFamily: theme.fontFamily,
                    }}
                >
                    {children}

                    <div className="mt-12 text-center pb-6">
                        <p
                            className="text-[10px] opacity-40 uppercase tracking-widest"
                            style={{ color: theme.textColor }}
                        >
                            Powered by QR Studio
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
