import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  DataTable — Column & Sort                                         */
/* ------------------------------------------------------------------ */

export interface Column<T> {
  /** Key to access the field value. Can be a dotted path or virtual key */
  field: keyof T | string;
  /** Column header text */
  headerName: string;
  /** Enable column sorting (default: true) */
  sortable?: boolean;
  /** CSS width (e.g. '120px', '20%') */
  width?: string | number;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Custom cell renderer. Receives the row data */
  render?: (row: T) => ReactNode;
  /**
   * Extract a string value for sorting when `render` is custom.
   * Ignored if `render` is not provided (falls back to row[field]).
   */
  valueGetter?: (row: T) => string | number;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

/* ------------------------------------------------------------------ */
/*  Row Actions                                                        */
/* ------------------------------------------------------------------ */

export interface Action<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  color?: 'primary' | 'error' | 'warning' | 'default';
  /** Disable this action for specific rows */
  disabled?: (row: T) => boolean;
  /** Show a visual divider before this action */
  divider?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Filters                                                            */
/* ------------------------------------------------------------------ */

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  /** Label for the "All" option (default: "All") */
  allLabel?: string;
}

/* ------------------------------------------------------------------ */
/*  Toolbar                                                            */
/* ------------------------------------------------------------------ */

export interface ToolbarAction {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'error' | 'warning' | 'inherit';
}

export interface BulkAction {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: (selectedKeys: Set<string | number>) => void;
  color?: 'primary' | 'error' | 'warning' | 'inherit';
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

export interface EmptyStateConfig {
  icon?: ReactNode;
  title: string;
  description?: string;
}