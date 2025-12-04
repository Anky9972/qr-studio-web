import { Box, Chip, FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment } from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';

interface TemplateFilterProps {
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
  categories: string[];
}

export default function TemplateFilter({
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  categories
}: TemplateFilterProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        mb: 4
      }}
    >
      {/* Search */}
      <TextField
        placeholder="Search templates..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flex: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
      />

      {/* Category Filter */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          label="Category"
          onChange={(e) => onCategoryChange(e.target.value)}
          startAdornment={<FilterList sx={{ ml: 1, mr: -0.5 }} />}
        >
          <MenuItem value="all">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
