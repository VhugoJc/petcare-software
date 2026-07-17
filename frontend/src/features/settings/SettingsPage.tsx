import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { API_ENDPOINTS } from '../../config/api';
import { tokenStorage } from '../auth/utils/tokenStorage';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Settings {
  clinicInfo: {
    clinicName: string;
    phoneNumber: string;
    email: string;
    website?: string;
    address?: string;
    logoUrl?: string;
  };
  businessHours: {
    openingTime: string;
    closingTime: string;
    workingDays: string[];
  };
  appointmentSettings: {
    defaultDuration: number;
    appointmentInterval: number;
    allowOverlapping: boolean;
  };
  userPreferences: {
    language: string;
    timeZone: string;
    dateFormat: string;
  };
}

const ALL_DAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
];

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern (US)' },
  { value: 'America/Chicago', label: 'Central (US)' },
  { value: 'America/Denver', label: 'Mountain (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific (US)' },
];

const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getAuthHeaders() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = tokenStorage.getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#08060d' }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

/* ------------------------------------------------------------------ */
/*  SettingsPage                                                       */
/* ------------------------------------------------------------------ */

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.settings.get, { headers: getAuthHeaders() });
      const body = await res.json();
      if (body.success) {
        setSettings(body.data);
      } else {
        setError(body.error?.message || 'Failed to load settings');
      }
    } catch {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(API_ENDPOINTS.settings.update, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      });
      const body = await res.json();
      if (body.success) {
        setSettings(body.data);
        setSuccess('Settings saved successfully');
      } else {
        setError(body.error?.message || 'Failed to save settings');
      }
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (group: string, field: string, value: any) => {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [group]: { ...(prev as any)[group], [field]: value },
      };
    });
  };

  const toggleDay = (day: string) => {
    if (!settings) return;
    const days = settings.businessHours.workingDays;
    const updated = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    updateField('businessHours', 'workingDays', updated);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error">{error || 'Unable to load settings'}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h1">Settings</Typography>
          <Typography variant="body1" sx={{ mt: 0.5, color: '#6b6375' }}>
            Manage your clinic configuration
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Clinic Information */}
      <Section title="🏥 Clinic Information">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Clinic Name"
              value={settings.clinicInfo.clinicName}
              onChange={(e) => updateField('clinicInfo', 'clinicName', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Phone Number"
              value={settings.clinicInfo.phoneNumber}
              onChange={(e) => updateField('clinicInfo', 'phoneNumber', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Email"
              value={settings.clinicInfo.email}
              onChange={(e) => updateField('clinicInfo', 'email', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Website"
              value={settings.clinicInfo.website || ''}
              onChange={(e) => updateField('clinicInfo', 'website', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Address"
              value={settings.clinicInfo.address || ''}
              onChange={(e) => updateField('clinicInfo', 'address', e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Logo URL"
              value={settings.clinicInfo.logoUrl || ''}
              onChange={(e) => updateField('clinicInfo', 'logoUrl', e.target.value)}
              fullWidth
              placeholder="https://example.com/logo.png"
            />
          </Grid>
        </Grid>
      </Section>

      {/* Business Hours */}
      <Section title="🕐 Business Hours">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Opening Time"
              type="time"
              value={settings.businessHours.openingTime}
              onChange={(e) => updateField('businessHours', 'openingTime', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Closing Time"
              type="time"
              value={settings.businessHours.closingTime}
              onChange={(e) => updateField('businessHours', 'closingTime', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#6b6375', fontWeight: 500 }}>
              Working Days
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {ALL_DAYS.map((day) => (
                <Chip
                  key={day.value}
                  label={day.label}
                  color={settings.businessHours.workingDays.includes(day.value) ? 'primary' : 'default'}
                  variant={settings.businessHours.workingDays.includes(day.value) ? 'filled' : 'outlined'}
                  onClick={() => toggleDay(day.value)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Section>

      {/* Appointment Settings */}
      <Section title="📅 Appointment Settings">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Default Duration (min)"
              type="number"
              value={settings.appointmentSettings.defaultDuration}
              onChange={(e) => updateField('appointmentSettings', 'defaultDuration', parseInt(e.target.value) || 30)}
              fullWidth
              slotProps={{ htmlInput: { min: 15, max: 240 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Appointment Interval (min)"
              type="number"
              value={settings.appointmentSettings.appointmentInterval}
              onChange={(e) => updateField('appointmentSettings', 'appointmentInterval', parseInt(e.target.value) || 30)}
              fullWidth
              slotProps={{ htmlInput: { min: 5, max: 120 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.appointmentSettings.allowOverlapping}
                  onChange={(e) => updateField('appointmentSettings', 'allowOverlapping', e.target.checked)}
                />
              }
              label="Allow Overlapping Appointments"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      </Section>

      {/* User Preferences */}
      <Section title="⚙️ User Preferences">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Language"
              value={settings.userPreferences.language}
              onChange={(e) => updateField('userPreferences', 'language', e.target.value)}
              fullWidth
              select
            >
              {LANGUAGES.map((l) => (
                <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Time Zone"
              value={settings.userPreferences.timeZone}
              onChange={(e) => updateField('userPreferences', 'timeZone', e.target.value)}
              fullWidth
              select
            >
              {TIMEZONES.map((tz) => (
                <MenuItem key={tz.value} value={tz.value}>{tz.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Date Format"
              value={settings.userPreferences.dateFormat}
              onChange={(e) => updateField('userPreferences', 'dateFormat', e.target.value)}
              fullWidth
              select
            >
              {DATE_FORMATS.map((df) => (
                <MenuItem key={df.value} value={df.value}>{df.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Section>

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}