import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, login, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  /* Redirect to the page the user was trying to access, or /users */
  const from = (location.state as { from?: string })?.from ?? '/users';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
      // error is already in state.error via AuthContext
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #aa3bff 0%, #7a1fa3 50%, #08060d 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo + Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #aa3bff 0%, #7a1fa3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                mx: 'auto',
                mb: 1.5,
              }}
            >
              🐾
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#08060d' }}>
              PetCare
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b6375', mt: 0.5 }}>
              Sign in to your account
            </Typography>
          </Box>

          {/* Error Alert */}
          {state.error && (
            <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
              {state.error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              autoFocus
              autoComplete="email"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#6b6375', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              autoComplete="current-password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#6b6375', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 1 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  size="small"
                  sx={{ '&.Mui-checked': { color: '#aa3bff' } }}
                />
              }
              label={<Typography variant="body2" sx={{ color: '#6b6375' }}>Remember me</Typography>}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={state.isSubmitting}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #aa3bff 0%, #7a1fa3 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #9a2bef 0%, #6a0f93 100%)',
                },
              }}
            >
              {state.isSubmitting ? 'Signing in…' : 'Sign In'}
            </Button>
          </Box>

          {/* Hint for demo users */}
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ color: '#6b6375', fontWeight: 600, display: 'block', mb: 0.5 }}>
              Demo Credentials
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b6375', display: 'block' }}>
              admin@petcare.com / admin123
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b6375', display: 'block' }}>
              vet@petcare.com / vet123
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b6375', display: 'block' }}>
              reception@petcare.com / reception123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}