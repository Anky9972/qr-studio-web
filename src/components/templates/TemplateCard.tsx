import { Star, Eye } from 'lucide-react';
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
  return (
    <Card className="h-full flex flex-col group hover:shadow-neon-blue transition-all duration-300 border-white/10 hover:border-blue-500/50 bg-white/5 backdrop-blur-sm">
      {/* Thumbnail */}
      <div className="relative h-48 bg-black/40 border-b border-white/10 flex items-center justify-center p-4 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={name}
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-24 h-24 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-lg animate-pulse" />
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
