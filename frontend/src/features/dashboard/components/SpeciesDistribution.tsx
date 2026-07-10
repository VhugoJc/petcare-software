import { Box, Typography } from '@mui/material';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import type { SpeciesDistribution } from '../types';

interface SpeciesDistributionProps {
  data: SpeciesDistribution[];
  total: number;
}

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Dogs',
  cat: 'Cats',
  bird: 'Birds',
  rabbit: 'Rabbits',
  other: 'Other',
};

const SPECIES_COLORS: Record<string, string> = {
  dog: '#aa3bff',
  cat: '#1976d2',
  bird: '#2e7d32',
  rabbit: '#ed6c02',
  other: '#6b6375',
};

export function SpeciesDistributionWidget({ data, total }: SpeciesDistributionProps) {
  if (data.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: '#6b6375', py: 2, textAlign: 'center' }}>
        No species data available.
      </Typography>
    );
  }

  return (
    <Box>
      {data.map((item) => (
        <ProgressBar
          key={item.species}
          label={SPECIES_LABELS[item.species] ?? item.species}
          value={item.count}
          max={total}
          color={SPECIES_COLORS[item.species] ?? '#6b6375'}
        />
      ))}
    </Box>
  );
}