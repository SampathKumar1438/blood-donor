import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Avatar, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  IconButton
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { bloodGroups } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser, updateProfile: updateAuthProfile, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [donorFormOpen, setDonorFormOpen] = useState(false);

  // Determine if we're viewing our own profile or someone else's
  const isOwnProfile = !id || id === authUser?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (isOwnProfile) {
          // Get own profile from API
          const response = await authService.getProfile();
          let userData = response.data;
          
          // Format the data to match our UI needs
          const profileData = {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            city: userData.city,
            isDonor: !!userData.donor,
            donationHistory: []  // We'll add this API endpoint later
          };
          
          // Add donor info if available
          if (userData.donor) {
            profileData.bloodGroup = userData.donor.bloodGroup;
            profileData.lastDonationDate = userData.donor.lastDonationDate;
            profileData.canDonateNow = userData.donor.availableForDonation;
            profileData.consentToContact = userData.donor.consentToContact;
          }
          
          setProfile(profileData);
          setFormData(profileData);
        } else {
          // Mock data for viewing others' profiles - in production, call an API endpoint
          // This would be something like donorService.getDonorById(id)
          const mockUser = {
            id: id,
            firstName: 'John',
            lastName: 'Doe',
            city: 'New York',
            isDonor: true,
            bloodGroup: 'A+',
            lastDonationDate: '2025-05-10',
            canDonateNow: true,
            donationHistory: [
              { date: '2025-05-10', location: 'Central Hospital', units: 1 },
              { date: '2024-11-15', location: 'Red Cross Drive', units: 1 },
            ]
          };
          setProfile(mockUser);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if the user is authenticated
    if (authUser) {
      fetchProfile();
    } else {
      navigate('/login', { state: { from: { pathname: `/profile/${id || ''}` } } });
    }
  }, [id, authUser, isOwnProfile, navigate]);

  if (loading) {
    return (
      <Box className="py-12 text-center">
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box className="py-12 text-center">
        <Typography variant="h6" color="error">Profile not found</Typography>
      </Box>
    );
  }
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Format data for API
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        city: formData.city
      };
      
      // If user is or wants to become a donor
      if (profile.isDonor || formData.isDonor) {
        updateData.isDonor = true;
        updateData.bloodGroup = formData.bloodGroup;
        updateData.lastDonationDate = formData.lastDonationDate;
        updateData.availableForDonation = formData.canDonateNow;
        updateData.consentToContact = formData.consentToContact;
      }
      
      // Call API to update profile
      await updateAuthProfile(updateData);
      
      // Update local state
      setProfile({...profile, ...formData});
      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle donor form actions
  const handleOpenDonorForm = () => {
    setDonorFormOpen(true);
  };
  
  const handleCloseDonorForm = () => {
    setDonorFormOpen(false);
  };
  
  const handleDonorStatusUpdate = async (becomeADonor = true) => {
    try {
      setLoading(true);
      
      // Update donor status in form data
      const newFormData = {
        ...formData,
        isDonor: becomeADonor
      };
      
      // If becoming a donor, ensure we have the required fields
      if (becomeADonor) {
        newFormData.bloodGroup = formData.bloodGroup || 'A+';
        newFormData.canDonateNow = formData.canDonateNow || false;
        newFormData.consentToContact = formData.consentToContact || false;
      }
      
      setFormData(newFormData);
      
      // Close the donor form if it's open
      setDonorFormOpen(false);
      
      // If in edit mode, just update the form
      // Otherwise, save changes directly
      if (!editMode) {
        await handleProfileUpdate();
      }
    } catch (err) {
      setError("Failed to update donor status");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box className="py-8 md:py-12 bg-gray-50 min-h-screen">
      <Container maxWidth="md">
        {/* Notifications */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={5000}
          onClose={() => setSuccessMessage(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSuccessMessage(null)} 
            severity="success" 
            sx={{ width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        {error && (
          <Alert 
            severity="error" 
            className="mb-4" 
            onClose={() => setError(null)}
            sx={{ borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          >
            {error}
          </Alert>
        )}        {loading && !profile ? (
          <Box className="py-12 flex justify-center items-center flex-col">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body1" className="mt-4 text-gray-600">
              Loading profile information...
            </Typography>
          </Box>
        ) : profile ? (
          <>
            <Card 
              elevation={3} 
              className="mb-8 overflow-hidden"
              sx={{ 
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
              }}
            >
              <CardContent className={`p-6 md:p-8 ${editMode ? 'pb-4' : 'pb-6'}`}>                <Box className="flex flex-col md:flex-row items-center">
                  <Box className="relative">
                    <Avatar 
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        bgcolor: '#e53e3e',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        boxShadow: '0 8px 16px rgba(229, 62, 62, 0.25)',
                        border: '4px solid white'
                      }}
                      className="mb-4 md:mb-0 md:mr-8"
                    >
                      {profile.firstName[0]}{profile.lastName[0]}
                    </Avatar>
                    {profile.isDonor && (
                      <Box 
                        sx={{
                          position: 'absolute',
                          bottom: '0.5rem',
                          right: '0.5rem',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          width: '2rem',
                          height: '2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid #e53e3e',
                          fontWeight: 'bold',
                          color: '#e53e3e',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                          fontSize: '0.875rem',
                          md: { bottom: '0.5rem', right: '1rem' }
                        }}
                      >
                        {profile.bloodGroup}
                      </Box>
                    )}
                  </Box>
                  
                  <Box className="flex-1 text-center md:text-left">
                    {editMode ? (
                      <Grid container spacing={2} className="mb-4">
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            variant="outlined"
                            size="small"
                            value={formData.firstName || ''}
                            onChange={handleInputChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            variant="outlined"
                            size="small"
                            value={formData.lastName || ''}
                            onChange={handleInputChange}
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      <Typography variant="h4" className="mb-2 font-bold text-center md:text-left">
                        {profile.firstName} {profile.lastName}
                      </Typography>
                    )}
                    
                    {profile.isDonor && (
                      <Box className="flex items-center justify-center md:justify-start mb-2">
                        <Typography 
                          variant="body2" 
                          component="span" 
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            profile.canDonateNow 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                          sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
                        >
                          {profile.canDonateNow ? 'Available to Donate' : 'Not Available'}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Edit button for own profile */}
                  {isOwnProfile && !editMode && (
                    <IconButton 
                      color="primary" 
                      onClick={() => setEditMode(true)}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Box className="mt-2">
                  <Grid container spacing={3}>
                    {editMode ? (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            variant="outlined"
                            size="small"
                            value={formData.email || ''}
                            disabled
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone"
                            name="phoneNumber"
                            variant="outlined"
                            size="small"
                            value={formData.phoneNumber || ''}
                            onChange={handleInputChange}
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="City"
                            name="city"
                            variant="outlined"
                            size="small"
                            value={formData.city || ''}
                            onChange={handleInputChange}
                          />
                        </Grid>
                        
                        {formData.isDonor && (
                          <>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                select
                                fullWidth
                                label="Blood Group"
                                name="bloodGroup"
                                variant="outlined"
                                size="small"
                                value={formData.bloodGroup || ''}
                                onChange={handleInputChange}
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
                                label="Last Donation Date"
                                name="lastDonationDate"
                                type="date"
                                variant="outlined"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                value={formData.lastDonationDate || ''}
                                onChange={handleInputChange}
                              />
                            </Grid>
                            
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.canDonateNow || false}
                                    onChange={handleInputChange}
                                    name="canDonateNow"
                                    color="primary"
                                  />
                                }
                                label="Available to donate now"
                              />
                            </Grid>
                            
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.consentToContact || false}
                                    onChange={handleInputChange}
                                    name="consentToContact"
                                    color="primary"
                                  />
                                }
                                label="Consent to be contacted by those in need"
                              />
                            </Grid>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {isOwnProfile && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" className="text-gray-600">
                              Email
                            </Typography>
                            <Typography variant="body1" className="font-medium">
                              {profile.email}
                            </Typography>
                          </Grid>
                        )}
                        
                        {isOwnProfile && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" className="text-gray-600">
                              Phone
                            </Typography>
                            <Typography variant="body1" className="font-medium">
                              {profile.phoneNumber}
                            </Typography>
                          </Grid>
                        )}
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" className="text-gray-600">
                            Location
                          </Typography>
                          <Typography variant="body1" className="font-medium">
                            {profile.city}
                          </Typography>
                        </Grid>
                        
                        {profile.isDonor && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" className="text-gray-600">
                              Last Donation
                            </Typography>
                            <Typography variant="body1" className="font-medium">
                              {profile.lastDonationDate || 'Not recorded'}
                            </Typography>
                          </Grid>
                        )}

                        {profile.isDonor && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" className="text-gray-600">
                              Availability Status
                            </Typography>
                            <Typography 
                              variant="body1" 
                              className={`font-medium ${profile.canDonateNow ? 'text-green-600' : 'text-gray-600'}`}
                            >
                              {profile.canDonateNow ? 'Available to donate' : 'Not available at present'}
                            </Typography>
                          </Grid>
                        )}
                      </>
                    )}
                  </Grid>
                </Box>
                  <Box className="mt-8 flex flex-wrap gap-3 justify-center md:justify-end">
                  {editMode ? (
                    <>
                      <Button 
                        variant="outlined"
                        onClick={() => {
                          setFormData({...profile});
                          setEditMode(false);
                        }}
                        startIcon={<CloseIcon />}
                        sx={{ borderRadius: '8px', px: 3 }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleProfileUpdate}
                        startIcon={<SaveIcon />}
                        disabled={loading}
                        sx={{ 
                          borderRadius: '8px', 
                          px: 3, 
                          boxShadow: '0 4px 12px rgba(229, 62, 62, 0.25)'
                        }}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  ) : isOwnProfile && (
                    <>
                      {profile.isDonor ? (
                        <Button 
                          variant="outlined" 
                          color="primary"
                          onClick={handleOpenDonorForm}
                          sx={{ 
                            borderRadius: '8px', 
                            px: 3, 
                            borderColor: '#e53e3e', 
                            color: '#e53e3e',
                            '&:hover': {
                              backgroundColor: 'rgba(229, 62, 62, 0.04)',
                              borderColor: '#c53030'
                            }
                          }}
                        >
                          Update Donor Status
                        </Button>
                      ) : (
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={handleOpenDonorForm}
                          sx={{ 
                            borderRadius: '8px', 
                            px: 3,
                            backgroundColor: '#e53e3e',
                            '&:hover': {
                              backgroundColor: '#c53030'
                            },
                            boxShadow: '0 4px 12px rgba(229, 62, 62, 0.25)'
                          }}
                        >
                          Become a Donor
                        </Button>
                      )}
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
              {/* Donor Form Dialog */}
            <Dialog 
              open={donorFormOpen} 
              onClose={handleCloseDonorForm} 
              maxWidth="sm" 
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: '16px',
                  overflow: 'hidden'
                }
              }}
            >
              <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', pb: 2 }}>
                {profile.isDonor ? 'Update Donor Status' : 'Register as a Blood Donor'}
                <IconButton
                  aria-label="close"
                  onClick={handleCloseDonorForm}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'white'
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                {profile.isDonor ? (
                  <Box className="py-2">
                    <Typography variant="body1" gutterBottom>
                      You are currently registered as a blood donor. What would you like to do?
                    </Typography>
                    
                    <Box className="mt-4">
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => {
                          setEditMode(true);
                          handleCloseDonorForm();
                        }}
                        className="mb-3"
                      >
                        Update My Donor Information
                      </Button>
                      
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => handleDonorStatusUpdate(false)}
                        startIcon={<DeleteIcon />}
                      >
                        Remove Me As A Donor
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box className="py-2">
                    <Typography variant="body1" gutterBottom>
                      Register as a blood donor and help save lives in your community!
                    </Typography>
                    
                    <Grid container spacing={3} className="mt-1">
                      <Grid item xs={12}>
                        <TextField
                          select
                          fullWidth
                          label="Blood Group"
                          name="bloodGroup"
                          variant="outlined"
                          value={formData.bloodGroup || ''}
                          onChange={handleInputChange}
                          required
                        >
                          {bloodGroups.map((group) => (
                            <MenuItem key={group} value={group}>
                              {group}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Last Donation Date (Optional)"
                          name="lastDonationDate"
                          type="date"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          value={formData.lastDonationDate || ''}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.canDonateNow || false}
                              onChange={handleInputChange}
                              name="canDonateNow"
                              color="primary"
                            />
                          }
                          label="I am available to donate blood now"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.consentToContact || false}
                              onChange={handleInputChange}
                              name="consentToContact"
                              color="primary"
                              required
                            />
                          }
                          label="I agree to be contacted by those in need of blood donation"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDonorForm} color="inherit">
                  Cancel
                </Button>
                {!profile.isDonor && (
                  <Button 
                    onClick={() => handleDonorStatusUpdate(true)} 
                    variant="contained" 
                    color="primary"
                    disabled={!formData.bloodGroup}
                  >
                    Register as Donor
                  </Button>
                )}
              </DialogActions>
            </Dialog>
              {/* Donation History Card */}
            {profile.isDonor && profile.donationHistory && profile.donationHistory.length > 0 && (
              <Card 
                elevation={3}
                sx={{ 
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                }}
              >
                <CardContent className="p-6 md:p-8">
                  <Box className="flex items-center mb-4">
                    <Typography variant="h5" component="h2" className="font-semibold">
                      Donation History
                    </Typography>
                    <Box 
                      className="ml-3 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800"
                      sx={{ display: 'inline-flex' }}
                    >
                      {profile.donationHistory.length} Donations
                    </Box>
                  </Box>
                  
                  <Box>
                    {profile.donationHistory.map((donation, index) => (
                      <Box 
                        key={index}
                        className={`py-3 ${
                          index < profile.donationHistory.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2" className="text-gray-600">
                              Date
                            </Typography>
                            <Typography variant="body1" className="font-medium">
                              {donation.date}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={5}>
                            <Typography variant="body2" className="text-gray-600">
                              Location
                            </Typography>
                            <Typography variant="body1" className="font-medium">
                              {donation.location}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={3}>
                            <Typography variant="body2" className="text-gray-600">
                              Units
                            </Typography>
                            <Typography variant="body1" className="font-medium">
                              {donation.units}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Box>
                    {isOwnProfile && (
                    <Box className="mt-6 text-center">
                      <Button 
                        variant="outlined" 
                        color="primary"
                        sx={{ 
                          borderRadius: '8px', 
                          px: 3,
                          py: 1,
                          borderColor: '#e53e3e', 
                          color: '#e53e3e',
                          '&:hover': {
                            backgroundColor: 'rgba(229, 62, 62, 0.04)',
                            borderColor: '#c53030'
                          }
                        }}
                      >
                        Record New Donation
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Box className="py-8 text-center">
            <Typography variant="h6" color="error">Profile not found</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Profile;