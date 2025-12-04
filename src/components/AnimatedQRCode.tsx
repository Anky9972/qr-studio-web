import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { Box, Paper, Typography } from '@mui/material';

interface AnimatedQRCodeProps {
  value: string;
  size?: number;
  animationType?: 'pulse' | 'gradient-wave' | 'rainbow' | 'glow';
  pattern?: 'dots' | 'rounded' | 'square';
  baseColor?: string;
}

export const AnimatedQRCode: React.FC<AnimatedQRCodeProps> = ({
  value,
  size = 300,
  animationType = 'pulse',
  pattern = 'dots',
  baseColor = '#2196F3',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [hue, setHue] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const getAnimatedColor = () => {
      switch (animationType) {
        case 'rainbow':
          return `hsl(${hue}, 70%, 50%)`;
        case 'gradient-wave':
          return `hsl(${190 + Math.sin(hue / 50) * 30}, 70%, 50%)`;
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
        color: getAnimatedColor(),
      },
      backgroundOptions: {
        color: animationType === 'glow' ? '#000000' : '#FFFFFF',
      },
      cornersSquareOptions: {
        type: 'extra-rounded',
        color: getAnimatedColor(),
      },
      cornersDotOptions: {
        type: 'dot',
        color: getAnimatedColor(),
      },
    };

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

    const animationInterval = setInterval(() => {
      setHue((prev) => (prev + 1) % 360);

      const getAnimatedColor = () => {
        switch (animationType) {
          case 'rainbow':
            return `hsl(${hue}, 70%, 50%)`;
          case 'gradient-wave':
            return `hsl(${190 + Math.sin(hue / 50) * 30}, 70%, 50%)`;
          case 'glow':
            return baseColor;
          case 'pulse':
          default:
            return baseColor;
        }
      };

      qrCodeRef.current?.update({
        dotsOptions: {
          type: pattern,
          color: getAnimatedColor(),
        },
        cornersSquareOptions: {
          type: 'extra-rounded',
          color: getAnimatedColor(),
        },
        cornersDotOptions: {
          type: 'dot',
          color: getAnimatedColor(),
        },
      });
    }, 50);

    return () => clearInterval(animationInterval);
  }, [hue, animationType, pattern, baseColor]);

  const getAnimationStyles = () => {
    switch (animationType) {
      case 'pulse':
        return {
          animation: 'qr-pulse 2s ease-in-out infinite',
          '@keyframes qr-pulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: 1 },
            '50%': { transform: 'scale(1.02)', opacity: 0.95 },
          },
        };
      case 'glow':
        return {
          animation: 'qr-glow 2s ease-in-out infinite',
          filter: 'drop-shadow(0 0 20px rgba(33, 150, 243, 0.5))',
          '@keyframes qr-glow': {
            '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(33, 150, 243, 0.5))' },
            '50%': { filter: 'drop-shadow(0 0 30px rgba(33, 150, 243, 0.8))' },
          },
        };
      default:
        return {};
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          background: animationType === 'glow' ? '#000' : '#fff',
          ...getAnimationStyles(),
        }}
      >
        <div ref={canvasRef} />
      </Paper>
      {animationType === 'rainbow' && (
        <Typography variant="caption" color="text.secondary">
          🌈 Animated Rainbow QR Code
        </Typography>
      )}
    </Box>
  );
};

export default AnimatedQRCode;
