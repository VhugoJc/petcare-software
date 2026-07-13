import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, LinearProgress, Snackbar, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { usePet } from '../hooks/usePet';
import { PetProfileHeader } from './PetProfileHeader';
import { PetOwnerCard } from './PetOwnerCard';
import { PetFormDialog } from './PetFormDialog';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { petService } from '../services';
import type { UpdatePetInput } from '../types';

/* ------------------------------------------------------------------ */
/*  PetProfilePage — Full-page pet profile                            */
/* ------------------------------------------------------------------ */

export function PetProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pet, isLoading, error, refresh } = usePet(id);

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    navigate('/pets');
  }, [navigate]);

  const handleEdit = useCallback(() => {
    setFormDialogOpen(true);
  }, []);

  const handleUpdateSubmit = useCallback(
    async (data: UpdatePetInput) => {
      if (!pet) return;
      try {
        await petService.update(pet.id, data);
        setSuccessMessage('Pet updated successfully');
        setFormDialogOpen(false);
        await refresh();
      } catch {
        // Error is handled by the hook
      }
    },
    [pet, refresh],
  );

  /* ---------- Loading ---------- */

  if (isLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <LinearProgress
          sx={{
            borderRadius: 1,
            '& .MuiLinearProgress-bar': { backgroundColor: '#aa3bff' },
          }}
        />
      </Box>
    );
  }

  /* ---------- Error ---------- */

  if (error || !pet) {
    return (
      <Box sx={{ py: 4 }}>
        <ErrorAlert error={error || 'Pet not found'} onClose={() => {}} />
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2, textTransform: 'none' }}
        >
          Back to Pets
        </Button>
      </Box>
    );
  }

  /* ---------- Render ---------- */

  return (
    <>
      {/* Success snackbar */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Back + actions bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ textTransform: 'none', color: '#6b6375', fontWeight: 500 }}
        >
          Back to Pets
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ textTransform: 'none' }}
          >
            Edit
          </Button>
        </Box>
      </Box>

      {/* Profile header */}
      <PetProfileHeader pet={pet} />

      {/* Details grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
          mt: 2,
        }}
      >
        {/* Owner card */}
        <PetOwnerCard pet={pet} onViewOwner={() => navigate(`/owners`)} />

        {/* Notes card */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#08060d', mb: 1.5 }}>
            Notes
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: pet.notes ? '#08060d' : '#bdbdbd', whiteSpace: 'pre-wrap' }}
          >
            {pet.notes || 'No notes recorded'}
          </Typography>
        </Box>
      </Box>

      {/* Future: Medical History section placeholder */}
      <Box
        sx={{
          mt: 2,
          p: 3,
          borderRadius: 2,
          bgcolor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" sx={{ color: '#6b6375' }}>
          🩺 Medical History — Coming in a future sprint
        </Typography>
      </Box>

      {/* Edit dialog */}
      <PetFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleUpdateSubmit}
        pet={pet}
      />
    </>
  );
}