import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { Pet } from '../types';
import { getSpeciesIcon, formatAge } from '../utils/petHelpers';

/* ------------------------------------------------------------------ */
/*  PetDetailDialog — Quick-view dialog from the pet list              */
/* ------------------------------------------------------------------ */

interface PetDetailDialogProps {
  open: boolean;
  onClose: () => void;
  pet: Pet | null;
  onEdit: (pet: Pet) => void;
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
      <Typography variant="caption" sx={{ color: '#6b6375', fontWeight: 500, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: value ? '#08060d' : '#bdbdbd' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#08060d', mb: 1.5, mt: 1 }}>
      {children}
    </Typography>
  );
}

export function PetDetailDialog({ open, onClose, pet, onEdit }: PetDetailDialogProps) {
  if (!pet) return null;

  const ageLabel = formatAge(pet.dateOfBirth);
  const speciesIcon = getSpeciesIcon(pet.species);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#f0e6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                flexShrink: 0,
              }}
            >
              {speciesIcon}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#08060d' }}>
                {pet.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.25, alignItems: 'center' }}>
                <Chip
                  label={pet.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  color={pet.isActive ? 'success' : 'default'}
                  variant={pet.isActive ? 'filled' : 'outlined'}
                  sx={{ height: 22, fontSize: '11px' }}
                />
                <Typography variant="caption" sx={{ color: '#6b6375' }}>
                  {pet.sex === 'male' ? '♂' : '♀'} · {pet.breed}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        {/* Basic Information */}
        <SectionTitle>Basic Information</SectionTitle>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <DetailRow label="Species" value={pet.species.charAt(0).toUpperCase() + pet.species.slice(1)} />
          <DetailRow label="Breed" value={pet.breed} />
          <DetailRow label="Color" value={pet.color} />
          <DetailRow label="Sex" value={pet.sex === 'male' ? 'Male' : 'Female'} />
          <DetailRow label="Date of Birth" value={pet.dateOfBirth} />
          <DetailRow label="Age" value={ageLabel} />
          <DetailRow label="Neutered/Spayed" value={pet.isNeutered ? 'Yes' : 'No'} />
          <DetailRow label="Weight" value={pet.weightKg ? `${pet.weightKg} kg` : undefined} />
          <DetailRow label="Microchip ID" value={pet.microchipId} />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Owner Information */}
        <SectionTitle>Owner</SectionTitle>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <DetailRow label="Owner Name" value={pet.ownerName} />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Notes */}
        <SectionTitle>Notes</SectionTitle>
        <Typography variant="body2" sx={{ color: pet.notes ? '#08060d' : '#bdbdbd', whiteSpace: 'pre-wrap' }}>
          {pet.notes || 'No notes recorded'}
        </Typography>

        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
          <Typography variant="caption" sx={{ color: '#6b6375' }}>
            Created: {new Date(pet.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b6375' }}>
            Updated: {new Date(pet.updatedAt).toLocaleDateString()}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => {
            onEdit(pet);
            onClose();
          }}
        >
          Edit Pet
        </Button>
      </DialogActions>
    </Dialog>
  );
}