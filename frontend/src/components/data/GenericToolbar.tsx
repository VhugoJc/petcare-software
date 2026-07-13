import { Box, Button } from '@mui/material';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { RefreshButton } from './RefreshButton';
import { ExportButton } from './ExportButton';
import type { FilterConfig, ToolbarAction } from './DataTable.types';

/* ------------------------------------------------------------------ */
/*  GenericToolbar — Composes search, filters, and action buttons     */
/* ------------------------------------------------------------------ */

interface GenericToolbarProps {
  /** Search bar configuration */
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
  };
  /** Filter bar configuration */
  filters?: {
    config: FilterConfig[];
    values: Record<string, string | undefined>;
    onChange: (key: string, value: string) => void;
    onClear?: (key: string) => void;
  };
  /** Right-side action buttons */
  actions?: ToolbarAction[];
  /** Refresh button (convenience) */
  refresh?: {
    onClick: () => void;
    isLoading?: boolean;
  };
  /** Export button (convenience) */
  export?: {
    onClick: () => void;
    disabled?: boolean;
  };
  /** Additional content rendered after actions */
  children?: React.ReactNode;
}

export function GenericToolbar({
  search,
  filters,
  actions,
  refresh,
  export: exportAction,
  children,
}: GenericToolbarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        mb: 2,
        alignItems: 'center',
      }}
    >
      {/* Search */}
      {search && (
        <SearchBar
          value={search.value}
          onChange={search.onChange}
          placeholder={search.placeholder}
          debounceMs={search.debounceMs}
        />
      )}

      {/* Filters */}
      {filters && (
        <FilterBar
          filters={filters.config}
          values={filters.values}
          onChange={filters.onChange}
          onClear={filters.onClear}
        />
      )}

      {/* Spacer - pushes actions to the right */}
      <Box sx={{ flex: 1 }} />

      {/* Action buttons */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {refresh && <RefreshButton onClick={refresh.onClick} isLoading={refresh.isLoading} />}
        {exportAction && <ExportButton onClick={exportAction.onClick} disabled={exportAction.disabled} />}
        {actions?.map((action) => (
          <Button
            key={action.id}
            variant={action.variant ?? 'outlined'}
            color={action.color ?? 'inherit'}
            size="small"
            startIcon={action.icon}
            onClick={action.onClick}
            disabled={action.disabled}
            sx={{ textTransform: 'none', fontSize: '13px' }}
          >
            {action.isLoading ? 'Loading...' : action.label}
          </Button>
        ))}
        {children}
      </Box>
    </Box>
  );
}