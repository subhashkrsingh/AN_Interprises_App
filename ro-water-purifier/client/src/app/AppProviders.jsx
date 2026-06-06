import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Provider, useSelector } from 'react-redux';
import { store } from './store.js';

function MuiThemeProvider({ children }) {
  const mode = useSelector((state) => state.ui.mode);

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: '#2563eb' },
      secondary: { main: '#14b8a6' },
      background: {
        default: mode === 'dark' ? '#0f172a' : '#f6f8fb',
        paper: mode === 'dark' ? '#111827' : '#ffffff',
      },
      success: { main: '#16a34a' },
      warning: { main: '#d97706' },
      error: { main: '#dc2626' },
    },
    typography: {
      fontFamily: ['Inter', 'Source Sans 3', 'Arial', 'sans-serif'].join(','),
      h4: { fontWeight: 800, letterSpacing: 0 },
      h5: { fontWeight: 750, letterSpacing: 0 },
      h6: { fontWeight: 700, letterSpacing: 0 },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            border: mode === 'dark' ? '1px solid rgba(148,163,184,.18)' : '1px solid rgba(15,23,42,.08)',
            boxShadow: '0 16px 40px rgba(15,23,42,.08)',
          },
        },
      },
      MuiButton: { defaultProps: { disableElevation: true } },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <MuiThemeProvider>{children}</MuiThemeProvider>
    </Provider>
  );
}
