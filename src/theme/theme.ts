// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const settoTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#091215',
      paper: '#112327',
    },
    primary: {
      main: '#00D8A7',
      light: '#33E0B9',
      dark: '#00B388',
      contrastText: '#061012',
    },
    secondary: {
      main: '#2DD4BF',
      contrastText: '#061012',
    },
    error: {
      main: '#FF4D6D',
      light: '#FF758F',
      dark: '#D90429',
    },
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#F59E0B',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#8BA6AB',
      disabled: '#3D555A',
    },
    divider: '#1C373C',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'sans-serif',
    ].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 20px',
          boxShadow: '0 4px 16px rgba(0, 216, 167, 0.2)',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0, 216, 167, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#112327',
          border: '1px solid #1C373C',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#172E33',
          borderRadius: '12px',
          '& fieldset': {
            borderColor: '#1C373C',
          },
          '&:hover fieldset': {
            borderColor: '#254B52',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#00D8A7',
          },
        },
      },
    },
  },
});

export type SettoTheme = typeof settoTheme;