import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e53e3e', // Blood red as primary color
      light: '#f56565',
      dark: '#c53030',
      contrastText: '#fff'
    },
    secondary: {
      main: '#4a5568', // Dark gray
      light: '#718096',
      dark: '#2d3748',
      contrastText: '#fff'
    },
    background: {
      default: '#f7fafc',
      paper: '#ffffff'
    },
    error: {
      main: '#f03a5f'
    },
    success: {
      main: '#48bb78'
    },
    info: {
      main: '#4299e1'
    },
    warning: {
      main: '#ed8936'
    }
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    subtitle1: {
      letterSpacing: '0.01em',
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.6,
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
          },
        },
        containedPrimary: {
          backgroundColor: '#e53e3e',
          '&:hover': {
            backgroundColor: '#c53030',
          },
        },
        outlinedPrimary: {
          borderColor: '#e53e3e',
          color: '#e53e3e',
          '&:hover': {
            borderColor: '#c53030',
            backgroundColor: 'rgba(229, 62, 62, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
          overflow: 'visible',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'all 0.2s',
            '&:hover fieldset': {
              borderColor: '#e53e3e',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#e53e3e',
              borderWidth: '2px',
            },
            '& fieldset': {
              transition: 'border-color 0.2s',
            }
          },
          '& .MuiFormLabel-root.Mui-focused': {
            color: '#e53e3e',
          },
          '& .MuiInputBase-root': {
            overflow: 'hidden',
          }
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
        elevation1: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
        elevation2: {
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        }
      }
    }
  },
});

export default theme;
