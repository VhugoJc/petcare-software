import { Box, Typography, Button } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import type { Pet } from '../types';

/* ------------------------------------------------------------------ */
/*  PetOwnerCard — Embedded owner summary on the Pet Profile page     */
/* ------------------------------------------------------------------ */

interface PetOwnerCardProps {
  pet: Pet;
  onViewOwner?: () => void;
}

export function PetOwnerCard({ pet, onViewOwner }: PetOwnerCardProps) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#08060d', mb: 1.5 }}>
        Owner
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Avatar */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '16px',
            flexShrink: 0,
          }}
        >
          {pet.ownerName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#08060d' }}>
            {pet.ownerName}
          </Typography>
        </Box>

        {onViewOwner && (
          <Button
            size="small"
            endIcon={<ChevronRight sx={{ fontSize: 16 }} />}
            onClick={onViewOwner}
            sx={{
              textTransform: 'none',
              color: '#aa3bff',
              fontWeight: 500,
              fontSize: '13px',
              flexShrink: 0,
            }}
          >
            View Owner
          </Button>
        )}
      </Box>
    </Box>
  );
}