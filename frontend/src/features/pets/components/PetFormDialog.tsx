import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  FormControlLabel,
  Switch,
  Autocomplete,
} from '@mui/material';
import type { Pet, CreatePetInput, UpdatePetInput, Species } from '../types';
import { validatePet } from '../utils/validation';
import { SPECIES_CONFIG, BREEDS_BY_SPECIES } from '../utils/petHelpers';
import { ownerService } from '../../owners/services';
import type { Owner } from '../../owners/types';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface PetFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePetInput | UpdatePetInput) => void;
  pet?: Pet | null; // null = create mode
}

/* ------------------------------------------------------------------ */
/*  Default form state                                                 */
/* ------------------------------------------------------------------ */

const getDefaultForm = (pet?: Pet | null) => ({
  ownerId: pet?.ownerId ?? '',
  name: pet?.name ?? '',
  species: (pet?.species ?? 'dog') as Species,
  breed: pet?.breed ?? '',
  color: pet?.color ?? '',
  dateOfBirth: pet?.dateOfBirth ?? '',
  sex: (pet?.sex ?? 'male') as 'male' | 'female',
  isNeutered: pet?.isNeutered ?? false,
  microchipId: pet?.microchipId ?? '',
  weightKg: pet?.weightKg ?? ('' as any),
  notes: pet?.notes ?? '',
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PetFormDialog({ open, onClose, onSubmit, pet }: PetFormDialogProps) {
  const isEdit = Boolean(pet);
  const [form, setForm] = useState(getDefaultForm(pet));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [owners, setOwners] = useState<Owner[]>([]);

  // Load owners for the dropdown
  useEffect(() => {
    if (open) {
      ownerService.list({ pageSize: 100, isActive: true }).then((result) => {
        setOwners(result.data);
      });
    }
  }, [open]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setForm(getDefaultForm(pet));
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open, pet]);

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSpeciesChange = (species: Species) => {
    setForm((prev) => ({
      ...prev,
      species,
      breed: '', // Reset breed when species changes
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      weightKg: form.weightKg === '' ? undefined : Number(form.weightKg),
      microchipId: form.microchipId || undefined,
    };

    const validation = validatePet(payload);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit) {
        const changedFields: UpdatePetInput = {};
        const defaults = getDefaultForm(pet);
        for (const key of Object.keys(payload) as (keyof typeof payload)[]) {
          if (String(payload[key]) !== String(defaults[key])) {
            (changedFields as any)[key] = payload[key];
          }
        }
        await onSubmit(changedFields);
      } else {
        await onSubmit(payload as CreatePetInput);
      }
      onClose();
    } catch {
      // Error is handled by the parent hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const breedOptions = useMemo(() => BREEDS_BY_SPECIES[form.species] ?? [], [form.species]);

  const speciesOptions = (Object.entries(SPECIES_CONFIG) as [Species, typeof SPECIES_CONFIG[Species]][]).map(
    ([value, config]) => ({ value, label: `${config.icon} ${config.label}` }),
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '20px', color: '#08060d' }}>
        {isEdit ? `Edit ${pet?.name}` : 'Create New Pet'}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            mt: 1,
          }}
        >
          {/* Owner selector */}
          <Autocomplete
            value={owners.find((o) => o.id === form.ownerId) ?? null}
            onChange={(_, newValue) => {
              setForm((prev) => ({ ...prev, ownerId: newValue?.id ?? '' }));
              if (errors.ownerId) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.ownerId;
                  return next;
                });
              }
            }}
            options={owners}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Owner *"
                error={!!errors.ownerId}
                helperText={errors.ownerId}
                required
              />
            )}
            size="small"
            disableClearable
            fullWidth
            sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
          />

          {/* Name */}
          <TextField
            label="Pet Name *"
            value={form.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />

          {/* Species */}
          <TextField
            label="Species *"
            value={form.species}
            onChange={(e) => handleSpeciesChange(e.target.value as Species)}
            error={!!errors.species}
            helperText={errors.species}
            fullWidth
            required
            select
          >
            {speciesOptions.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Breed */}
          <TextField
            label="Breed *"
            value={form.breed}
            onChange={handleChange('breed')}
            error={!!errors.breed}
            helperText={errors.breed}
            fullWidth
            required
            select
          >
            {breedOptions.map((b) => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </TextField>

          {/* Color */}
          <TextField
            label="Color *"
            value={form.color}
            onChange={handleChange('color')}
            error={!!errors.color}
            helperText={errors.color}
            fullWidth
            required
          />

          {/* Date of Birth */}
          <TextField
            label="Date of Birth *"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange('dateOfBirth')}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />

          {/* Sex */}
          <TextField
            label="Sex *"
            value={form.sex}
            onChange={handleChange('sex')}
            error={!!errors.sex}
            helperText={errors.sex}
            fullWidth
            required
            select
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>

          {/* Microchip ID */}
          <TextField
            label="Microchip ID"
            value={form.microchipId}
            onChange={handleChange('microchipId')}
            error={!!errors.microchipId}
            helperText={errors.microchipId || '10–15 alphanumeric characters'}
            fullWidth
          />

          {/* Weight */}
          <TextField
            label="Weight (kg)"
            type="number"
            value={form.weightKg}
            onChange={handleChange('weightKg')}
            error={!!errors.weightKg}
            helperText={errors.weightKg}
            fullWidth
            slotProps={{ htmlInput: { min: 0.1, max: 200, step: 0.1 } }}
          />

          {/* Neutered — full width */}
          <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isNeutered}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isNeutered: e.target.checked }))
                  }
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#aa3bff' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#aa3bff',
                    },
                  }}
                />
              }
              label="Neutered / Spayed"
            />
          </Box>

          {/* Notes — full width */}
          <TextField
            label="Notes"
            value={form.notes}
            onChange={handleChange('notes')}
            error={!!errors.notes}
            helperText={errors.notes}
            fullWidth
            multiline
            rows={3}
            sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Pet' : 'Create Pet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}