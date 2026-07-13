import { useState, useEffect, useRef } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

/* ------------------------------------------------------------------ */
/*  SearchBar — Debounced search input                                */
/* ------------------------------------------------------------------ */

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  disabled = false,
  fullWidth = true,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange
  useEffect(() => {
    if (localValue !== value) {
      debounceRef.current = setTimeout(() => {
        onChange(localValue);
      }, debounceMs);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue, debounceMs]);

  return (
    <TextField
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      size="small"
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{ minWidth: 200, maxWidth: fullWidth ? undefined : 320 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#6b6375', fontSize: 20 }} />
          </InputAdornment>
        ),
        sx: { borderRadius: '8px' },
      }}
    />
  );
}