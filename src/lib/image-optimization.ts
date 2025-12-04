/**
 * Next.js Image Optimization Configuration
 * Guidelines for using next/image for optimal performance
 */

/**
 * Image domains configuration (add to next.config.ts)
 * 
 * const nextConfig = {
 *   images: {
 *     domains: [
 *       'lh3.googleusercontent.com', // Google avatars
 *       'avatars.githubusercontent.com', // GitHub avatars
 *       'res.cloudinary.com', // Cloudinary CDN
 *       'your-custom-domain.com', // Your CDN
 *     ],
 *     formats: ['image/avif', 'image/webp'],
 *     deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
 *     imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
 *   },
 * }
 */

/**
 * Usage examples:
 * 
 * // Avatar images
 * <Image
 *   src={user.image}
 *   alt={user.name}
 *   width={40}
 *   height={40}
 *   className="rounded-full"
 * />
 * 
 * // QR Code images
 * <Image
 *   src={qrCode.imageUrl}
 *   alt={qrCode.name}
 *   width={300}
 *   height={300}
 *   priority={isMainQR} // Use for above-the-fold images
 * />
 * 
 * // Background images
 * <div className="relative w-full h-96">
 *   <Image
 *     src="/images/hero-bg.jpg"
 *     alt="Hero background"
 *     fill
 *     className="object-cover"
 *     priority
 *   />
 * </div>
 * 
 * // Template thumbnails
 * <Image
 *   src={template.thumbnail}
 *   alt={template.name}
 *   width={200}
 *   height={200}
 *   loading="lazy" // Lazy load below-the-fold images
 * />
 */

/**
 * Image optimization utilities
 */

export const ImageSizes = {
  avatar: { width: 40, height: 40 },
  avatarLarge: { width: 80, height: 80 },
  qrSmall: { width: 150, height: 150 },
  qrMedium: { width: 300, height: 300 },
  qrLarge: { width: 600, height: 600 },
  thumbnail: { width: 200, height: 200 },
  card: { width: 400, height: 300 },
};

export const getOptimizedImageUrl = (url: string, width: number, quality: number = 75): string => {
  // If using Cloudinary, add transformation parameters
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
  }
  
  // For other CDNs, add query parameters
  return `${url}?w=${width}&q=${quality}`;
};

export const isExternalImage = (src: string): boolean => {
  return src.startsWith('http://') || src.startsWith('https://');
};
