import { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Checkbox,
  TableSortLabel,
} from '@mui/material';
import { RowActionsMenu } from './RowActionsMenu';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from '../ui/EmptyState';
import type { Column, Action, SortConfig, EmptyStateConfig } from './DataTable.types';

/* ------------------------------------------------------------------ */
/*  DataTable — Generic, reusable data table                          */
/* ------------------------------------------------------------------ */

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyExtractor: (row: T) => string | number;
  /** Row-level actions (rendered as a dropdown menu in the last column) */
  actions?: Action<T>[];
  /** Empty state configuration */
  emptyState?: EmptyStateConfig;
  /* ---- Loading ---- */
  isLoading?: boolean;
  loadingRows?: number;
  /* ---- Sorting ---- */
  sortable?: boolean;
  sortConfig?: SortConfig;
  onSort?: (config: SortConfig) => void;
  /* ---- Row click ---- */
  onRowClick?: (row: T) => void;
  /* ---- Selection ---- */
  selectable?: boolean;
  selectedKeys?: Set<string | number>;
  onSelectionChange?: (keys: Set<string | number>) => void;
  /* ---- Styling ---- */
  stickyHeader?: boolean;
  /** Optional "no results" message when rows exist but a filter yields 0 */
  noResultsMessage?: string;
}

export function DataTable<T>({
  columns,
  rows,
  keyExtractor,
  actions,
  emptyState,
  isLoading = false,
  loadingRows = 5,
  sortable = true,
  sortConfig,
  onSort,
  onRowClick,
  selectable = false,
  selectedKeys: externalSelectedKeys,
  onSelectionChange,
  stickyHeader = false,
  noResultsMessage,
}: DataTableProps<T>) {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Set<string | number>>(new Set());

  const selectedKeys = externalSelectedKeys ?? internalSelectedKeys;

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const newKeys = new Set(checked ? rows.map(keyExtractor) : []);
      if (onSelectionChange) {
        onSelectionChange(newKeys);
      } else {
        setInternalSelectedKeys(newKeys);
      }
    },
    [rows, keyExtractor, onSelectionChange],
  );

  const handleSelectRow = useCallback(
    (key: string | number, checked: boolean) => {
      const newKeys = new Set(selectedKeys);
      if (checked) {
        newKeys.add(key);
      } else {
        newKeys.delete(key);
      }
      if (onSelectionChange) {
        onSelectionChange(newKeys);
      } else {
        setInternalSelectedKeys(newKeys);
      }
    },
    [selectedKeys, onSelectionChange],
  );

  const handleSort = useCallback(
    (field: string) => {
      if (!onSort) return;
      const isAsc = sortConfig?.field === field && sortConfig?.direction === 'asc';
      onSort({ field, direction: isAsc ? 'desc' : 'asc' });
    },
    [onSort, sortConfig],
  );

  const allSelected = rows.length > 0 && rows.every((r) => selectedKeys.has(keyExtractor(r)));
  const someSelected = rows.some((r) => selectedKeys.has(keyExtractor(r)));

  // ---- Loading state ----
  if (isLoading) {
    return <LoadingSkeleton rows={loadingRows} columns={columns.length + (actions ? 1 : 0) + (selectable ? 1 : 0)} />;
  }

  // ---- Empty state ----
  if (rows.length === 0) {
    if (emptyState) {
      return (
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
        />
      );
    }
    return (
      <EmptyState
        title={noResultsMessage ?? 'No data found'}
        description="There are no items to display."
      />
    );
  }

  const hasActions = actions && actions.length > 0;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
      <TableContainer>
        <Table stickyHeader={stickyHeader}>
          {/* ---- Header ---- */}
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              {selectable && (
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }} padding="checkbox">
                  <Checkbox
                    indeterminate={someSelected && !allSelected}
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    size="small"
                    sx={{ color: '#6b6375', '&.Mui-checked': { color: '#aa3bff' } }}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell
                  key={String(col.field)}
                  align={col.align ?? 'left'}
                  sx={{
                    fontWeight: 600,
                    color: '#08060d',
                    backgroundColor: '#f5f5f5',
                    width: col.width,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sortable && col.sortable !== false && onSort ? (
                    <TableSortLabel
                      active={sortConfig?.field === col.field}
                      direction={sortConfig?.field === col.field ? sortConfig?.direction : 'asc'}
                      onClick={() => handleSort(String(col.field))}
                      sx={{ '&.Mui-active': { color: '#aa3bff' } }}
                    >
                      {col.headerName}
                    </TableSortLabel>
                  ) : (
                    col.headerName
                  )}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: '#08060d',
                    backgroundColor: '#f5f5f5',
                    width: 60,
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          {/* ---- Body ---- */}
          <TableBody>
            {rows.map((row) => {
              const key = keyExtractor(row);
              const isSelected = selectedKeys.has(key);

              return (
                <TableRow
                  key={key}
                  hover
                  selected={isSelected}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : undefined,
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    '&.Mui-selected': { backgroundColor: '#f0f0ff' },
                  }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(key, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        size="small"
                        sx={{ color: '#6b6375', '&.Mui-checked': { color: '#aa3bff' } }}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => {
                    const cellValue = col.render
                      ? col.render(row)
                      : (row as any)[col.field] ?? '—';

                    return (
                      <TableCell
                        key={String(col.field)}
                        align={col.align ?? 'left'}
                        sx={{ color: '#08060d', fontSize: '14px' }}
                      >
                        {cellValue}
                      </TableCell>
                    );
                  })}
                  {hasActions && (
                    <TableCell align="right" sx={{ py: 0.5 }}>
                      <RowActionsMenu actions={actions} row={row} />
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}