import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to each request if it exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (userData) => {
    return axiosInstance.post('/register', userData);
  },
  
  login: (email, password) => {
    return axiosInstance.post('/login', { email, password });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  
  getProfile: () => {
    return axiosInstance.get('/profile');
  },
  
  updateProfile: (userData) => {
    return axiosInstance.put('/update-profile', userData);
  }
};

export const donorService = {
  getAllDonors: (filters = {}) => {
    let queryString = '';
    if (filters.bloodGroup) {
      queryString += `bloodGroup=${filters.bloodGroup}&`;
    }
    if (filters.location) {
      queryString += `city=${filters.location}&`;
    }
    
    return axiosInstance.get(`/donors?${queryString}`);
  },
  
  getDonorById: (id) => {
    return axiosInstance.get(`/donor/${id}`);
  }
};

export default {
  authService,
  donorService
};
