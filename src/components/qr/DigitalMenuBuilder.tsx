'use client';

import React, { useState } from 'react';
import {
  Utensils,
  Image as ImageIcon,
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Settings,
  Palette,
  Layout,
  Euro,
  DollarSign,
  PoundSterling,
  JapaneseYen,
  Eye,
  Save,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { cn } from '@/lib/utils';
import PhonePreview from '@/components/ui/PhonePreview';
import ThemeEditor from '@/components/ui/ThemeEditor';
import { ThemeConfig } from '@/types/theme';
import { themePresets } from '@/lib/theme-presets';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: string;
  image?: string;
  visible: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
  visible: boolean;
}

interface DigitalMenuData {
  title: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  type: 'menu' | 'gallery' | 'portfolio';
  categories: MenuCategory[];
  theme: ThemeConfig;
  settings: {
    currency: string;
    showPrices: boolean;
    showImages: boolean;
  };
  published: boolean;
}

interface DigitalMenuBuilderProps {
  data?: DigitalMenuData;
  onSave: (data: DigitalMenuData) => Promise<void>;
  onPreview?: () => void;
}

const defaultTheme = themePresets[0].config;

const defaultSettings = {
  currency: 'USD',
  showPrices: true,
  showImages: true,
};

export default function DigitalMenuBuilder({
  data,
  onSave,
  onPreview,
}: DigitalMenuBuilderProps) {
  const [title, setTitle] = useState(data?.title || '');
  const [description, setDescription] = useState(data?.description || '');
  const [logo, setLogo] = useState(data?.logo || '');
  const [coverImage, setCoverImage] = useState(data?.coverImage || '');
  const [type, setType] = useState<'menu' | 'gallery' | 'portfolio'>(data?.type || 'menu');
  const [categories, setCategories] = useState<MenuCategory[]>(data?.categories || []);
  const [theme, setTheme] = useState(data?.theme || defaultTheme);
  const [settings, setSettings] = useState(data?.settings || defaultSettings);
  const [published, setPublished] = useState(data?.published || false);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings'>('content');

  // category dialog state
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');

  // item dialog state
  const [itemDialog, setItemDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleItemImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setItemImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDialog(true);
  };

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDialog(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      setCategories(categories.map(cat => cat.id === editingCategory.id ? { ...cat, name: categoryName } : cat));
    } else {
      const newCategory: MenuCategory = {
        id: `cat-${Date.now()}`,
        name: categoryName,
        items: [],
        visible: true,
      };
      setCategories([...categories, newCategory]);
    }
    setCategoryDialog(false);
  };

  const handleDeleteCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleAddItem = (categoryId: string) => {
    setCurrentCategory(categoryId);
    setEditingItem(null);
    setItemName('');
    setItemDescription('');
    setItemPrice('');
    setItemImage('');
    setItemDialog(true);
  };

  const handleEditItem = (categoryId: string, item: MenuItem) => {
    setCurrentCategory(categoryId);
    setEditingItem(item);
    setItemName(item.name);
    setItemDescription(item.description || '');
    setItemPrice(item.price || '');
    setItemImage(item.image || '');
    setItemDialog(true);
  };

  const handleSaveItem = () => {
    if (!currentCategory) return;
    const newItem: MenuItem = {
      id: editingItem?.id || `item-${Date.now()}`,
      name: itemName,
      description: itemDescription,
      price: itemPrice,
      image: itemImage,
      visible: true,
    };

    setCategories(categories.map(cat => {
      if (cat.id === currentCategory) {
        if (editingItem) {
          return { ...cat, items: cat.items.map(item => item.id === editingItem.id ? newItem : item) };
        } else {
          return { ...cat, items: [...cat.items, newItem] };
        }
      }
      return cat;
    }));
    setItemDialog(false);
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, items: cat.items.filter(item => item.id !== itemId) };
      }
      return cat;
    }));
  };

  const handleSave = async () => {
    const menuData: DigitalMenuData = {
      title,
      description,
      logo,
      coverImage,
      type,
      categories,
      theme,
      settings,
      published,
    };
    await onSave(menuData);
  };

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      default: return '$';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Editor Panel */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-lg border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab('content')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              activeTab === 'content' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"
            )}
          >
            <Layout size={16} /> Content
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              activeTab === 'design' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"
            )}
          >
            <Palette size={16} /> Design
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              activeTab === 'settings' ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"
            )}
          >
            <Settings size={16} /> Settings
          </button>
        </div>

        <Card variant="glass" className="p-6 space-y-6">
          {activeTab === 'content' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Menu Type</Label>
                  <Select value={type} onValueChange={(val: any) => setType(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="menu">Restaurant Menu</SelectItem>
                      <SelectItem value="gallery">Image Gallery</SelectItem>
                      <SelectItem value="portfolio">Portfolio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Awesome Place" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tagline or short bio..." rows={2} className="resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border border-white/10">
                      <AvatarImage src={logo} />
                      <AvatarFallback>LG</AvatarFallback>
                    </Avatar>
                    <Label htmlFor="logo-upload" className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-md text-sm transition-colors">
                      Upload Logo
                      <input id="logo-upload" type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-12 rounded bg-cover bg-center border border-white/10" style={{ backgroundImage: coverImage ? `url(${coverImage})` : 'none', backgroundColor: '#333' }}></div>
                    <Label htmlFor="cover-upload" className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-md text-sm transition-colors">
                      Upload Cover
                      <input id="cover-upload" type="file" hidden accept="image/*" onChange={handleCoverUpload} />
                    </Label>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase size={18} className="text-primary" /> {type === 'menu' ? 'Menu Categories' : 'Collections'}
                  </h3>
                  <Button variant="outline" size="sm" onClick={handleAddCategory}>
                    <Plus size={14} className="mr-2" /> Add {type === 'menu' ? 'Category' : 'Collection'}
                  </Button>
                </div>

                {categories.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-white/20 rounded-lg bg-white/5">
                    <p className="text-sm text-muted-foreground">No categories added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div key={category.id} className="border border-white/10 rounded-lg bg-white/5 overflow-hidden">
                        <div className="flex items-center justify-between p-3 bg-white/5 border-b border-white/10">
                          <h4 className="font-medium px-2">{category.name}</h4>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => handleEditCategory(category)}>
                              <Edit2 size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400 hover:bg-red-500/10" onClick={(e) => handleDeleteCategory(category.id, e)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 space-y-2">
                          {category.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 rounded bg-black/20 hover:bg-black/30 transition-colors group">
                              {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium truncate">{item.name}</p>
                                  {item.price && <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{getCurrencySymbol(settings.currency)}{item.price}</span>}
                                </div>
                                {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditItem(category.id, item)}><Edit2 size={12} /></Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-red-400" onClick={() => handleDeleteItem(category.id, item.id)}><Trash2 size={12} /></Button>
                              </div>
                            </div>
                          ))}
                          <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-white mt-2 border border-dashed border-white/10" onClick={() => handleAddItem(category.id)}>
                            <Plus size={14} className="mr-2" /> Add Item
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'design' && (
            <ThemeEditor theme={theme} onChange={setTheme} />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings size={18} className="text-primary" /> Configuration
              </h3>

              {type === 'menu' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={settings.currency} onValueChange={(val) => setSettings({ ...settings, currency: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Prices</Label>
                    <Switch checked={settings.showPrices} onCheckedChange={(c) => setSettings({ ...settings, showPrices: c })} />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label>Show Item Images</Label>
                <Switch checked={settings.showImages} onCheckedChange={(c) => setSettings({ ...settings, showImages: c })} />
              </div>
            </div>
          )}
        </Card>

        {/* Action Bar */}
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-md p-4 rounded-lg border border-white/10 sticky bottom-4 z-10">
          <div className="flex items-center gap-3">
            <Switch checked={published} onCheckedChange={setPublished} id="publish-switch" />
            <Label htmlFor="publish-switch" className={published ? "text-emerald-400 font-medium" : "text-muted-foreground"}>
              {published ? "Published" : "Draft Mode"}
            </Label>
          </div>

          <Button variant="glow" onClick={handleSave} disabled={!title || categories.length === 0} size="lg">
            <Save size={16} className="mr-2" /> Save {type === 'menu' ? 'Menu' : 'Gallery'}
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <PhonePreview theme={theme} className="lg:col-span-5">
        {coverImage && (
          <div className="w-full h-32 bg-cover bg-center" style={{ backgroundImage: `url(${coverImage})` }}></div>
        )}

        <div className="px-5 py-6">
          <div className="flex items-center gap-3 mb-6">
            {logo && <img src={logo} className="w-14 h-14 rounded-full border-2 border-white/10 shadow-lg object-cover" />}
            <div>
              <h2 className="text-xl font-bold" style={{ color: theme.primaryColor }}>{title || 'Menu Title'}</h2>
              {description && <p className="text-xs opacity-70 mt-1 line-clamp-2" style={{ color: theme.textColor }}>{description}</p>}
            </div>
          </div>

          <div className="space-y-6">
            {categories.length === 0 && (
              <div className="text-center py-10 opacity-30">
                <p style={{ color: theme.textColor }}>Menu is empty</p>
              </div>
            )}
            {categories.map((category) => (
              <div key={category.id}>
                <h3 className="text-lg font-bold border-b pb-1 mb-3" style={{ borderColor: theme.primaryColor, color: theme.textColor }}>
                  {category.name}
                </h3>
                <div className="space-y-3">
                  {category.items.filter(i => i.visible).map(item => (
                    <div key={item.id} className="flex gap-3">
                      {settings.showImages && item.image && (
                        <img src={item.image} className="w-16 h-16 rounded-md object-cover bg-white/5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-medium text-sm" style={{ color: theme.textColor }}>{item.name}</h4>
                          {settings.showPrices && item.price && (
                            <span className="text-sm font-bold" style={{ color: theme.primaryColor }}>{getCurrencySymbol(settings.currency)}{item.price}</span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs opacity-60 mt-0.5 line-clamp-2" style={{ color: theme.textColor }}>{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PhonePreview>

      {/* Dialogs */}
      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle></DialogHeader>
          <div className="py-4 space-y-2">
            <Label>Name</Label>
            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Starters" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCategoryDialog(false)}>Cancel</Button>
            <Button variant="glow" onClick={handleSaveCategory} disabled={!categoryName}>{editingCategory ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={itemDialog} onOpenChange={setItemDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Burger" />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder="12.99" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <Input type="file" accept="image/*" onChange={handleItemImageUpload} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setItemDialog(false)}>Cancel</Button>
            <Button variant="glow" onClick={handleSaveItem} disabled={!itemName}>{editingItem ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
