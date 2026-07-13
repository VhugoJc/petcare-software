import { Box, TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { OwnerFilters as OwnerFiltersType } from '../types';

/* ------------------------------------------------------------------ */
/*  OwnerFilters                                                       */
/* ------------------------------------------------------------------ */

interface OwnerFiltersProps {
  filters: OwnerFiltersType;
  onFiltersChange: (filters: OwnerFiltersType) => void;
}

export function OwnerFilters({ filters, onFiltersChange }: OwnerFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      isActive: value === 'all' ? undefined : value === 'active',
    });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({ sortBy: value as OwnerFiltersType['sortBy'] });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
        alignItems: 'center',
      }}
    >
      {/* Search */}
      <TextField
        placeholder="Search by name, email, or phone..."
        value={filters.search ?? ''}
        onChange={(e) => handleSearchChange(e.target.value)}
        size="small"
        sx={{ flex: { xs: '1 1 100%', sm: '1 1 240px' }, minWidth: 200 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#6b6375', fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Status filter */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="status-filter-label">Status</InputLabel>
        <Select
          labelId="status-filter-label"
          value={
            filters.isActive === undefined
              ? 'all'
              : filters.isActive
                ? 'active'
                : 'inactive'
          }
          label="Status"
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      {/* Sort by */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="sort-by-label">Sort by</InputLabel>
        <Select
          labelId="sort-by-label"
          value={filters.sortBy ?? 'lastName'}
          label="Sort by"
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <MenuItem value="lastName">Last Name</MenuItem>
          <MenuItem value="firstName">First Name</MenuItem>
          <MenuItem value="createdAt">Date Added</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}