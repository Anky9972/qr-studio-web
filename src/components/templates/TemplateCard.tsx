import { Star, Eye, QrCode, Wifi, Store, Calendar, MapPin, Mail, CreditCard, Share2, Utensils, Package } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  rating?: number;
  usageCount?: number;
  isPro?: boolean;
  isAuthenticated?: boolean;
}

// Get category-specific icon and color
const getCategoryStyle = (category: string) => {
  const styles: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
    'Business Cards': { icon: <QrCode className="w-8 h-8" />, color: 'text-blue-400', bgColor: 'from-blue-600/20 to-blue-800/30' },
    'WiFi Access': { icon: <Wifi className="w-8 h-8" />, color: 'text-green-400', bgColor: 'from-green-600/20 to-green-800/30' },
    'Restaurant Menus': { icon: <Utensils className="w-8 h-8" />, color: 'text-orange-400', bgColor: 'from-orange-600/20 to-orange-800/30' },
    'Event Tickets': { icon: <Calendar className="w-8 h-8" />, color: 'text-purple-400', bgColor: 'from-purple-600/20 to-purple-800/30' },
    'Product Labels': { icon: <Package className="w-8 h-8" />, color: 'text-cyan-400', bgColor: 'from-cyan-600/20 to-cyan-800/30' },
    'Social Media': { icon: <Share2 className="w-8 h-8" />, color: 'text-pink-400', bgColor: 'from-pink-600/20 to-pink-800/30' },
    'URLs & Links': { icon: <QrCode className="w-8 h-8" />, color: 'text-indigo-400', bgColor: 'from-indigo-600/20 to-indigo-800/30' },
    'Location/Maps': { icon: <MapPin className="w-8 h-8" />, color: 'text-red-400', bgColor: 'from-red-600/20 to-red-800/30' },
    'Contact Information': { icon: <QrCode className="w-8 h-8" />, color: 'text-teal-400', bgColor: 'from-teal-600/20 to-teal-800/30' },
    'Email & SMS': { icon: <Mail className="w-8 h-8" />, color: 'text-yellow-400', bgColor: 'from-yellow-600/20 to-yellow-800/30' },
  };
  return styles[category] || { icon: <QrCode className="w-8 h-8" />, color: 'text-blue-400', bgColor: 'from-blue-600/20 to-blue-800/30' };
};

export default function TemplateCard({
  id,
  name,
  description,
  category,
  thumbnail,
  rating = 0,
  usageCount = 0,
  isPro = false,
  isAuthenticated = false
}: TemplateCardProps) {
  const categoryStyle = getCategoryStyle(category);

  return (
    <Card className="h-full flex flex-col group hover:shadow-neon-blue transition-all duration-300 border-white/10 hover:border-blue-500/50 bg-white/5 backdrop-blur-sm">
      {/* Thumbnail */}
      <div className={`relative h-48 bg-gradient-to-br ${categoryStyle.bgColor} border-b border-white/10 flex items-center justify-center p-4 overflow-hidden`}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={name}
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="relative flex flex-col items-center justify-center">
            {/* QR Code Visual */}
            <div className="relative">
              <div className="w-28 h-28 bg-white rounded-lg p-2 shadow-xl transform transition-transform duration-300 group-hover:scale-110">
                {/* QR Pattern */}
                <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-0.5">
                  {/* Position markers */}
                  <div className="col-span-3 row-span-3 bg-black rounded-sm flex items-center justify-center">
                    <div className="w-3/5 h-3/5 bg-white rounded-sm flex items-center justify-center">
                      <div className="w-2/3 h-2/3 bg-black rounded-sm" />
                    </div>
                  </div>
                  <div className="bg-white" /><div className="bg-black" /><div className="bg-white" />
                  <div className="col-span-3 row-span-3 bg-black rounded-sm flex items-center justify-center">
                    <div className="w-3/5 h-3/5 bg-white rounded-sm flex items-center justify-center">
                      <div className="w-2/3 h-2/3 bg-black rounded-sm" />
                    </div>
                  </div>
                  <div className="bg-white" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" />
                  <div className="bg-white" /><div className="bg-black" /><div className="bg-white" />
                  <div className="bg-black" /><div className="bg-white" /><div className="bg-black" /><div className="bg-white" />
                  <div className="bg-black" /><div className="bg-white" /><div className="bg-black" />
                  <div className="col-span-3 row-span-3 bg-black rounded-sm flex items-center justify-center">
                    <div className="w-3/5 h-3/5 bg-white rounded-sm flex items-center justify-center">
                      <div className="w-2/3 h-2/3 bg-black rounded-sm" />
                    </div>
                  </div>
                  <div className="bg-white" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" />
                  <div className="bg-white" /><div className="bg-black" /><div className="bg-white" />
                  <div className="bg-black" /><div className="bg-white" /><div className="bg-black" /><div className="bg-white" />
                  <div className="bg-black" /><div className="bg-white" /><div className="bg-black" />
                </div>
              </div>
              {/* Category Icon Overlay */}
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-black/80 border-2 border-white/20 flex items-center justify-center ${categoryStyle.color}`}>
                {categoryStyle.icon}
              </div>
            </div>
          </div>
        )}
        {isPro && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              PRO
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex-grow p-5 flex flex-col">
        <div className="mb-3">
          <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400 bg-blue-500/5">
            {category}
          </Badge>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {name}
        </h3>

        <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 font-medium">
          {rating > 0 && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          {usageCount > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>
                {usageCount >= 1000
                  ? `${(usageCount / 1000).toFixed(1)}k`
                  : usageCount}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          variant={isAuthenticated ? "default" : "outline"}
          className="w-full justify-center"
          asChild
        >
          <Link href={isAuthenticated ? `/dashboard?template=${id}` : '/signup'}>
            {isAuthenticated ? 'Use Template' : 'Sign Up to Use'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
