import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import type { Owner, CreateOwnerInput, UpdateOwnerInput, PreferredContactMethod } from '../types';
import { validateOwner } from '../utils/validation';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CONTACT_METHODS: { value: PreferredContactMethod; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' },
  { value: 'mail', label: 'Mail' },
];

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface OwnerFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOwnerInput | UpdateOwnerInput) => void;
  owner?: Owner | null; // null = create mode
}

/* ------------------------------------------------------------------ */
/*  Default form state                                                 */
/* ------------------------------------------------------------------ */

const getDefaultForm = (owner?: Owner | null) => ({
  firstName: owner?.firstName ?? '',
  lastName: owner?.lastName ?? '',
  email: owner?.email ?? '',
  phoneNumber: owner?.phoneNumber ?? '',
  emergencyContact: owner?.emergencyContact ?? '',
  address: owner?.address ?? '',
  city: owner?.city ?? '',
  state: owner?.state ?? '',
  country: owner?.country ?? '',
  postalCode: owner?.postalCode ?? '',
  preferredContactMethod: (owner?.preferredContactMethod ?? 'email') as PreferredContactMethod,
  notes: owner?.notes ?? '',
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function OwnerFormDialog({ open, onClose, onSubmit, owner }: OwnerFormDialogProps) {
  const isEdit = Boolean(owner);
  const [form, setForm] = useState(getDefaultForm(owner));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens or owner changes
  useEffect(() => {
    if (open) {
      setForm(getDefaultForm(owner));
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open, owner]);

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    const validation = validateOwner(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit) {
        // Only send changed fields for update
        const payload: UpdateOwnerInput = {};
        for (const key of Object.keys(form) as (keyof typeof form)[]) {
          if (form[key] !== getDefaultForm(owner)[key]) {
            (payload as any)[key] = form[key];
          }
        }
        await onSubmit(payload);
      } else {
        await onSubmit(form as CreateOwnerInput);
      }
      onClose();
    } catch {
      // Error handling is done by the parent hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '20px', color: '#08060d' }}>
        {isEdit ? 'Edit Owner' : 'Create New Owner'}
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
          {/* First Name */}
          <TextField
            label="First Name *"
            value={form.firstName}
            onChange={handleChange('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName}
            fullWidth
            required
          />

          {/* Last Name */}
          <TextField
            label="Last Name *"
            value={form.lastName}
            onChange={handleChange('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName}
            fullWidth
            required
          />

          {/* Email */}
          <TextField
            label="Email *"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            required
          />

          {/* Phone Number */}
          <TextField
            label="Phone Number *"
            value={form.phoneNumber}
            onChange={handleChange('phoneNumber')}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            fullWidth
            required
          />

          {/* Emergency Contact */}
          <TextField
            label="Emergency Contact"
            value={form.emergencyContact}
            onChange={handleChange('emergencyContact')}
            error={!!errors.emergencyContact}
            helperText={errors.emergencyContact}
            fullWidth
          />

          {/* Preferred Contact Method */}
          <TextField
            label="Preferred Contact Method *"
            value={form.preferredContactMethod}
            onChange={handleChange('preferredContactMethod')}
            error={!!errors.preferredContactMethod}
            helperText={errors.preferredContactMethod}
            fullWidth
            required
            select
          >
            {CONTACT_METHODS.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Address — full width */}
          <TextField
            label="Address"
            value={form.address}
            onChange={handleChange('address')}
            error={!!errors.address}
            helperText={errors.address}
            fullWidth
            sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
          />

          {/* City */}
          <TextField
            label="City"
            value={form.city}
            onChange={handleChange('city')}
            error={!!errors.city}
            helperText={errors.city}
            fullWidth
          />

          {/* State */}
          <TextField
            label="State"
            value={form.state}
            onChange={handleChange('state')}
            error={!!errors.state}
            helperText={errors.state}
            fullWidth
          />

          {/* Country */}
          <TextField
            label="Country"
            value={form.country}
            onChange={handleChange('country')}
            error={!!errors.country}
            helperText={errors.country}
            fullWidth
          />

          {/* Postal Code */}
          <TextField
            label="Postal Code"
            value={form.postalCode}
            onChange={handleChange('postalCode')}
            error={!!errors.postalCode}
            helperText={errors.postalCode}
            fullWidth
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
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Owner' : 'Create Owner'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}