import { useState } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  TextField, 
  Button, 
  Paper, 
  FormControlLabel, 
  Checkbox, 
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { bloodGroups } from '../utils/constants';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDonor, setIsDonor] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm();

  const steps = ['Account Information', 'Personal Details', isDonor ? 'Donor Information' : 'Confirmation'];

  const handleNext = async () => {
    // Validate the current step before moving forward
    let fieldsToValidate = [];
    
    if (activeStep === 0) {
      fieldsToValidate = ['email', 'password', 'confirmPassword'];
    } else if (activeStep === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'phoneNumber', 'city'];
    }
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Format data to match API expectations
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        city: data.city,
        isDonor: isDonor
      };
      
      // Add donor-specific information if the user is registering as a donor
      if (isDonor) {
        userData.bloodGroup = data.bloodGroup;
        userData.lastDonationDate = data.lastDonationDate || null;
        userData.availableForDonation = data.canDonateNow || false;
        userData.consentToContact = data.termsAccepted || false;
      }
      
      await registerUser(userData);
      navigate('/profile');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                type="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                autoComplete="new-password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => 
                    value === getValues('password') || 
                    'Passwords do not match'
                })}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                autoComplete="given-name"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                {...register('firstName', { 
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters'
                  }
                })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                autoComplete="family-name"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                {...register('lastName', { 
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters'
                  }
                })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                autoComplete="tel"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                {...register('phoneNumber', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                    message: 'Invalid phone number format'
                  }
                })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                variant="outlined"
                autoComplete="address-level2"
                error={!!errors.city}
                helperText={errors.city?.message}
                {...register('city', { 
                  required: 'City is required'
                })}
              />
            </Grid>
            
            <Grid item xs={12} className="mt-4">
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={isDonor} 
                    onChange={(e) => setIsDonor(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body1" className="font-medium">
                    I want to register as a Blood Donor
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        );
      case 2:
        // If user chose to be a donor, show donor information. Otherwise show confirmation
        return isDonor ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Blood Group"
                variant="outlined"
                error={!!errors.bloodGroup}
                helperText={errors.bloodGroup?.message}
                {...register('bloodGroup', { 
                  required: 'Blood group is required'
                })}
              >
                {bloodGroups.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Donation Date (Optional)"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                {...register('lastDonationDate')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    color="primary"
                    {...register('canDonateNow')}
                  />
                }
                label={
                  <Typography variant="body1">
                    I am available to donate blood now
                  </Typography>
                }
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    color="primary"
                    {...register('termsAccepted')}
                    required
                  />
                }
                label={
                  <Typography variant="body1">
                    I agree to be contacted by those in need of blood donation
                  </Typography>
                }
              />
              {errors.termsAccepted && (
                <Typography variant="caption" color="error" display="block">
                  {errors.termsAccepted.message}
                </Typography>
              )}
            </Grid>
          </Grid>
        ) : (
          <Box className="text-center py-4">
            <Typography variant="h6" className="mb-3">
              Ready to Complete Registration
            </Typography>
            <Typography variant="body1" className="text-gray-600 mb-4">
              Please review your information and click Register to create your account.
            </Typography>
          </Box>
        );
      case 3:
        return (
          <Box className="text-center py-4">
            <Typography variant="h6" className="mb-3">
              Ready to Complete Registration
            </Typography>
            <Typography variant="body1" className="text-gray-600 mb-4">
              Please review your donor information and click Register to create your account.
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box className="py-8 bg-gray-50 min-h-screen">
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          className="p-6 md:p-8"
          sx={{ 
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          <Box className="flex flex-col items-center mb-6">
            <Avatar
              sx={{ 
                bgcolor: 'primary.main', 
                width: 64, 
                height: 64, 
                mb: 2,
                boxShadow: '0 4px 12px rgba(229, 62, 62, 0.3)'
              }}
            >
              <PersonAddIcon fontSize="large" />
            </Avatar>
            
            <Typography 
              variant="h4" 
              component="h1" 
              className="text-center font-bold text-gray-800 mb-1"
            >
              Create Your Account
            </Typography>
            
            <Typography 
              variant="body1" 
              className="text-center text-gray-500 max-w-md mx-auto mb-6"
            >
              Join our community and help save lives through blood donation
            </Typography>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              className="mb-4" 
              onClose={() => setError(null)}
              sx={{ borderRadius: '8px' }}
            >
              {error}
            </Alert>
          )}
          
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel={!isMobile}
            orientation={isMobile ? 'vertical' : 'horizontal'}
            className="mb-8"
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider className="mb-6" />
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className="mb-6">
              {getStepContent(activeStep)}
            </Box>

            <Box className="mt-8 flex flex-wrap justify-between">
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ mb: isMobile ? 2 : 0, width: isMobile ? '100%' : 'auto' }}
              >
                Back
              </Button>
              
              <Box className="flex" sx={{ width: isMobile ? '100%' : 'auto' }}>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    className="px-8"
                    fullWidth={isMobile}
                    sx={{
                      py: 1.2,
                      fontSize: '1rem'
                    }}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    endIcon={<ArrowForwardIcon />}
                    className="px-8"
                    fullWidth={isMobile}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
          
          <Box className="mt-6 text-center">
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Link to="/login" className="text-red-600 hover:text-red-800 font-medium">
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
