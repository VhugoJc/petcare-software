import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Divider, Avatar, Menu, MenuItem } from '@mui/material';
import { Dashboard, People, Pets, Settings, Logout, Menu as MenuIcon, ContactPage } from '@mui/icons-material';
import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

const DRAWER_WIDTH = 260;
const MENU_ITEMS = [
  { label: 'Dashboard', icon: <Dashboard />, id: 'dashboard', path: '/dashboard' },
  { label: 'Owners', icon: <ContactPage />, id: 'owners', path: '/owners' },
  { label: 'Pets', icon: <Pets />, id: 'pets', path: '/pets' },
  { label: 'Users', icon: <People />, id: 'users', path: '/users' },
  { label: 'Settings', icon: <Settings />, id: 'settings', path: '/settings' },
];

const DrawerContent = ({ onItemClick }) => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #aa3bff 0%, #7a1fa3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 20 }}>🐾</Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#08060d' }}>PetCare</Typography>
          <Typography variant="caption" sx={{ color: '#6b6375' }}>Veterinary System</Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ flex: 1, pt: 2 }}>
        {MENU_ITEMS.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.id}
              component={NavLink}
              to={item.path}
              onClick={onItemClick}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: '8px',
                textDecoration: 'none',
                '&:hover': { backgroundColor: '#f5f5f5' },
                ...(isActive && {
                  backgroundColor: '#f5f5f5',
                  '& .MuiListItemIcon-root': { color: '#aa3bff' },
                  '& .MuiListItemText-primary': { color: '#aa3bff', fontWeight: 600 },
                }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#6b6375' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} sx={{ '& .MuiTypography-root': { fontSize: '14px', fontWeight: 500 } }} />
            </ListItem>
          );
        })}
      </List>
      <Divider />
    </Box>
  );
};

export const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate('/login', { replace: true });
  };

  const userInitial = state.user?.name?.charAt(0)?.toUpperCase() ?? '👤';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f9f9f9' }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#ffffff', color: '#08060d', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { xs: 'flex', md: 'none' }, cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}><MenuIcon /></Box>
            <Typography variant="h5" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #aa3bff 0%, #7a1fa3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: 1 }}>🐾 PetCare</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#6b6375', display: { xs: 'none', sm: 'block' } }}>
              {state.user?.name}
            </Typography>
            <Avatar onClick={e => setAnchorEl(e.currentTarget)} sx={{ cursor: 'pointer', background: 'linear-gradient(135deg, #aa3bff 0%, #7a1fa3 100%)', width: 36, height: 36, fontSize: '18px' }}>{userInitial}</Avatar>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <MenuItem disabled sx={{ opacity: 1 }}>
                <Typography variant="body2" sx={{ color: '#6b6375' }}>{state.user?.email}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}><Settings sx={{ mr: 1, fontSize: 20 }} />Settings</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}><Logout sx={{ mr: 1, fontSize: 20 }} />Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: '1px solid #e5e4e7', backgroundColor: '#ffffff', marginTop: '64px' }, display: { xs: 'none', md: 'block' } }}>
        <DrawerContent />
      </Drawer>

      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, backgroundColor: '#ffffff', marginTop: '64px' } }}>
        <DrawerContent onItemClick={() => setMobileOpen(false)} />
      </Drawer>

      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowY: 'auto' }}><Outlet /></Box>
        <Box sx={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e4e7', p: 2, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#6b6375' }}>© 2026 PetCare. All rights reserved.</Typography>
        </Box>
      </Box>
    </Box>
  );
};
