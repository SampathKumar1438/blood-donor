import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <Box className="flex flex-col items-center justify-center p-8">
      <CircularProgress 
        sx={{ 
          color: '#e53e3e',
          marginBottom: 2
        }} 
      />
      <Typography variant="body1" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
