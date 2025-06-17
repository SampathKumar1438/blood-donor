import { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  MenuItem, 
  InputAdornment, 
  Alert, 
  Fade,
  Paper,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import DonorCard from '../components/DonorCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { bloodGroups } from '../utils/constants';
import { donorService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useAuth();
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [searchParams, setSearchParams] = useState({
    bloodGroup: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalDonors: 0,
    availableDonors: 0,
    locations: 0
  });

  useEffect(() => {
    // Fetch donors from the API
    const fetchDonors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the enhanced service method with fallbacks
        const donorsData = await donorService.getReliableDonorData();
        setDonors(donorsData);
        setFilteredDonors(donorsData);
        
        // Calculate stats
        const uniqueLocations = new Set(donorsData.map(donor => donor.location));
        setStats({
          totalDonors: donorsData.length,
          availableDonors: donorsData.filter(donor => donor.available).length,
          locations: uniqueLocations.size
        });
      } catch (err) {
        console.error('Error fetching donors:', err);
        setError('Failed to fetch donors. Please try again later.');
        
        // Even here, try to use mock data as a last resort
        const mockDonors = donorService.getMockDonors();
        setDonors(mockDonors);
        setFilteredDonors(mockDonors);
        
        const uniqueLocations = new Set(mockDonors.map(donor => donor.location));
        setStats({
          totalDonors: mockDonors.length,
          availableDonors: mockDonors.filter(donor => donor.available).length,
          locations: uniqueLocations.size
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonors();
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call API with filters, using the enhanced service
      const filteredDonorsData = await donorService.getReliableDonorData({
        bloodGroup: searchParams.bloodGroup,
        location: searchParams.location
      });
      
      setFilteredDonors(filteredDonorsData);
    } catch (err) {
      console.error('Error searching donors:', err);
      setError('Failed to search donors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchParams({
      bloodGroup: '',
      location: '',
    });
    setFilteredDonors(donors);
  };

  return (
    <Box className="pb-12">      {/* Hero Section */}
      <Box 
        className="py-16 md:py-28 px-4" 
        sx={{ 
          background: 'linear-gradient(135deg, #e53e3e 0%, #f56565 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 800, 
                  fontSize: { xs: '2.25rem', sm: '2.5rem', md: '3.5rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  lineHeight: 1.2
                }}
              >
                Give the Gift of Life
              </Typography>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  mb: 4, 
                  maxWidth: { xs: '100%', md: '60%' },
                  fontWeight: 400,
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Connect with blood donors in your area and join our mission to save lives through blood donation.
              </Typography>
              <Box className="flex flex-wrap gap-3" sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  component={Link} 
                  to="/register"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    px: 3,
                    py: 1.2,
                    borderRadius: '8px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    '&:hover': { 
                      bgcolor: 'white', 
                      opacity: 0.9,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                    }
                  }}
                >
                  Register as Donor
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  component={Link}
                  to="/donor-map"
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    px: 3,
                    py: 1.2,
                    borderRadius: '8px',
                    borderWidth: '2px',
                    '&:hover': { 
                      borderColor: 'white', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Find Donors
                </Button>
              </Box>
            </Grid>            <Grid item xs={12} md={5} className="flex justify-center">
              <Box 
                className="relative"
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '320px',
                }}
              >
                <Box
                  className="absolute"
                  sx={{
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    filter: 'blur(1px)',
                  }}
                />
                <Box 
                  className="absolute flex items-center justify-center"
                  sx={{
                    width: '230px',
                    height: '230px',
                    borderRadius: '50%',
                    background: 'white',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  }}
                >
                  <VolunteerActivismIcon 
                    sx={{ 
                      fontSize: '100px', 
                      color: 'primary.main',
                    }} 
                  />
                </Box>
                
                {/* Additional decorative elements */}
                <Box
                  className="absolute"
                  sx={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.3)',
                    top: '20%',
                    left: '20%',
                  }}
                />
                <Box
                  className="absolute"
                  sx={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.3)',
                    bottom: '25%',
                    right: '25%',
                  }}
                />
              </Box>
            </Grid>
          </Grid>        </Container>
        
        {/* Stats Cards */}
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={10}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: '16px',
                  py: { xs: 2, sm: 3 },
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transform: 'translateY(50%)',
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 1
                }}
              >                <Grid container>
                  <Grid item xs={12} sm={4} 
                    sx={{ 
                      textAlign: 'center',
                      py: { xs: 3, sm: 4 },
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        right: { xs: 'auto', sm: 0 },
                        bottom: { xs: 0, sm: '20%' },
                        left: { xs: '20%', sm: 'auto' },
                        width: { xs: '60%', sm: '1px' },
                        height: { xs: '1px', sm: '60%' },
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        display: { xs: 'block', sm: 'block' }
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography 
                        variant="h3" 
                        className="font-bold"
                        sx={{ 
                          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                          color: '#e53e3e',
                          mb: 1
                        }}
                      >
                        {stats.totalDonors}
                      </Typography>
                      <Typography variant="body1" className="text-gray-600 font-medium">
                        Total Donors
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={4} 
                    sx={{ 
                      textAlign: 'center',
                      py: { xs: 3, sm: 4 },
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        right: { xs: 'auto', sm: 0 },
                        bottom: { xs: 0, sm: '20%' },
                        left: { xs: '20%', sm: 'auto' },
                        width: { xs: '60%', sm: '1px' },
                        height: { xs: '1px', sm: '60%' },
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        display: { xs: 'block', sm: 'block' }
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography 
                        variant="h3" 
                        className="font-bold"
                        sx={{ 
                          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                          color: '#e53e3e',
                          mb: 1
                        }}
                      >
                        {stats.availableDonors}
                      </Typography>
                      <Typography variant="body1" className="text-gray-600 font-medium">
                        Available Now
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={4} 
                    sx={{ 
                      textAlign: 'center',
                      py: { xs: 3, sm: 4 }
                    }}
                  >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography 
                        variant="h3" 
                        className="font-bold"
                        sx={{ 
                          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                          color: '#e53e3e',
                          mb: 1
                        }}
                      >
                        {stats.locations}
                      </Typography>
                      <Typography variant="body1" className="text-gray-600 font-medium">
                        Locations
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>      </Box>
      
      <Container maxWidth="lg" className="mt-20 md:mt-28">
        {/* Search Section */}
        <Typography
          variant="h4" 
          component="h2" 
          className="mb-6 font-bold text-gray-800"
          sx={{ textAlign: { xs: 'center', sm: 'left' } }}
        >
          Find Blood Donors Near You
        </Typography>
        
        <Card 
          className="mb-8 md:mb-12" 
          sx={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent className="p-6">            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Blood Group"
                  name="bloodGroup"
                  value={searchParams.bloodGroup}
                  onChange={handleSearchChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalHospitalIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">Any Blood Group</MenuItem>
                  {bloodGroups.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Location / City"
                  name="location"
                  value={searchParams.location}
                  onChange={handleSearchChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter city name"
                />
              </Grid>
                <Grid item xs={12} md={4}>
                <Box className="flex items-center space-x-2">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSearch}
                    fullWidth
                    startIcon={<SearchIcon />}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    Search Donors
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={handleClearFilters}
                    sx={{ minWidth: '80px' }}
                  >
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>        
          {/* Donors List */}
        <Box className="mt-8">
          <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
            <Typography 
              variant="h5" 
              component="h2" 
              className="font-bold text-gray-800"
              sx={{ textAlign: { xs: 'center', sm: 'left' } }}
            >
              Available Donors
            </Typography>
            
            {!loading && (
              <Chip 
                label={`${filteredDonors.length} ${filteredDonors.length === 1 ? 'Donor' : 'Donors'}`} 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 'medium' }} 
              />
            )}
          </Box>

          {error && (
            <Fade in={true}>
              <Alert 
                severity="error" 
                className="mb-4" 
                onClose={() => setError(null)}
                sx={{ borderRadius: '8px' }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {loading ? (
            <Box className="py-16 text-center">
              <LoadingSpinner message="Searching for donors..." size={60} />
            </Box>
          ) : filteredDonors.length > 0 ? (
            <Grid container spacing={3}>
              {filteredDonors.map((donor) => (
                <Grid item xs={12} sm={6} md={4} key={donor.id}>
                  <DonorCard donor={donor} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper 
              className="text-center py-16 bg-gray-50 rounded-xl"
              sx={{ 
                boxShadow: 'none', 
                border: '1px dashed rgba(0,0,0,0.1)',
                py: { xs: 8, md: 16 }
              }}
            >
              <Box className="flex flex-col items-center p-4">
                <PeopleIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" className="text-gray-500 mb-2">
                  No donors matching your criteria
                </Typography>
                <Typography variant="body2" className="text-gray-400 max-w-md mx-auto">
                  Try adjusting your search parameters or check back later as new donors register.
                </Typography>              </Box>
            </Paper>
          )}
        </Box>        {/* Call to Action */}        <Box 
          className="mt-16 md:mt-20 p-6 md:p-10 rounded-2xl text-center relative overflow-hidden"
          sx={{
            background: 'linear-gradient(45deg, #feb2b2 0%, #e53e3e 100%)',
            boxShadow: '0 12px 40px rgba(229, 62, 62, 0.2)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 10% 90%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 40%), radial-gradient(circle at 90% 10%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%)',
              zIndex: 0
            }
          }}
        >
          {/* Background shapes */}
          <Box 
            className="absolute" 
            sx={{
              width: { xs: '180px', sm: '220px', md: '280px' },
              height: { xs: '180px', sm: '220px', md: '280px' },
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              top: { xs: '-80px', sm: '-90px', md: '-100px' },
              right: { xs: '-40px', sm: '-30px', md: '-20px' },
              zIndex: 0,
              display: 'block'
            }}
          />
          <Box 
            className="absolute" 
            sx={{
              width: { xs: '140px', sm: '160px', md: '200px' },
              height: { xs: '140px', sm: '160px', md: '200px' },
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              bottom: { xs: '-50px', sm: '-60px', md: '-70px' },
              left: { xs: '-50px', sm: '-40px', md: '-30px' },
              zIndex: 0,
              display: 'block'
            }}
          />
          <Box
            className="absolute"
            sx={{
              width: { xs: '60px', sm: '80px', md: '100px' },
              height: { xs: '60px', sm: '80px', md: '100px' },
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              top: { xs: '30px', sm: '40px', md: '50px' },
              left: { xs: '10%', sm: '15%', md: '20%' },
              zIndex: 0,
              display: { xs: 'none', sm: 'block' }
            }}
          />
          
          <Box className="relative z-10">
            <Typography 
              variant="h4" 
              component="h2" 
              className="mb-3 font-bold text-white"
              sx={{ 
                textShadow: '0 2px 8px rgba(0,0,0,0.1)',
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }
              }}
            >
              Become a Donor Today
            </Typography>
            <Typography 
              variant="h6" 
              className="mb-6 text-white opacity-90 max-w-lg mx-auto"
              sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}
            >
              Your donation can save up to three lives. Join our community of blood donors and make a difference.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              to={isAuthenticated ? "/profile" : "/register"}
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main', 
                px: { xs: 3, md: 4 },
                py: 1.5,
                fontWeight: 600,
                fontSize: '1.05rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': { 
                  bgcolor: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                }
              }}
            >
              {isAuthenticated ? 'Update Profile' : 'Register as Donor'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
