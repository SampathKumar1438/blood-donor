import { useState } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Alert, 
  Fade, 
  Avatar,
  Divider,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Check if we have a redirect destination
  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setLoginError(null);
      
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box 
      className="py-12 bg-gray-50 min-h-screen flex items-center" 
      sx={{
        background: 'linear-gradient(to right bottom, #f7fafc, #edf2f7)',
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          className="p-6 sm:p-8 flex flex-col items-center"
          sx={{ 
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <Box 
            className="w-full mb-8 -mt-8 -mx-8 py-12 px-8 text-center"
            sx={{
              bgcolor: 'primary.main',
              borderRadius: '0 0 30% 30%',
              boxShadow: '0 4px 12px rgba(229, 62, 62, 0.3)',
            }}
          >
            <Avatar sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              width: 72, 
              height: 72, 
              mx: 'auto',
              mb: 2,
              boxShadow: '0 4px 12px rgba(255,255,255,0.3)',
            }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            
            <Typography variant="h4" component="h1" className="font-bold text-white">
              Welcome Back
            </Typography>
            
            <Typography variant="body1" className="text-white opacity-90 mt-1">
              Sign in to your account
            </Typography>
          </Box>
          
          {loginError && (
            <Fade in={true}>
              <Alert 
                severity="error" 
                className="mb-4 w-full" 
                onClose={() => setLoginError(null)}
                sx={{ borderRadius: '8px' }}
              >
                {loginError}
              </Alert>
            </Fade>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    className: "rounded-md",
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    className: "rounded-md",
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...register('password', { 
                    required: 'Password is required'
                  })}
                />
              </Grid>
              
              <Grid item xs={12} className="mt-4">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={isSubmitting}
                  className="py-3 rounded-md shadow-md hover:shadow-lg transition-all"
                  sx={{
                    textTransform: 'none',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    py: 1.5,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(229, 62, 62, 0.25)',
                  }}
                >
                  {isSubmitting ? (
                    <LoadingSpinner size={24} color="inherit" className="mr-2" />
                  ) : 'Sign In'}
                </Button>
              </Grid>
            </Grid>
          </form>
          
          <Box className="mt-6 text-center w-full">
            <Typography variant="body2" color="textSecondary" className="mb-2">
              <Link to="/forgot-password" className="text-gray-600 hover:text-gray-800">
                Forgot password?
              </Link>
            </Typography>
          </Box>
          
          <Divider className="my-4 w-full">
            <Typography variant="body2" color="textSecondary">
              OR
            </Typography>
          </Divider>
          
          <Box className="mt-2 text-center">
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-600 hover:text-red-800 font-medium">
                Register Now
              </Link>
            </Typography>
          </Box>
          
          <Box className="mt-6 text-center w-full">
            <Typography variant="body2" color="textSecondary">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-gray-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-gray-700">
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
