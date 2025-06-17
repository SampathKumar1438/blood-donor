import { Box, Container, Grid, Typography, Link as MuiLink, IconButton, Divider, Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Footer = () => {
  const year = new Date().getFullYear();
  const theme = useTheme();
  
  return (
    <Box 
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        pt: 8,
        pb: 4,
        position: 'relative',
        borderTopLeftRadius: '30px',
        borderTopRightRadius: '30px',
        mt: 8,
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box 
        className="absolute" 
        sx={{
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229,62,62,0.08) 0%, rgba(229,62,62,0) 70%)',
          top: '-220px',
          right: '-80px',
          zIndex: 0
        }}
      />
      <Box 
        className="absolute" 
        sx={{
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229,62,62,0.05) 0%, rgba(229,62,62,0) 70%)',
          bottom: '-100px',
          left: '-100px',
          zIndex: 0
        }}
      />
      
      <Container maxWidth="100%" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Brand section */}
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <Box className="flex items-center mb-3">
              <VolunteerActivismIcon 
                sx={{ 
                  fontSize: 28, 
                  color: theme.palette.primary.main, 
                  mr: 1 
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.primary.main
                }}
              >
                Blood Donor Network
              </Typography>
            </Box>
            
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3, 
                color: 'grey.400',
                maxWidth: '90%'
              }}
            >
              Our mission is to connect blood donors with recipients, making the process
              of blood donation more efficient and accessible to everyone.
            </Typography>
            
            <Box className="flex space-x-2 mb-4">
              <IconButton 
                sx={{ 
                  color: 'grey.500',
                  '&:hover': { 
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)' 
                  }
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'grey.500',
                  '&:hover': { 
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)' 
                  }
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'grey.500',
                  '&:hover': { 
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)' 
                  }
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'grey.500',
                  '&:hover': { 
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)' 
                  }
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
            
            {/* Newsletter signup */}
            <Box 
              sx={{
                mt: 4,
                display: { xs: 'none', md: 'block' }
              }}
            >
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600
                }}
              >
                Subscribe to our newsletter
              </Typography>
              <Box 
                sx={{
                  display: 'flex',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  p: 0.5,
                }}
              >
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: 'white',
                    padding: '8px 12px',
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{
                    minWidth: '44px',
                    width: '44px',
                    height: '44px',
                    borderRadius: '6px',
                    p: 0,
                  }}
                >
                  <ArrowForwardIcon fontSize="small" />
                </Button>
              </Box>
            </Box>
          </Grid>
          
          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2} lg={2}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                color: 'white'
              }}
            >
              Quick Links
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1.5 }}>
                <MuiLink 
                  component={Link} 
                  to="/" 
                  sx={{
                    color: 'grey.400',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'white',
                      pl: 0.5
                    }
                  }}
                >
                  Home
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <MuiLink 
                  component={Link} 
                  to="/donor-map" 
                  sx={{
                    color: 'grey.400',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'white',
                      pl: 0.5
                    }
                  }}
                >
                  Donor Map
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <MuiLink 
                  component={Link} 
                  to="/register" 
                  sx={{
                    color: 'grey.400',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'white',
                      pl: 0.5
                    }
                  }}
                >
                  Become a Donor
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <MuiLink 
                  component={Link} 
                  to="/login" 
                  sx={{
                    color: 'grey.400',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'white',
                      pl: 0.5
                    }
                  }}
                >
                  Sign In
                </MuiLink>
              </Box>
            </Box>
          </Grid>
          
          {/* Resources */}
          <Grid item xs={6} sm={3} md={2} lg={2}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                color: 'white'
              }}
            >
              Resources
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1.5 }}>
                <MuiLink 
                  href="#" 
                  sx={{
                    color: 'grey.400',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'white',
                      pl: 0.5
                    }
                  }}
                >
                  Donation Guidelines
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <MuiLink 
                  href="#" 
                  sx={{
                    color: 'grey.400',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'white',
                      pl: 0.5
                    }
                  }}
                >
                  Blood Types
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <MuiLink 
                  href="#" 
                  sx={{
                    color: 'grey.400',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'white',
                      pl: 0.5
                    }
                  }}
                >
                  FAQs
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <MuiLink 
                  href="#" 
                  sx={{
                    color: 'grey.400',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'white',
                      pl: 0.5
                    }
                  }}
                >
                  Blog
                </MuiLink>
              </Box>
            </Box>
          </Grid>
          
          {/* Contact Us */}
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                color: 'white'
              }}
            >
              Contact Us
            </Typography>
            
            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ color: theme.palette.primary.main, mr: 1.5, fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                info@blooddonor.com
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
              <PhoneIcon sx={{ color: theme.palette.primary.main, mr: 1.5, fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                +1 (555) 123-4567
              </Typography>
            </Box>
            
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start' }}>
              <LocationOnIcon sx={{ color: theme.palette.primary.main, mr: 1.5, fontSize: 20, mt: 0.5 }} />
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                123 Main Street, <br />
                Anytown, US 12345
              </Typography>
            </Box>
            
            <Button
              variant="outlined"
              color="primary"
              sx={{
                borderColor: 'rgba(229, 62, 62, 0.5)',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: 'rgba(229, 62, 62, 0.1)'
                },
              }}
            >
              Contact Us
            </Button>
          </Grid>
        </Grid>
        
        {/* Footer Bottom */}
        <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: 'grey.500', textAlign: { xs: 'center', sm: 'left' } }}>
                © {year} Blood Donor Network. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                <MuiLink 
                  href="#" 
                  sx={{ 
                    color: 'grey.500', 
                    mx: 1.5, 
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    '&:hover': { color: 'white' }
                  }}
                >
                  Privacy Policy
                </MuiLink>
                <MuiLink 
                  href="#" 
                  sx={{ 
                    color: 'grey.500', 
                    mx: 1.5, 
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    '&:hover': { color: 'white' }
                  }}
                >
                  Terms of Service
                </MuiLink>
                <MuiLink 
                  href="#" 
                  sx={{ 
                    color: 'grey.500', 
                    mx: 1.5, 
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    '&:hover': { color: 'white' }
                  }}
                >
                  Cookie Policy
                </MuiLink>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
