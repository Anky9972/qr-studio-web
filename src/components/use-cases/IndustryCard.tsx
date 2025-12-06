import Link from 'next/link';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowForward } from '@mui/icons-material';
import { cn } from '@/lib/utils';

interface IndustryCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  useCases: string[];
  benefits: string[];
  cta?: {
    text: string;
    href: string;
  };
}

export default function IndustryCard({
  title,
  description,
  icon,
  useCases,
  benefits,
  cta
}: IndustryCardProps) {
  return (
    <Card variant="glass" className="h-full flex flex-col group hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <CardContent className="flex-grow p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white">
            {title}
          </h3>
        </div>

        <p className="text-gray-400 mb-6 leading-relaxed">
          {description}
        </p>

        <div className="mb-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Common Use Cases
          </h4>
          <div className="flex flex-wrap gap-2">
            {useCases.map((useCase, index) => (
              <Badge key={index} variant="outline" className="bg-white/5 border-white/10 text-gray-300">
                {useCase}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Key Benefits
          </h4>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {cta && (
          <div className="mt-auto pt-4 border-t border-white/10">
            <Button
              className="w-full justify-between group-hover:translate-x-1 transition-transform"
              variant="ghost"
              onClick={() => window.location.href = cta.href}
            >
              {cta.text}
              <ArrowForward className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

