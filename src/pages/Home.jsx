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
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
        
        const response = await donorService.getAllDonors();
        const donorsData = response.data;
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
      
      // Call API with filters
      const response = await donorService.getAllDonors({
        bloodGroup: searchParams.bloodGroup,
        location: searchParams.location
      });
      
      setFilteredDonors(response.data);
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
    <Box className="pb-12">
      {/* Hero Section */}
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
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 800, 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              >
                Give the Gift of Life
              </Typography>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  mb: 4, 
                  maxWidth: '600px',
                  fontWeight: 400,
                  opacity: 0.9
                }}
              >
                Connect with blood donors in your area and join our mission to save lives through blood donation.
              </Typography>
              <Box className="flex flex-wrap gap-3">
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
                    px: 4,
                    '&:hover': { 
                      bgcolor: 'white', 
                      opacity: 0.9,
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
                    '&:hover': { 
                      borderColor: 'white', 
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Find Donors
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} className="flex justify-center">
              <Box 
                className="relative"
                sx={{ 
                  display: { xs: 'none', md: 'block' },
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
                    top: '10px',
                    right: '20px',
                  }}
                />
                <Box 
                  className="absolute flex items-center justify-center"
                  sx={{
                    width: '230px',
                    height: '230px',
                    borderRadius: '50%',
                    background: 'white',
                    top: '45px',
                    right: '55px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                >
                  <VolunteerActivismIcon 
                    sx={{ 
                      fontSize: '100px', 
                      color: 'primary.main',
                    }} 
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
        
        {/* Stats Cards */}
        <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 } }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={10} lg={10}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: '16px',
                  py: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transform: 'translateY(50%)'
                }}
              >
                <Grid container>
                  <Grid item xs={4} className="text-center border-r border-gray-200">
                    <Typography variant="h3" className="font-bold text-red-600">
                      {stats.totalDonors}
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                      Total Donors
                    </Typography>
                  </Grid>
                  <Grid item xs={4} className="text-center border-r border-gray-200">
                    <Typography variant="h3" className="font-bold text-red-600">
                      {stats.availableDonors}
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                      Available Now
                    </Typography>
                  </Grid>
                  <Grid item xs={4} className="text-center">
                    <Typography variant="h3" className="font-bold text-red-600">
                      {stats.locations}
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                      Locations
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" className="mt-16 md:mt-24">
        {/* Search Section */}
        <Typography variant="h4" component="h2" className="mb-6 font-bold text-gray-800">
          Find Blood Donors Near You
        </Typography>
        
        <Card 
          className="mb-12" 
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
              
              <Grid item xs={12} md={4} className="flex items-center">
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSearch}
                  className="mr-2"
                  fullWidth
                  startIcon={<SearchIcon />}
                  sx={{ py: 1.5, fontWeight: 600 }}
                >
                  Search Donors
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleClearFilters}
                  sx={{ ml: 2 }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>        
        
        {/* Donors List */}
        <Box className="mt-8">
          <Box className="flex justify-between items-center mb-6">
            <Typography variant="h5" component="h2" className="font-bold text-gray-800">
              Available Donors
            </Typography>
            
            {!loading && (
              <Chip 
                label={`${filteredDonors.length} ${filteredDonors.length === 1 ? 'Donor' : 'Donors'}`} 
                color="primary" 
                variant="outlined" 
              />
            )}
          </Box>

          {error && (
            <Fade in={true}>
              <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Fade>
          )}

          {loading ? (
            <Box className="py-12 text-center">
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
            <Paper className="text-center py-16 bg-gray-50 rounded-xl">
              <Box className="flex flex-col items-center">
                <PeopleIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" className="text-gray-500 mb-2">
                  No donors matching your criteria
                </Typography>
                <Typography variant="body2" className="text-gray-400 max-w-md mx-auto">
                  Try adjusting your search parameters or check back later as new donors register.
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>

        {/* Call to Action */}
        <Box 
          className="mt-20 p-8 rounded-2xl text-center relative overflow-hidden"
          sx={{
            background: 'linear-gradient(45deg, #feb2b2 0%, #e53e3e 100%)',
            boxShadow: '0 12px 40px rgba(229, 62, 62, 0.2)',
          }}
        >
          {/* Background shape */}
          <Box 
            className="absolute" 
            sx={{
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              top: '-120px',
              right: '-50px',
              zIndex: 0
            }}
          />
          <Box 
            className="absolute" 
            sx={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              bottom: '-80px',
              left: '-70px',
              zIndex: 0
            }}
          />
          
          <Box className="relative z-10">
            <Typography 
              variant="h4" 
              component="h2" 
              className="mb-3 font-bold text-white"
              sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              Become a Donor Today
            </Typography>
            <Typography variant="h6" className="mb-6 text-white opacity-90 max-w-lg mx-auto">
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
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1.05rem',
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
