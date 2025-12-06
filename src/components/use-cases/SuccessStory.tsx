import { CheckCircle, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface SuccessStoryProps {
  title: string;
  company: string;
  industry: string;
  summary: string;
  achievements: string[];
  tags: string[];
  cta?: {
    text: string;
    href: string;
  };
}

export default function SuccessStory({
  title,
  company,
  industry,
  summary,
  achievements,
  tags,
  cta
}: SuccessStoryProps) {
  return (
    <Card variant="glass" className="h-full flex flex-col hover:border-white/20 transition-all duration-300">
      <CardContent className="flex-grow p-6">
        <div className="mb-4">
          <Badge variant="outline" className="mb-2 text-blue-400 border-blue-400/30">
            {industry}
          </Badge>
          <h3 className="text-xl font-bold text-white mb-1">
            {title}
          </h3>
          <p className="text-sm font-medium text-gray-400">
            {company}
          </p>
        </div>

        <p className="text-gray-300 mb-6 leading-relaxed">
          {summary}
        </p>

        <div className="mb-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Key Achievements
          </h4>
          <ul className="space-y-2">
            {achievements.map((achievement, index) => (
              <li
                key={index}
                className="flex items-start gap-3"
              >
                <CheckCircle
                  className="w-5 h-5 text-green-500 mt-0.5 shrink-0"
                />
                <span className="text-sm text-gray-300">
                  {achievement}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-white/5 hover:bg-white/10 text-gray-400 border-none transition-colors">
              {tag}
            </Badge>
          ))}
        </div>

        {cta && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-auto pl-0 hover:pl-2 transition-all text-blue-400 hover:text-blue-300"
            onClick={() => window.location.href = cta.href}
          >
            {cta.text}
            <ArrowForward className="w-4 h-4 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

