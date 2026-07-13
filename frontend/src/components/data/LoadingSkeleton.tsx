import { Box, Skeleton } from '@mui/material';

/* ------------------------------------------------------------------ */
/*  LoadingSkeleton                                                     */
/* ------------------------------------------------------------------ */

interface LoadingSkeletonProps {
  /** Number of skeleton rows (default: 5) */
  rows?: number;
  /** Number of skeleton columns (default: 4) */
  columns?: number;
  /** Layout type */
  type?: 'table' | 'card';
}

export function LoadingSkeleton({
  rows = 5,
  columns = 4,
  type = 'table',
}: LoadingSkeletonProps) {
  if (type === 'card') {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 2,
        }}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <Box
            key={i}
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1.5 }} />
            <Skeleton variant="text" width="60%" sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderRadius: 2,
        bgcolor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Header skeleton */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 2,
          p: 2,
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #e5e4e7',
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`h-${i}`} variant="text" width="70%" />
        ))}
      </Box>

      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <Box
          key={`r-${rowIdx}`}
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 2,
            p: 2,
            borderBottom: rowIdx < rows - 1 ? '1px solid #e5e4e7' : 'none',
          }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={`c-${rowIdx}-${colIdx}`}
              variant="text"
              width={colIdx === 0 ? '85%' : '60%'}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}