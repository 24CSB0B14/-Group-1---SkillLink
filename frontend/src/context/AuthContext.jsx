import { createContext, useContext, useEffect, useState } from "react";
import authService from "@/services/auth.service";

// Create the Auth Context
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    let isMounted = true;
    
    const checkAuthStatus = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (isMounted) {
          if (response && response.data) {
            const userData = response.data;
            setUser(userData);
            setIsAuthenticated(true);
          } else if (response && response.user) {
            // Handle case where response directly contains user object
            const userData = response.user;
            setUser(userData);
            setIsAuthenticated(true);
          } else if (response) {
            setUser(response);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        // Only log error if it's not a 401 (unauthorized)
        if (error.response?.status !== 401) {
          console.error('Auth check error:', error);
        }
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuthStatus();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      // Handle different response formats
      let userData = null;
      
      if (response && response.data) {
        // Standard format: response.data contains user data
        userData = response.data.user || response.data;
      } else if (response && response.user) {
        // Direct format: response is the user object
        userData = response.user;
      } else if (response) {
        userData = response;
      }
      
      if (userData) {
        // Update state immediately and synchronously
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true, data: userData };
      } else {
        setUser(null);
        setIsAuthenticated(false);
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      // Ensure user is logged out on login failure
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: error.response?.data?.message || error.message || "Login failed" };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      
      // Handle different response formats
      let userObject = null;
      let token = null;
      
      if (response && response.data) {
        // Standard format: response.data contains user data
        userObject = response.data.user || response.data;
        token = response.data.accessToken || response.data.token;
      } else if (response) {
        // Direct format: response is the user object
        userObject = response.user || response;
        token = response.accessToken || response.token;
      }
      
      if (userObject) {
        setUser(userObject);
        setIsAuthenticated(true);
        return { success: true, data: { ...response.data, user: userObject } };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      // Ensure user is logged out on signup failure
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: error.response?.data?.message || error.message || "Signup failed" };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      // Ensure state is cleared synchronously
      setUser(null);
      setIsAuthenticated(false);
      // Force a small delay to ensure state updates propagate
      await new Promise(resolve => setTimeout(resolve, 100));
      return { success: true };
    } catch (error) {
      // Even if logout fails on the server, we still clear local state
      setUser(null);
      setIsAuthenticated(false);
      // Force a small delay to ensure state updates propagate
      await new Promise(resolve => setTimeout(resolve, 100));
      return { success: true, error: error.message || "Logout completed locally" };
    }
  };

  // Context value
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;