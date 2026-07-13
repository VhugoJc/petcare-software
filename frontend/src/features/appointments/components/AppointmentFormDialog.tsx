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
  Autocomplete,
} from '@mui/material';
import type { Appointment, CreateAppointmentInput, UpdateAppointmentInput, AppointmentType } from '../types';
import { validateAppointment } from '../utils/validation';
import { TYPE_LABELS, generateTimeSlots, getTodayISO } from '../utils/appointmentHelpers';
import { ownerService } from '../../owners/services';
import { petService } from '../../pets/services';
import type { Owner } from '../../owners/types';
import type { Pet } from '../../pets/types';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface AppointmentFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAppointmentInput | UpdateAppointmentInput) => void;
  appointment?: Appointment | null;
}

/* ------------------------------------------------------------------ */
/*  Default form state                                                 */
/* ------------------------------------------------------------------ */

const getDefaultForm = (appointment?: Appointment | null) => ({
  ownerId: appointment?.ownerId ?? '',
  petId: appointment?.petId ?? '',
  date: appointment?.date ?? getTodayISO(),
  startTime: appointment?.startTime ?? '09:00',
  endTime: appointment?.endTime ?? '09:30',
  reason: appointment?.reason ?? '',
  type: (appointment?.type ?? 'consultation') as AppointmentType,
  notes: appointment?.notes ?? '',
});

const TIME_SLOTS = generateTimeSlots(15);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AppointmentFormDialog({ open, onClose, onSubmit, appointment }: AppointmentFormDialogProps) {
  const isEdit = Boolean(appointment);
  const [form, setForm] = useState(getDefaultForm(appointment));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  // Load owners
  useEffect(() => {
    if (open) {
      ownerService.list({ pageSize: 100, isActive: true }).then((result) => {
        setOwners(result.data);
      });
    }
  }, [open]);

  // Load pets when owner changes
  useEffect(() => {
    if (form.ownerId) {
      petService.list({ ownerId: form.ownerId, pageSize: 100 }).then((result) => {
        setPets(result.data);
      });
    } else {
      setPets([]);
    }
  }, [form.ownerId]);

  // Set initial owner/pet when editing
  useEffect(() => {
    if (open && appointment) {
      const owner = owners.find((o) => o.id === appointment.ownerId) ?? null;
      setSelectedOwner(owner);
      const pet = pets.find((p) => p.id === appointment.petId) ?? null;
      setSelectedPet(pet);
    }
  }, [open, appointment, owners, pets]);

  // Reset form on open
  useEffect(() => {
    if (open) {
      setForm(getDefaultForm(appointment));
      setErrors({});
      setIsSubmitting(false);
      if (!appointment) {
        setSelectedOwner(null);
        setSelectedPet(null);
      }
    }
  }, [open, appointment]);

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleOwnerChange = (owner: Owner | null) => {
    setSelectedOwner(owner);
    setSelectedPet(null);
    setForm((prev) => ({ ...prev, ownerId: owner?.id ?? '', petId: '' }));
    if (errors.ownerId) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.ownerId;
        return next;
      });
    }
  };

  const handlePetChange = (pet: Pet | null) => {
    setSelectedPet(pet);
    setForm((prev) => ({ ...prev, petId: pet?.id ?? '' }));
    if (errors.petId) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.petId;
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    const validation = validateAppointment(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit) {
        const changedFields: UpdateAppointmentInput = {};
        const defaults = getDefaultForm(appointment);
        for (const key of Object.keys(form) as (keyof typeof form)[]) {
          if (String(form[key]) !== String(defaults[key])) {
            (changedFields as any)[key] = form[key];
          }
        }
        await onSubmit(changedFields);
      } else {
        await onSubmit(form as CreateAppointmentInput);
      }
      onClose();
    } catch {
      // Error handled by parent hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = (Object.entries(TYPE_LABELS) as [AppointmentType, string][]).map(
    ([value, label]) => ({ value, label }),
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '20px', color: '#08060d' }}>
        {isEdit ? `Edit Appointment #${appointment?.appointmentNumber}` : 'Create New Appointment'}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
          {/* Owner selector */}
          <Autocomplete
            value={selectedOwner}
            onChange={(_, newValue) => handleOwnerChange(newValue)}
            options={owners}
            getOptionLabel={(o) => `${o.firstName} ${o.lastName} (${o.email})`}
            renderInput={(params) => (
              <TextField {...params} label="Owner *" error={!!errors.ownerId} helperText={errors.ownerId} required />
            )}
            size="small"
            disableClearable
            fullWidth
            sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
          />

          {/* Pet selector */}
          <Autocomplete
            value={selectedPet}
            onChange={(_, newValue) => handlePetChange(newValue)}
            options={pets}
            getOptionLabel={(p) => `${p.name} (${p.breed})`}
            renderInput={(params) => (
              <TextField {...params} label="Pet *" error={!!errors.petId} helperText={errors.petId} required />
            )}
            size="small"
            disableClearable
            fullWidth
            disabled={!form.ownerId}
            sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
          />

          {/* Date */}
          <TextField
            label="Date *"
            type="date"
            value={form.date}
            onChange={handleChange('date')}
            error={!!errors.date}
            helperText={errors.date}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />

          {/* Start time */}
          <TextField
            label="Start Time *"
            value={form.startTime}
            onChange={handleChange('startTime')}
            error={!!errors.startTime}
            helperText={errors.startTime}
            fullWidth
            required
            select
          >
            {TIME_SLOTS.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>

          {/* End time */}
          <TextField
            label="End Time *"
            value={form.endTime}
            onChange={handleChange('endTime')}
            error={!!errors.endTime}
            helperText={errors.endTime}
            fullWidth
            required
            select
          >
            {TIME_SLOTS.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>

          {/* Type */}
          <TextField
            label="Appointment Type *"
            value={form.type}
            onChange={handleChange('type')}
            error={!!errors.type}
            helperText={errors.type}
            fullWidth
            required
            select
          >
            {typeOptions.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </TextField>

          {/* Reason — full width */}
          <TextField
            label="Reason for Visit *"
            value={form.reason}
            onChange={handleChange('reason')}
            error={!!errors.reason}
            helperText={errors.reason}
            fullWidth
            required
            multiline
            rows={2}
            sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
          />

          {/* Notes — full width */}
          <TextField
            label="Notes"
            value={form.notes}
            onChange={handleChange('notes')}
            error={!!errors.notes}
            helperText={errors.notes}
            fullWidth
            multiline
            rows={2}
            sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Appointment' : 'Create Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}