import { Box, Typography, Chip } from '@mui/material';
import type { Pet } from '../types';
import { getSpeciesIcon, formatAge } from '../utils/petHelpers';

/* ------------------------------------------------------------------ */
/*  PetProfileHeader — Hero section for the Pet Profile page          */
/* ------------------------------------------------------------------ */

interface PetProfileHeaderProps {
  pet: Pet;
}

export function PetProfileHeader({ pet }: PetProfileHeaderProps) {
  const speciesIcon = getSpeciesIcon(pet.species);
  const ageLabel = formatAge(pet.dateOfBirth);

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        flexWrap: 'wrap',
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: '#f0e6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 44,
          flexShrink: 0,
        }}
      >
        {speciesIcon}
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 200 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#08060d', fontSize: '28px' }}>
            {pet.name}
          </Typography>
          <Chip
            label={pet.isActive ? 'Active' : 'Inactive'}
            size="small"
            color={pet.isActive ? 'success' : 'default'}
            variant={pet.isActive ? 'filled' : 'outlined'}
            sx={{ height: 24, fontSize: '12px' }}
          />
        </Box>

        <Typography variant="body1" sx={{ color: '#6b6375', mb: 1 }}>
          {pet.breed} · {pet.sex === 'male' ? 'Male' : 'Female'}
          {pet.isNeutered ? ' · Neutered' : ''}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#6b6375', fontWeight: 500, textTransform: 'uppercase', fontSize: '11px' }}>
              Date of Birth
            </Typography>
            <Typography variant="body2" sx={{ color: '#08060d', fontWeight: 500 }}>
              {pet.dateOfBirth}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#6b6375', fontWeight: 500, textTransform: 'uppercase', fontSize: '11px' }}>
              Age
            </Typography>
            <Typography variant="body2" sx={{ color: '#08060d', fontWeight: 500 }}>
              {ageLabel}
            </Typography>
          </Box>
          {pet.weightKg && (
            <Box>
              <Typography variant="caption" sx={{ color: '#6b6375', fontWeight: 500, textTransform: 'uppercase', fontSize: '11px' }}>
                Weight
              </Typography>
              <Typography variant="body2" sx={{ color: '#08060d', fontWeight: 500 }}>
                {pet.weightKg} kg
              </Typography>
            </Box>
          )}
          {pet.microchipId && (
            <Box>
              <Typography variant="caption" sx={{ color: '#6b6375', fontWeight: 500, textTransform: 'uppercase', fontSize: '11px' }}>
                Microchip
              </Typography>
              <Typography variant="body2" sx={{ color: '#08060d', fontWeight: 500 }}>
                {pet.microchipId}
              </Typography>
            </Box>
          )}
          <Box>
            <Typography variant="caption" sx={{ color: '#6b6375', fontWeight: 500, textTransform: 'uppercase', fontSize: '11px' }}>
              Color
            </Typography>
            <Typography variant="body2" sx={{ color: '#08060d', fontWeight: 500 }}>
              {pet.color}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}