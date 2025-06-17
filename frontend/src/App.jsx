import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container, CssBaseline } from '@mui/material';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import DonorMap from './pages/DonorMap';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CssBaseline />
        <Box className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          
          <Box className="flex-grow">
            <Container maxWidth="lg" className="py-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/donor-map" element={<DonorMap />} />
                <Route path="/donor/:id" element={<Profile />} />
              </Routes>
            </Container>
          </Box>
          
          <Footer />
        </Box>
      </AuthProvider>
    </Router>
  );
}

export default App;
