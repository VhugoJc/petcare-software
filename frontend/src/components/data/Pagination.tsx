import { Box, Typography, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from '@mui/icons-material';

/* ------------------------------------------------------------------ */
/*  Pagination — Standalone pagination control                        */
/* ------------------------------------------------------------------ */

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  disabled?: boolean;
}

export function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
  disabled = false,
}: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        px: 2,
        py: 1.5,
        borderTop: '1px solid #e5e4e7',
        backgroundColor: '#ffffff',
        borderRadius: '0 0 8px 8px',
      }}
    >
      {/* Left: rows per page + info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#6b6375', whiteSpace: 'nowrap' }}>
            Rows:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 64 }}>
            <Select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              disabled={disabled}
              sx={{ fontSize: '13px', borderRadius: '6px', '& .MuiSelect-select': { py: 0.5 } }}
            >
              {pageSizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Typography variant="body2" sx={{ color: '#6b6375', whiteSpace: 'nowrap' }}>
          {from}–{to} of {total}
        </Typography>
      </Box>

      {/* Right: page navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          onClick={() => onPageChange(1)}
          disabled={disabled || page <= 1}
          sx={{ color: '#6b6375' }}
        >
          <FirstPage fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page <= 1}
          sx={{ color: '#6b6375' }}
        >
          <ChevronLeft fontSize="small" />
        </IconButton>

        <Typography variant="body2" sx={{ color: '#08060d', fontWeight: 500, px: 1, minWidth: 60, textAlign: 'center' }}>
          Page {page} of {totalPages}
        </Typography>

        <IconButton
          size="small"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= totalPages}
          sx={{ color: '#6b6375' }}
        >
          <ChevronRight fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onPageChange(totalPages)}
          disabled={disabled || page >= totalPages}
          sx={{ color: '#6b6375' }}
        >
          <LastPage fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}