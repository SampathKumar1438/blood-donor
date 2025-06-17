import { 
  AppBar, 
  Box, 
  Button, 
  Container, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon,
  ListItemText, 
  Toolbar, 
  Typography, 
  Avatar, 
  Menu, 
  MenuItem, 
  Tooltip, 
  Badge,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { isAuthenticated, user, logout } = useAuth();
  const isMenuOpen = Boolean(anchorEl);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.firstName) return '?';
    return (user.firstName.charAt(0) + (user.lastName ? user.lastName.charAt(0) : '')).toUpperCase();
  };

  // Check if user is logged in
  const isLoggedIn = isAuthenticated && user;

  const navItems = [
    { title: 'Home', path: '/', icon: <HomeIcon /> },
    { title: 'Donor Map', path: '/donor-map', icon: <MapIcon /> },
  ];

  const renderUserMenu = (
    <Menu
      anchorEl={anchorEl}
      id="user-menu"
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          mt: 1.5,
          minWidth: 180,
          boxShadow: '0px 8px 16px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1.5,
            borderRadius: '8px',
            mx: 0.5,
            my: 0.25,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {user && (
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" className="font-semibold">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="text-sm">
            {user.email}
          </Typography>
        </Box>
      )}
      
      <Divider />
      
      <MenuItem onClick={() => {
        handleMenuClose();
        navigate('/profile');
      }}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>My Profile</ListItemText>
      </MenuItem>
      
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Sign Out</ListItemText>
      </MenuItem>
    </Menu>
  );

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ height: '100%', pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 3 }}>
        <VolunteerActivismIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
          Blood Donor
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.title} 
            disablePadding 
            sx={{ mb: 1 }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: '12px',
                mx: 1,
                color: location.pathname === item.path ? 'primary.main' : 'inherit',
                bgcolor: location.pathname === item.path ? 'rgba(229, 62, 62, 0.08)' : 'transparent',
                '&:hover': {
                  bgcolor: location.pathname === item.path ? 'rgba(229, 62, 62, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {isAuthenticated ? (
        <>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link} 
              to="/profile"
              selected={location.pathname === '/profile'}
              sx={{
                borderRadius: '12px',
                mx: 1,
                color: location.pathname === '/profile' ? 'primary.main' : 'inherit',
                bgcolor: location.pathname === '/profile' ? 'rgba(229, 62, 62, 0.08)' : 'transparent',
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === '/profile' ? 'primary.main' : 'inherit', minWidth: 40 }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              sx={{ 
                borderRadius: '12px',
                mx: 1,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </ListItem>
        </>
      ) : (
        <>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              component={Link} 
              to="/login"
              selected={location.pathname === '/login'}
              sx={{
                borderRadius: '12px',
                mx: 1,
                color: location.pathname === '/login' ? 'primary.main' : 'inherit',
                bgcolor: location.pathname === '/login' ? 'rgba(229, 62, 62, 0.08)' : 'transparent',
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === '/login' ? 'primary.main' : 'inherit', minWidth: 40 }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </ListItemButton>
          </ListItem>
          
          <ListItem sx={{ px: 2, mt: 2 }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              fullWidth
              startIcon={<PersonIcon />}
              sx={{ py: 1, borderRadius: 2 }}
            >
              Register
            </Button>
          </ListItem>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
        elevation={0}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              py: 1,
              minHeight: '64px',
            }}
          >
            {/* Mobile menu icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{ 
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                mr: 3
              }}
            >
              <VolunteerActivismIcon 
                color="primary" 
                sx={{ 
                  fontSize: 28, 
                  mr: 1,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                    },
                    '50%': {
                      transform: 'scale(1.15)',
                    },
                    '100%': {
                      transform: 'scale(1)',
                    },
                  }
                }} 
              />
              <Typography
                variant="h6"
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  background: 'linear-gradient(45deg, #e53e3e, #f56565)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Blood Donor Network
              </Typography>
            </Box>
            
            {/* Desktop navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button 
                  key={item.title} 
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{ 
                    color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                    mx: 1,
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    borderBottom: location.pathname === item.path ? '2px solid' : 'none',
                    borderRadius: 0,
                    pb: 0.5,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'primary.main',
                    }
                  }}
                >
                  {item.title}
                </Button>
              ))}
            </Box>
            
            {/* User section */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  <Tooltip title="Notifications">
                    <IconButton size="large" color="inherit" sx={{ mr: 1 }}>
                      <Badge badgeContent={2} color="primary">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Account settings">
                    <IconButton
                      edge="end"
                      aria-label="account of current user"
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: 'primary.main',
                          fontSize: '1rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {getUserInitials()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Button 
                    component={Link}
                    to="/login"
                    sx={{ 
                      color: 'text.primary',
                      fontWeight: 500,
                      mr: 1,
                      display: { xs: 'none', sm: 'flex' }
                    }}
                    startIcon={<LoginIcon />}
                  >
                    Sign In
                  </Button>
                  
                  <Button 
                    component={Link}
                    to="/register"
                    variant="contained"
                    color="primary"
                    sx={{ 
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(229, 62, 62, 0.2)',
                      px: { xs: 2, sm: 3 },
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(229, 62, 62, 0.3)',
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {renderUserMenu}
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            borderRadius: '0 16px 16px 0',
            borderLeft: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Header;
