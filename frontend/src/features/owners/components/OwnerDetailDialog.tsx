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
import type { Owner } from '../types';

/* ------------------------------------------------------------------ */
/*  OwnerDetailDialog                                                  */
/* ------------------------------------------------------------------ */

interface OwnerDetailDialogProps {
  open: boolean;
  onClose: () => void;
  owner: Owner | null;
  onEdit: (owner: Owner) => void;
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

export function OwnerDetailDialog({ open, onClose, owner, onEdit }: OwnerDetailDialogProps) {
  if (!owner) return null;

  const fullName = `${owner.firstName} ${owner.lastName}`;

  const contactMethodLabel = {
    email: 'Email',
    phone: 'Phone',
    sms: 'SMS',
    mail: 'Mail',
  }[owner.preferredContactMethod];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#08060d' }}>
              {fullName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
              <Chip
                label={owner.isActive ? 'Active' : 'Inactive'}
                size="small"
                color={owner.isActive ? 'success' : 'default'}
                variant={owner.isActive ? 'filled' : 'outlined'}
                sx={{ height: 24, fontSize: '12px' }}
              />
              <Typography variant="caption" sx={{ color: '#6b6375' }}>
                Created {new Date(owner.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        {/* Personal Information */}
        <SectionTitle>Personal Information</SectionTitle>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            mb: 2,
          }}
        >
          <DetailRow label="First Name" value={owner.firstName} />
          <DetailRow label="Last Name" value={owner.lastName} />
          <DetailRow label="Email" value={owner.email} />
          <DetailRow label="Phone Number" value={owner.phoneNumber} />
          <DetailRow label="Emergency Contact" value={owner.emergencyContact} />
          <DetailRow label="Preferred Contact" value={contactMethodLabel} />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Address */}
        <SectionTitle>Address</SectionTitle>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            mb: 2,
          }}
        >
          <DetailRow label="Address" value={owner.address} />
          <DetailRow label="City" value={owner.city} />
          <DetailRow label="State" value={owner.state} />
          <DetailRow label="Country" value={owner.country} />
          <DetailRow label="Postal Code" value={owner.postalCode} />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Notes */}
        <SectionTitle>Notes</SectionTitle>
        <Typography variant="body2" sx={{ color: owner.notes ? '#08060d' : '#bdbdbd', whiteSpace: 'pre-wrap' }}>
          {owner.notes || 'No notes recorded'}
        </Typography>

        {/* Audit */}
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
          <Typography variant="caption" sx={{ color: '#6b6375' }}>
            Last updated: {new Date(owner.updatedAt).toLocaleString()}
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
            onEdit(owner);
            onClose();
          }}
        >
          Edit Owner
        </Button>
      </DialogActions>
    </Dialog>
  );
}