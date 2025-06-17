import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      };
    case 'AUTH_READY':
      return {
        ...state,
        loading: false,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if user is already logged in via token
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          // Validate token by getting profile
          const response = await authService.getProfile();
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: JSON.parse(user)
          });
        } catch (error) {
          console.error('Token validation failed:', error);
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'AUTH_READY' });
        }
      } else {
        dispatch({ type: 'AUTH_READY' });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      const response = await authService.login(email, password);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data.user
      });
      
      return response.data.user;
    } catch (error) {
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: error.response?.data?.message || 'Login failed' 
      });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      await authService.register(userData);
      
      // After registration, log the user in
      const loginResponse = await authService.login(userData.email, userData.password);
      
      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: loginResponse.data.user
      });
      
      return loginResponse.data.user;
    } catch (error) {
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: error.response?.data?.message || 'Registration failed' 
      });
      throw error;
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      
      // Update the user data in localStorage and state
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      dispatch({
        type: 'UPDATE_USER',
        payload: userData
      });
      
      return updatedUser;
    } catch (error) {
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: error.response?.data?.message || 'Profile update failed' 
      });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    logout,
    register,
    updateProfile,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
