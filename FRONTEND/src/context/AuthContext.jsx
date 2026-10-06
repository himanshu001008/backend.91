import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  /**
   * Logout user and purge stored credentials
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  /**
   * Helper to update local user state (e.g. credit balance change)
   */
  const updateUser = useCallback((updatedUserData) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const newUserData = { ...prevUser, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(newUserData));
      return newUserData;
    });
  }, []);

  /**
   * Login user with email & password
   */
  const login = useCallback(async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token: jwtToken, user: userData } = response.data;

      if (!jwtToken || !userData) {
        throw new Error('Invalid response from server');
      }

      // Persist token and sanitized user object
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(jwtToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Login failed. Please check credentials.';
      throw new Error(message);
    }
  }, []);

  /**
   * Register a new user (member or studio)
   */
  const register = useCallback(async (name, email, password, role = 'member') => {
    try {
      await API.post('/auth/register', {
        name,
        email,
        password,
        role
      });

      // After registration, automatically attempt login to return token + user
      const loginResult = await login(email, password);
      return loginResult;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      throw new Error(message);
    }
  }, [login]);

  // Initialize and verify authentication on app launch or refresh
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);

          // Verify token validity with backend /api/auth/me
          const response = await API.get('/auth/me');
          if (response.data && response.data.data) {
            setUser(response.data.data);
            localStorage.setItem('user', JSON.stringify(response.data.data));
          }
        } catch (error) {
          // If token expired or invalid, reset auth state
          console.warn('Session expired or invalid, logging out.');
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [logout]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateUser
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

export default AuthContext;
