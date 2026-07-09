import { Alert, Box } from '@mui/material';
import { useEffect } from 'react';

export const ErrorAlert = ({ error, onClose }) => {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  if (!error) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="error" onClose={onClose}>
        {error}
      </Alert>
    </Box>
  );
};
