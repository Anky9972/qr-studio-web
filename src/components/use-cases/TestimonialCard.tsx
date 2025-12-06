import { Card, CardContent } from '@/components/ui/Card';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  avatar?: string;
  rating: number;
  text: string;
  industry?: string;
}

export default function TestimonialCard({
  name,
  role,
  company,
  avatar,
  rating,
  text,
  industry
}: TestimonialCardProps) {
  return (
    <Card variant="glass" className="h-full flex flex-col group hover:border-white/20 transition-all duration-300">
      <CardContent className="flex-grow p-6">
        <div className="flex items-center gap-4 mb-4">
          {avatar ? (
            <img src={avatar} alt={name} className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-purple-500/20">
              {name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-white">
              {name}
            </h3>
            <p className="text-sm text-gray-400">
              {role} at {company}
            </p>
            {industry && (
              <p className="text-xs text-blue-400 font-medium mt-0.5">
                {industry}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}>
              ★
            </span>
          ))}
        </div>

        <blockquote className="text-gray-300 italic leading-relaxed relative">
          &quot;{text}&quot;
        </blockquote>
      </CardContent>
    </Card>
  );
}

