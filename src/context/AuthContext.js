import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';


const AuthContext = createContext(null);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
console.log(BACKEND_URL);

const routes={
    login: `${BACKEND_URL}/api/user/login`,
    signup: `${BACKEND_URL}/api/user/create`,
    user: `${BACKEND_URL}/api/user/get`,
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  console.log(user)

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
      
          const userData = await getLoggedInUser(token);
          setUser(userData);
        
      } catch (error) {
        console.error('Authentication check failed:', error);
        setUser(null);
        localStorage.removeItem('token');
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(routes.login, { email, password });
      const { token, user: userData } = response.data;
      setUser(userData);
      localStorage.setItem('token', token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name, email, password,  language, latitude, longitude, phone) => {
    try {
      const response = await axios.post(routes.signup, { name, email, password, language, latitude, longitude, phone });
      const { token, user: userData } = response.data;
      setUser(userData);
      localStorage.setItem('token', token);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const getLoggedInUser = async (token) => {
    try {
      const response = await axios.get(routes.user, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    getLoggedInUser,
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
