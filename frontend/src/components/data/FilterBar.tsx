import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { FilterConfig } from './DataTable.types';

/* ------------------------------------------------------------------ */
/*  FilterBar — Configurable filter dropdowns                         */
/* ------------------------------------------------------------------ */

interface FilterBarProps {
  filters: FilterConfig[];
  values: Record<string, string | undefined>;
  onChange: (key: string, value: string) => void;
  onClear?: (key: string) => void;
}

export function FilterBar({ filters, values, onChange, onClear }: FilterBarProps) {
  if (filters.length === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
      }}
    >
      {filters.map((filter) => {
        const currentValue = values[filter.key] ?? '';

        return (
          <FormControl key={filter.key} size="small" sx={{ minWidth: 150 }}>
            <InputLabel id={`filter-label-${filter.key}`}>{filter.label}</InputLabel>
            <Select
              labelId={`filter-label-${filter.key}`}
              value={currentValue}
              label={filter.label}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  onClear?.(filter.key);
                } else {
                  onChange(filter.key, val);
                }
              }}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="">{filter.allLabel ?? 'All'}</MenuItem>
              {filter.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      })}
    </Box>
  );
}