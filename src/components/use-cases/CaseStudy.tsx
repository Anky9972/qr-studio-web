import { TrendingUp } from '@mui/icons-material';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

// Since I haven't created a specific Avatar component in src/components/ui/Avatar.tsx yet (Wait, I haven't?), I'll assume I need to handle it or create it.
// Actually I don't have src/components/ui/Avatar.tsx in my memory. I should check or just use standard div.
// I'll use a simple custom implementation for now.

interface CaseStudyProps {
  company: string;
  industry: string;
  logo?: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  quote?: {
    text: string;
    author: string;
    role: string;
  };
}

export default function CaseStudy({
  company,
  industry,
  logo,
  challenge,
  solution,
  results,
  quote
}: CaseStudyProps) {
  return (
    <Card variant="glass" className="overflow-visible border-l-4 border-l-blue-500">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-8">
          {logo ? (
            <img
              src={logo}
              alt={company}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
              {company.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {company}
            </h3>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-none">
              {industry}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">
              The Challenge
            </h4>
            <p className="text-gray-300 leading-relaxed">
              {challenge}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-2">
              The Solution
            </h4>
            <p className="text-gray-300 leading-relaxed">
              {solution}
            </p>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 text-center">
            The Results
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="text-green-400 w-5 h-5" />
                  <div className="text-3xl font-bold text-green-400">
                    {result.value}
                  </div>
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  {result.metric}
                </div>
                <div className="text-xs text-gray-400">
                  {result.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {quote && (
          <div className="relative pl-6 py-2 border-l-2 border-blue-500/50">
            <p className="text-lg italic text-gray-300 mb-2">
              &quot;{quote.text}&quot;
            </p>
            <div>
              <span className="font-bold text-white block">{quote.author}</span>
              <span className="text-sm text-gray-400">{quote.role}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

