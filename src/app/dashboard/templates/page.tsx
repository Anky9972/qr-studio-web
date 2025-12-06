'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  QrCode,
  LayoutGrid,
  Plus,
  Search,
  Briefcase,
  Wifi,
  Utensils,
  Calendar,
  ShoppingBag,
  Share2,
  MessageSquare,
  Smartphone,
  Tag,
  CreditCard,
  FileText,
  MapPin,
  Linkedin,
  Instagram,
  Facebook
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AnimatedQRCode } from '@/components/AnimatedQRCode';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  name: string;
  category: string;
  qrType: string;
  thumbnail: string;
  design: any;
  isPredefined: boolean;
}

interface GroupedTemplates {
  category: string;
  templates: Template[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  Business: <Briefcase size={16} />,
  Connectivity: <Wifi size={16} />,
  Restaurant: <Utensils size={16} />,
  Events: <Calendar size={16} />,
  'E-commerce': <ShoppingBag size={16} />,
  Social: <Share2 size={16} />,
  Communication: <MessageSquare size={16} />,
  Mobile: <Smartphone size={16} />,
  Marketing: <Tag size={16} />,
  Finance: <CreditCard size={16} />,
  Documents: <FileText size={16} />,
  Maps: <MapPin size={16} />,
};

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = (template: Template) => {
    // Store template in session storage and navigate to generate page
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    router.push('/dashboard/generate');
  };

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.qrType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            QR Code Templates
          </h1>
          <p className="text-muted-foreground mt-1">
            Start with professionally designed templates for common use cases.
          </p>
        </div>
        <Button variant="glow" onClick={() => router.push('/dashboard/generate')}>
          <Plus size={16} className="mr-2" /> Create from Scratch
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
        <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="bg-black/20 border border-white/5 p-1 h-auto flex-wrap justify-start">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <LayoutGrid size={14} className="mr-2" /> All
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  {categoryIcons[category] && <span className="mr-2 opacity-70">{categoryIcons[category]}</span>}
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="relative w-full lg:w-64 lg:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search templates..."
            className="pl-9 bg-black/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card variant="glass" className="py-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <QrCode size={40} className="text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or category filters.
          </p>
          <Button variant="outline" onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}>
            Clear Filters
          </Button>
        </Card>
      ) : (
        /* Templates Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              variant="glass"
              className="group overflow-hidden flex flex-col hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Preview Area */}
              <div className="h-48 bg-black/40 relative flex items-center justify-center overflow-hidden border-b border-white/5 group-hover:bg-black/50 transition-colors">
                <div className="scale-75 group-hover:scale-90 transition-transform duration-500">
                  {/* Utilize AnimatedQRCode for dynamic preview if design object exists */}
                  {template.design ? (
                    <AnimatedQRCode
                      value={`https://qrstudio.app/template/${template.id}`}
                      size={180}
                      design={template.design}
                      baseColor={template.design.dotsOptions?.color}
                      animationType="pulse"
                    />
                  ) : (
                    <QrCode size={80} className="text-muted-foreground" />
                  )}
                </div>

                {/* Overlay Action Button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <Button variant="glow" onClick={() => handleUseTemplate(template)}>
                    Use Template
                  </Button>
                </div>

                {!template.isPredefined && (
                  <Badge variant="secondary" className="absolute top-3 right-3 shadow-lg">Custom</Badge>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold truncate pr-2" title={template.name}>{template.name}</h3>
                  <Badge variant="outline" className="text-[10px] uppercase shrink-0">{template.qrType}</Badge>
                </div>

                <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    {categoryIcons[template.category]} {template.category}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
