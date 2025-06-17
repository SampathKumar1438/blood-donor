import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Avatar, 
  Divider, 
  Tooltip, 
  Chip,
  Badge
} from '@mui/material';
import { Link } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FavoriteIcon from '@mui/icons-material/Favorite';

const DonorCard = ({ donor }) => {
  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Get the blood group color
  const getBloodGroupColor = (bloodGroup) => {
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
    
    return colors[bloodGroup] || '#e53e3e';
  };

  // Calculate days since last donation
  const getDaysSinceLastDonation = () => {
    if (!donor.lastDonated) return null;
    
    const lastDonated = new Date(donor.lastDonated);
    const today = new Date();
    const diffTime = today - lastDonated;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysSinceLastDonation = getDaysSinceLastDonation();
  
  return (
    <Card 
      className="h-full overflow-visible relative"
      sx={{ 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
        }
      }}
    >
      {/* Blood Group Badge */}
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        badgeContent={
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: getBloodGroupColor(donor.bloodGroup),
              border: '2px solid white',
              fontWeight: 'bold',
              fontSize: '0.85rem',
            }}
          >
            {donor.bloodGroup}
          </Avatar>
        }
        sx={{
          position: 'absolute',
          top: -10,
          right: 16,
        }}
      >
        <Box sx={{ width: 1, height: 1 }} />
      </Badge>
      
      <CardContent className="p-6">
        <Box className="flex items-center mb-4">
          <Avatar 
            sx={{ 
              bgcolor: donor.available ? '#e53e3e' : '#a0aec0', 
              width: 64, 
              height: 64,
              fontSize: '1.65rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            className="mr-4"
          >
            {getInitials(donor.name)}
          </Avatar>
          
          <Box>
            <Typography variant="h6" className="font-bold line-clamp-1">
              {donor.name}
            </Typography>
            
            <Box className="flex items-center mt-2 gap-2">
              <Tooltip title={donor.available ? "Available to donate" : "Not available at the moment"}>
                <Chip 
                  icon={<FavoriteIcon fontSize="small" />}
                  label={donor.available ? "Available Now" : "Unavailable"}
                  color={donor.available ? "success" : "default"}
                  size="small"
                  variant={donor.available ? "filled" : "outlined"}
                  sx={{
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                />
              </Tooltip>
            </Box>
          </Box>
        </Box>
        
        <Divider 
          sx={{ 
            mt: 2, 
            mb: 3,
            '&:before': { borderTop: 'thin solid rgba(0, 0, 0, 0.08)' },
            '&:after': { borderTop: 'thin solid rgba(0, 0, 0, 0.08)' }
          }}
        />
        
        <Box className="mb-5 space-y-3">
          <Box className="flex items-center">
            <PlaceIcon 
              fontSize="small" 
              className="text-gray-500 mr-2" 
              sx={{ color: 'rgba(0,0,0,0.5)' }}
            />
            <Typography variant="body2" className="text-gray-700 font-medium">
              {donor.location}
            </Typography>
          </Box>
          
          <Box className="flex items-center">
            <CalendarTodayIcon 
              fontSize="small" 
              className="text-gray-500 mr-2" 
              sx={{ color: 'rgba(0,0,0,0.5)' }}
            />
            <Typography variant="body2" className="text-gray-700">
              {donor.lastDonated ? (
                <>
                  <span className="font-medium">Last Donated:</span>{' '}
                  {new Date(donor.lastDonated).toLocaleDateString()} 
                  {daysSinceLastDonation && (
                    <Chip
                      label={`${daysSinceLastDonation} days ago`}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 1, height: 20, fontSize: '0.65rem' }}
                    />
                  )}
                </>
              ) : (
                'No donation history'
              )}
            </Typography>
          </Box>
        </Box>

        <Box className="flex space-x-2 mt-6">
          <Button 
            variant="outlined" 
            color="primary"
            component={Link}
            to={`/donor/${donor.id}`}
            startIcon={<PersonIcon />}
            fullWidth
            sx={{
              borderRadius: '8px',
              py: 1,
              fontWeight: 600,
              borderWidth: '1.5px',
            }}
          >
            Profile
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            component="a"
            href={`tel:${donor.contactNumber}`}
            startIcon={<PhoneIcon />}
            disabled={!donor.available}
            fullWidth
            sx={{
              borderRadius: '8px',
              py: 1,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(229, 62, 62, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(229, 62, 62, 0.3)',
              }
            }}
          >
            Contact
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DonorCard;
