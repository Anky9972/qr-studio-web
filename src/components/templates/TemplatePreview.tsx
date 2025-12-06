import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Check } from 'lucide-react';

interface TemplatePreviewProps {
  open: boolean;
  onClose: () => void;
  template: {
    id: string;
    name: string;
    description: string;
    category: string;
    thumbnail?: string;
    features?: string[];
    isPro?: boolean;
  } | null;
  isAuthenticated?: boolean;
}

export default function TemplatePreview({
  open,
  onClose,
  template,
  isAuthenticated = false
}: TemplatePreviewProps) {
  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <DialogTitle className="text-2xl">{template.name}</DialogTitle>
            {template.isPro && (
              <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                PRO
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="w-fit text-blue-400 border-blue-500/30 bg-blue-500/5 mb-4">
            {template.category}
          </Badge>
          <DialogDescription>
            {template.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Preview Image */}
          <div className="w-full h-64 bg-black/40 rounded-lg border border-white/10 flex items-center justify-center p-4">
            {template.thumbnail ? (
              <img
                src={template.thumbnail}
                alt={template.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="w-32 h-32 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-lg animate-pulse" />
              </div>
            )}
          </div>

          {template.features && template.features.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Features</h4>
              <ul className="grid sm:grid-cols-2 gap-2">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} className="hover:bg-white/5">
            Close
          </Button>
          <Button
            variant="premium"
            asChild
          >
            <Link href={isAuthenticated ? `/dashboard?template=${template.id}` : '/signup'}>
              {isAuthenticated ? 'Use Template' : 'Sign Up to Use'}
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
