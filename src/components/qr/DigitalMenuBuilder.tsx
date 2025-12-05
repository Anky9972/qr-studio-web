'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Upload,
  DragIndicator,
  Restaurant,
  Image as ImageIcon,
  Palette,
  Visibility,
} from '@mui/icons-material';

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
  theme: {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
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

const defaultTheme = {
  primaryColor: '#6366f1',
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, sans-serif',
};

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
  const [type, setType] = useState<'menu' | 'gallery' | 'portfolio'>(
    data?.type || 'menu'
  );
  const [categories, setCategories] = useState<MenuCategory[]>(
    data?.categories || []
  );
  const [theme, setTheme] = useState(data?.theme || defaultTheme);
  const [settings, setSettings] = useState(data?.settings || defaultSettings);
  const [published, setPublished] = useState(data?.published || false);

  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null
  );
  const [categoryName, setCategoryName] = useState('');

  const [itemDialog, setItemDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState('');

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemImage(reader.result as string);
      };
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
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name: categoryName } : cat
        )
      );
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

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
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

    setCategories(
      categories.map((cat) => {
        if (cat.id === currentCategory) {
          if (editingItem) {
            return {
              ...cat,
              items: cat.items.map((item) =>
                item.id === editingItem.id ? newItem : item
              ),
            };
          } else {
            return {
              ...cat,
              items: [...cat.items, newItem],
            };
          }
        }
        return cat;
      })
    );
    setItemDialog(false);
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: cat.items.filter((item) => item.id !== itemId),
          };
        }
        return cat;
      })
    );
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

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left Panel - Editor */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Digital Menu/Gallery Builder
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                Create a digital menu for restaurants, gallery for artists, or
                portfolio for showcasing work.
              </Alert>

              {/* Type Selection */}
              <TextField
                select
                fullWidth
                label="Type"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as 'menu' | 'gallery' | 'portfolio')
                }
                sx={{ mb: 3 }}
              >
                <MenuItem value="menu">Restaurant Menu</MenuItem>
                <MenuItem value="gallery">Image Gallery</MenuItem>
                <MenuItem value="portfolio">Portfolio</MenuItem>
              </TextField>

              {/* Logo & Cover */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Branding
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box>
                      {logo && (
                        <Avatar
                          src={logo}
                          variant="rounded"
                          sx={{ width: 80, height: 80, mb: 1 }}
                        />
                      )}
                      <Button
                        variant="outlined"
                        component="label"
                        size="small"
                        fullWidth
                      >
                        Upload Logo
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      {coverImage && (
                        <Box
                          sx={{
                            width: '100%',
                            height: 80,
                            backgroundImage: `url(${coverImage})`,
                            backgroundSize: 'cover',
                            borderRadius: 1,
                            mb: 1,
                          }}
                        />
                      )}
                      <Button
                        variant="outlined"
                        component="label"
                        size="small"
                        fullWidth
                      >
                        Upload Cover
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleCoverUpload}
                        />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Basic Info */}
              <TextField
                fullWidth
                required
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  type === 'menu'
                    ? 'Restaurant Name'
                    : type === 'gallery'
                    ? 'Gallery Title'
                    : 'Portfolio Name'
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short description"
                multiline
                rows={2}
                sx={{ mb: 3 }}
              />

              <Divider sx={{ my: 3 }} />

              {/* Categories & Items */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">
                    {type === 'menu' ? 'Categories' : 'Collections'}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    onClick={handleAddCategory}
                  >
                    Add Category
                  </Button>
                </Box>

                {categories.length === 0 ? (
                  <Alert severity="warning">
                    No categories yet. Add your first category to get started.
                  </Alert>
                ) : (
                  categories.map((category) => (
                    <Card key={category.id} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Typography variant="h6">{category.name}</Typography>
                          <Box>
                            <IconButton
                              size="small"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteCategory(category.id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>

                        <Button
                          size="small"
                          startIcon={<Add />}
                          onClick={() => handleAddItem(category.id)}
                          sx={{ mb: 2 }}
                        >
                          Add {type === 'menu' ? 'Item' : 'Image'}
                        </Button>

                        <List dense>
                          {category.items.map((item) => (
                            <ListItem key={item.id} divider>
                              {item.image && (
                                <Avatar
                                  src={item.image}
                                  variant="rounded"
                                  sx={{ mr: 2 }}
                                />
                              )}
                              <ListItemText
                                primary={item.name}
                                secondary={
                                  <>
                                    {item.description}
                                    {type === 'menu' && item.price && (
                                      <Chip
                                        label={`${settings.currency} ${item.price}`}
                                        size="small"
                                        sx={{ ml: 1 }}
                                      />
                                    )}
                                  </>
                                }
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditItem(category.id, item)}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleDeleteItem(category.id, item.id)
                                  }
                                  color="error"
                                >
                                  <Delete />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Settings */}
              <Typography variant="subtitle1" gutterBottom>
                Settings
              </Typography>
              {type === 'menu' && (
                <>
                  <TextField
                    select
                    fullWidth
                    label="Currency"
                    value={settings.currency}
                    onChange={(e) =>
                      setSettings({ ...settings, currency: e.target.value })
                    }
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                    <MenuItem value="JPY">JPY (¥)</MenuItem>
                  </TextField>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showPrices}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            showPrices: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Show prices"
                  />
                </>
              )}
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showImages}
                    onChange={(e) =>
                      setSettings({ ...settings, showImages: e.target.checked })
                    }
                  />
                }
                label="Show images"
              />

              <Divider sx={{ my: 3 }} />

              {/* Theme */}
              <Typography variant="subtitle1" gutterBottom>
                Theme
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="color"
                    label="Primary Color"
                    value={theme.primaryColor}
                    onChange={(e) =>
                      setTheme({ ...theme, primaryColor: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="color"
                    label="Background Color"
                    value={theme.backgroundColor}
                    onChange={(e) =>
                      setTheme({ ...theme, backgroundColor: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              {/* Actions */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                    />
                  }
                  label="Published"
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {onPreview && (
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={onPreview}
                    >
                      Preview
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!title || categories.length === 0}
                  >
                    Save {type === 'menu' ? 'Menu' : 'Gallery'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Live Preview */}
        <Grid item xs={12} md={5}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <Box
                sx={{
                  backgroundColor: theme.backgroundColor,
                  borderRadius: 2,
                  minHeight: 500,
                  overflow: 'hidden',
                }}
              >
                {/* Cover Image */}
                {coverImage && (
                  <Box
                    sx={{
                      width: '100%',
                      height: 150,
                      backgroundImage: `url(${coverImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}

                <Box sx={{ p: 3 }}>
                  {/* Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    {logo && (
                      <Avatar
                        src={logo}
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      />
                    )}
                    <Box>
                      <Typography variant="h5">{title || 'Title'}</Typography>
                      {description && (
                        <Typography variant="body2" color="text.secondary">
                          {description}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Categories & Items */}
                  {categories.map((category) => (
                    <Box key={category.id} sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{ color: theme.primaryColor, mb: 2 }}
                      >
                        {category.name}
                      </Typography>
                      <Grid container spacing={2}>
                        {category.items
                          .filter((item) => item.visible)
                          .map((item) => (
                            <Grid item xs={12} key={item.id}>
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                {settings.showImages && item.image && (
                                  <Avatar
                                    src={item.image}
                                    variant="rounded"
                                    sx={{ width: 80, height: 80 }}
                                  />
                                )}
                                <Box sx={{ flex: 1 }}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <Typography variant="subtitle1">
                                      {item.name}
                                    </Typography>
                                    {type === 'menu' &&
                                      settings.showPrices &&
                                      item.price && (
                                        <Typography
                                          variant="subtitle1"
                                          sx={{ color: theme.primaryColor }}
                                        >
                                          {settings.currency} {item.price}
                                        </Typography>
                                      )}
                                  </Box>
                                  {item.description && (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {item.description}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                      </Grid>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Dialog */}
      <Dialog
        open={categoryDialog}
        onClose={() => setCategoryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder={
              type === 'menu' ? 'e.g., Appetizers' : 'e.g., Portraits'
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveCategory}
            variant="contained"
            disabled={!categoryName}
          >
            {editingCategory ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Item Dialog */}
      <Dialog
        open={itemDialog}
        onClose={() => setItemDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingItem
            ? `Edit ${type === 'menu' ? 'Item' : 'Image'}`
            : `Add ${type === 'menu' ? 'Item' : 'Image'}`}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              {itemImage && (
                <Avatar
                  src={itemImage}
                  variant="rounded"
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
              )}
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload />}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleItemImageUpload}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label={type === 'menu' ? 'Item Name' : 'Image Title'}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={
                  type === 'menu'
                    ? 'e.g., Caesar Salad'
                    : 'e.g., Sunset Landscape'
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                multiline
                rows={2}
                placeholder="Optional description"
              />
            </Grid>
            {type === 'menu' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Price"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  placeholder="9.99"
                  type="number"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>{settings.currency}</Typography>,
                  }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveItem}
            variant="contained"
            disabled={!itemName}
          >
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
