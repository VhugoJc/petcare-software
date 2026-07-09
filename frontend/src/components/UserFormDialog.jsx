import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';

export const UserFormDialog = ({ open, onClose, onSubmit, user = null }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    setForm(user || { name: '', email: '', phone: '' });
  }, [user, open]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ name: '', email: '', phone: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Create New User'}</DialogTitle>
      <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
        <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth />
        <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">{user ? 'Update' : 'Create'}</Button>
      </DialogActions>
    </Dialog>
  );
};
