import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface AnimatedQRCodeProps {
  value: string;
  size?: number;
  animationType?: 'pulse' | 'gradient-wave' | 'rainbow' | 'glow';
  pattern?: 'dots' | 'rounded' | 'square';
  baseColor?: string;
  design?: any; // Pass full design object for frames
  className?: string; // Add className prop for better flexibility
}

export const AnimatedQRCode: React.FC<AnimatedQRCodeProps> = ({
  value,
  size = 300,
  animationType = 'pulse',
  pattern = 'dots',
  baseColor = '#2196F3',
  design,
  className,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const hueRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const getAnimatedColor = (currentHue: number) => {
      switch (animationType) {
        case 'rainbow':
          return `hsl(${currentHue}, 70%, 50%)`;
        case 'gradient-wave':
          return `hsl(${190 + Math.sin(currentHue / 50) * 30}, 70%, 50%)`;
        case 'glow':
          return baseColor;
        case 'pulse':
        default:
          return baseColor;
      }
    };

    const options: Options = {
      width: size,
      height: size,
      data: value,
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'H',
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0,
      },
      dotsOptions: {
        type: pattern,
        color: getAnimatedColor(hueRef.current),
      },
      backgroundOptions: {
        color: animationType === 'glow' ? '#000000' : '#FFFFFF',
      },
      cornersSquareOptions: {
        type: 'extra-rounded',
        color: getAnimatedColor(hueRef.current),
      },
      cornersDotOptions: {
        type: 'dot',
        color: getAnimatedColor(hueRef.current),
      },
    };

    // Clear any existing QR code first
    if (canvasRef.current) {
      canvasRef.current.innerHTML = '';
    }

    qrCodeRef.current = new QRCodeStyling(options);
    qrCodeRef.current.append(canvasRef.current);

    return () => {
      if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
      }
    };
  }, [value, size, pattern, baseColor, animationType]);

  useEffect(() => {
    if (!qrCodeRef.current) return;

    // Only run JS animation interval for types that actually change color over time
    if (animationType !== 'rainbow' && animationType !== 'gradient-wave') return;

    const animationInterval = setInterval(() => {
      hueRef.current = (hueRef.current + 1) % 360;

      const getAnimatedColor = (currentHue: number) => {
        switch (animationType) {
          case 'rainbow':
            return `hsl(${currentHue}, 70%, 50%)`;
          case 'gradient-wave':
            return `hsl(${190 + Math.sin(currentHue / 50) * 30}, 70%, 50%)`;
          default:
            return baseColor;
        }
      };

      qrCodeRef.current?.update({
        dotsOptions: {
          type: pattern,
          color: getAnimatedColor(hueRef.current),
        },
        cornersSquareOptions: {
          type: 'extra-rounded',
          color: getAnimatedColor(hueRef.current),
        },
        cornersDotOptions: {
          type: 'dot',
          color: getAnimatedColor(hueRef.current),
        },
      });
    }, 50);

    return () => clearInterval(animationInterval);
  }, [animationType, pattern, baseColor]);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4",
        className
      )}
    >
      <div
        className={cn(
          "p-6 rounded-3xl bg-white shadow-xl transition-all duration-300 relative",
          animationType === 'glow' ? 'bg-black shadow-primary/50' : 'bg-white',
          animationType === 'pulse' && "animate-pulse-slow",
          animationType === 'glow' && "shadow-[0_0_50px_rgba(33,150,243,0.3)] animate-pulse-glow"
        )}
      >
        <div className={cn(
          "relative",
          design?.frameStyle === 'box' && "border-8 border-black p-4 rounded-xl",
          design?.frameStyle === 'banner' && "pb-12 border-4 border-black p-2 rounded-lg bg-white",
          design?.frameStyle === 'balloon' && "p-4 rounded-[3rem] rounded-bl-none border-4 border-black bg-white"
        )} style={{ borderColor: design?.frameColor }}>

          <div ref={canvasRef} />

          {design?.frameStyle === 'banner' && (
            <div
              className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-center text-white font-bold text-sm uppercase tracking-wider"
              style={{ backgroundColor: design?.frameColor || 'black' }}
            >
              {design?.frameText}
            </div>
          )}

          {design?.frameStyle === 'box' && (
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1 text-xs font-bold uppercase tracking-wider border-2"
              style={{ borderColor: design?.frameColor || 'black', color: design?.frameColor || 'black' }}
            >
              {design?.frameText}
            </div>
          )}
        </div>
      </div>

      {animationType === 'rainbow' && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium animate-pulse">
          <Sparkles size={16} className="text-yellow-500" />
          <span>Animated Rainbow Effect Active</span>
        </div>
      )}
    </div>
  );
};

export default AnimatedQRCode;
