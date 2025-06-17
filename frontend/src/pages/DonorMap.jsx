import { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Paper, 
  TextField, 
  MenuItem, 
  Button, 
  Chip,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../utils/leafletConfig';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { bloodGroups } from '../utils/constants';
import { donorService } from '../services/api';
import L from 'leaflet';

// Function to dynamically change map view
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Get Marker icon based on blood group
const getBloodGroupIcon = (bloodGroup) => {
  const colors = {
    'A+': '#d32f2f',
    'A-': '#c62828',
    'B+': '#1976d2',
    'B-': '#0d47a1',
    'AB+': '#7b1fa2',
    'AB-': '#4a148c',
    'O+': '#2e7d32',
    'O-': '#1b5e20',
  };
  
  const color = colors[bloodGroup] || '#e53e3e';
  
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color:${color}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${bloodGroup}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const DonorMap = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // Default center (San Francisco)
  const [mapZoom, setMapZoom] = useState(4);
  const [filters, setFilters] = useState({
    bloodGroup: '',
    location: '',
  });
  const [filtersVisible, setFiltersVisible] = useState(!isMobile);
  
  // Stats derived from donor data
  const availableDonors = donors.filter(d => d.available).length;
  const bloodGroupStats = donors.reduce((acc, donor) => {
    acc[donor.bloodGroup] = (acc[donor.bloodGroup] || 0) + 1;
    return acc;
  }, {});
  
  const mostCommonBloodGroup = donors.length > 0 
    ? Object.entries(bloodGroupStats).sort((a, b) => b[1] - a[1])[0][0]
    : 'N/A';
  useEffect(() => {
    // Fetch donors with coordinates from the API
    const fetchDonors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Apply filters to the API call if they exist
        const apiFilters = {};
        if (filters.bloodGroup) apiFilters.bloodGroup = filters.bloodGroup;
        if (filters.location) apiFilters.location = filters.location;
        
        // Use the enhanced service that handles fallbacks
        const donorsData = await donorService.getReliableDonorData(apiFilters);
        
        // Filter out donors without coordinates
        const donorsWithCoordinates = donorsData.filter(donor => 
          donor.coordinates && 
          Array.isArray(donor.coordinates) && 
          donor.coordinates.length === 2
        );
        
        if (donorsWithCoordinates.length > 0) {
          setDonors(donorsWithCoordinates);
          setFilteredDonors(donorsWithCoordinates);
          
          // Calculate center of the map based on donor coordinates
          if (donorsWithCoordinates.length > 0) {
            // Get the first donor's coordinates as center
            const firstDonor = donorsWithCoordinates[0];
            if (firstDonor.coordinates) {
              setMapCenter(firstDonor.coordinates);
              setMapZoom(12); // Zoom in a bit
            }
          }
        } else {
          // No donors with coordinates found, show a message
          setError('No donors with location data found. Showing demo data instead.');
          
          // Use mock data
          const mockDonors = donorService.getMockDonors();
          setDonors(mockDonors);
          setFilteredDonors(mockDonors);
        }
      } catch (err) {
        console.error('Error fetching donors:', err);
        setError('Failed to fetch donor data. Showing demo data instead.');
        
        // In case of error, use mock data for demo purposes
        const mockDonors = donorService.getMockDonors();
        setDonors(mockDonors);
        setFilteredDonors(mockDonors);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonors();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let filtered = [...donors];
    
    if (filters.bloodGroup) {
      filtered = filtered.filter(donor => donor.bloodGroup === filters.bloodGroup);
    }
    
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter(donor => 
        donor.location.toLowerCase().includes(locationLower)
      );
    }
    
    setFilteredDonors(filtered);
    
    // If we have filtered results with coordinates, center the map on the first result
    if (filtered.length > 0 && filtered[0].coordinates) {
      setMapCenter(filtered[0].coordinates);
      setMapZoom(10); // Zoom in when filtering
    }
  };

  const resetFilters = () => {
    setFilters({
      bloodGroup: '',
      location: ''
    });
    setFilteredDonors(donors);
    setMapCenter([37.7749, -122.4194]);
    setMapZoom(4);
  };
  
  // Function to get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setMapZoom(12);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to access your location. Please check your browser settings.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  return (
    <Box className="py-8">
      <Container maxWidth="lg">
        <Box className="mb-6">
          <Typography variant="h4" component="h1" className="mb-3 font-bold text-gray-800">
            Find Blood Donors Near You
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Interactive map showing available blood donors in your area. Click on markers to see donor information.
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Filters Section */}
          <Grid item xs={12} md={filtersVisible ? 3 : 12}>
            <Paper 
              elevation={2} 
              sx={{ 
                mb: 2, 
                borderRadius: '12px',
                p: isMobile && !filtersVisible ? 1.5 : 2.5,
                transition: 'all 0.3s ease',
              }}
            >
              <Box className="flex justify-between items-center mb-3">
                <Box className="flex items-center">
                  <FilterListIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" className="font-semibold">
                    Filters
                  </Typography>
                </Box>
                
                {isMobile && (
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => setFiltersVisible(!filtersVisible)}
                  >
                    {filtersVisible ? 'Hide' : 'Show'}
                  </Button>
                )}
              </Box>
              
              {filtersVisible && (
                <Box className="space-y-3">
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="blood-group-label">Blood Group</InputLabel>
                    <Select
                      labelId="blood-group-label"
                      name="bloodGroup"
                      value={filters.bloodGroup}
                      onChange={handleFilterChange}
                      label="Blood Group"
                    >
                      <MenuItem value="">Any</MenuItem>
                      {bloodGroups.map((group) => (
                        <MenuItem key={group} value={group}>
                          {group}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    size="small"
                    label="City / Location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Box className="flex space-x-2 pt-2">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={applyFilters}
                      fullWidth
                      size="small"
                    >
                      Apply Filters
                    </Button>
                    <Button 
                      variant="outlined"
                      onClick={resetFilters}
                      fullWidth
                      size="small"
                    >
                      Reset
                    </Button>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={getUserLocation}
                    startIcon={<MyLocationIcon />}
                    fullWidth
                    size="small"
                  >
                    Use My Location
                  </Button>
                  
                  <Box className="pt-2">
                    <Chip 
                      label={`${filteredDonors.length} donors found`} 
                      color="primary" 
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              )}
            </Paper>
            
            {filtersVisible && !isMobile && (
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2.5,
                  borderRadius: '12px',
                }}
              >
                <Typography variant="h6" className="mb-2 font-semibold text-gray-700">
                  Blood Donor Statistics
                </Typography>
                <Box className="space-y-2">
                  <Box className="flex justify-between items-center">
                    <Typography variant="body2" className="text-gray-600">Total donors:</Typography>
                    <Typography variant="body2" className="font-medium">{donors.length}</Typography>
                  </Box>
                  
                  <Box className="flex justify-between items-center">
                    <Typography variant="body2" className="text-gray-600">Available donors:</Typography>
                    <Typography variant="body2" className="font-medium text-green-600">{availableDonors}</Typography>
                  </Box>
                  
                  <Box className="flex justify-between items-center">
                    <Typography variant="body2" className="text-gray-600">Most common blood type:</Typography>
                    <Chip 
                      label={mostCommonBloodGroup} 
                      size="small" 
                      color="primary"
                      sx={{ fontWeight: 'bold', minWidth: '45px' }}
                    />
                  </Box>
                  
                  <Box className="flex justify-between items-center">
                    <Typography variant="body2" className="text-gray-600">Locations:</Typography>
                    <Typography variant="body2" className="font-medium">
                      {new Set(donors.map(d => d.location)).size}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}
          </Grid>
          
          {/* Map Section */}
          <Grid item xs={12} md={filtersVisible ? 9 : 12}>
            {error && (
              <Alert 
                severity="error" 
                className="mb-3"
                onClose={() => setError(null)}
                sx={{ borderRadius: '8px' }}
              >
                {error}
              </Alert>
            )}
              <Paper 
              elevation={3} 
              sx={{ 
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                height: '600px'
              }}
            >
              {loading && (
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.7)',
                    zIndex: 1000
                  }}
                >
                  <Box className="text-center">
                    <CircularProgress color="primary" size={60} thickness={5} />
                    <Typography variant="body2" className="mt-2 font-medium">
                      Loading map data...
                    </Typography>
                  </Box>
                </Box>
              )}
              
              <MapContainer 
                center={mapCenter} 
                zoom={mapZoom} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <ChangeView center={mapCenter} zoom={mapZoom} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <ZoomControl position="bottomright" />
                
                {filteredDonors.map((donor) => (
                  <Marker 
                    key={donor.id} 
                    position={donor.coordinates}
                    icon={getBloodGroupIcon(donor.bloodGroup)}
                  >
                    <Popup className="donor-popup">
                      <Box sx={{ minWidth: '200px', p: 1 }}>
                        <Typography variant="subtitle1" className="font-bold mb-1">
                          {donor.name}
                        </Typography>
                        
                        <Box className="flex items-center mb-2">
                          <Chip 
                            label={donor.bloodGroup} 
                            color="primary" 
                            size="small"
                            sx={{ fontWeight: 'bold', mr: 1 }}
                          />
                          <Chip 
                            label={donor.available ? "Available" : "Unavailable"}
                            color={donor.available ? "success" : "default"}
                            size="small"
                            variant={donor.available ? "filled" : "outlined"}
                          />
                        </Box>
                        
                        <Box className="space-y-1.5 my-3">
                          <Typography variant="body2">
                            <strong>Location:</strong> {donor.location}
                          </Typography>
                            <Typography variant="body2">
                            <strong>Last Donated:</strong> {new Date(donor.lastDonated).toLocaleDateString()}
                          </Typography>
                              {donor.available && (
                            <Typography variant="body2" className="flex items-center">
                              <strong>Contact:</strong> 
                              <Button 
                                size="small" 
                                color="primary" 
                                variant="text"
                                href={`tel:${donor.contactNumber}`}
                                sx={{ ml: 1, p: 0, minWidth: 'auto', fontWeight: 'normal' }}
                              >
                                {donor.contactNumber}
                              </Button>
                            </Typography>
                          )}
                        </Box>
                        
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          fullWidth
                          href={`/donor/${donor.id}`}
                          sx={{ mt: 1 }}
                        >
                          View Profile
                        </Button>
                      </Box>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Paper>
            
            <Paper 
              elevation={1} 
              sx={{ 
                mt: 3, 
                p: 2,
                borderRadius: '12px',
                bgcolor: 'rgba(66, 153, 225, 0.1)',
                border: '1px solid rgba(66, 153, 225, 0.2)',
              }}
            >
              <Box className="flex">
                <InfoOutlinedIcon color="info" sx={{ mr: 1.5, fontSize: 20, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2" className="mb-1 text-gray-800 font-medium">
                    How to use the donor map:
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Click on blood type markers to view donor details. Use the filters to find specific blood groups or locations.
                    The "Use My Location" button will center the map on your current position to find donors near you.
                  </Typography>
                </Box>
              </Box>
            </Paper>
            
            {isMobile && (
              <Paper 
                elevation={2} 
                sx={{ 
                  mt: 3,
                  p: 2.5,
                  borderRadius: '12px',
                }}
              >
                <Typography variant="h6" className="mb-2 font-semibold text-gray-700">
                  Blood Donor Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box className="text-center p-2 bg-gray-50 rounded-lg">
                      <Typography variant="body2" className="text-gray-500">Total donors</Typography>
                      <Typography variant="h5" className="font-bold text-gray-800">{donors.length}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className="text-center p-2 bg-gray-50 rounded-lg">
                      <Typography variant="body2" className="text-gray-500">Available</Typography>
                      <Typography variant="h5" className="font-bold text-green-600">{availableDonors}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DonorMap;
