import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#aa3bff',
      light: '#d9a8ff',
      dark: '#7a1fa3',
    },
    secondary: {
      main: '#08060d',
      light: '#6b6375',
      dark: '#02010b',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#08060d',
      secondary: '#6b6375',
    },
    divider: '#e5e4e7',
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", sans-serif',
    h1: {
      fontSize: '32px',
      fontWeight: 600,
      color: '#08060d',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 600,
      color: '#08060d',
    },
    body1: {
      fontSize: '14px',
      color: '#6b6375',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '8px',
          padding: '10px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

export default theme;
