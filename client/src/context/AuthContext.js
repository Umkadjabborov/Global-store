import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      getMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getMe = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Get me error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('Sending register request:', { username, email, password });
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });
      console.log('Register response:', response.data);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Register error:', error);
      console.error('Register error response:', error.response);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed',
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
