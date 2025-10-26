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
    let isMounted = true; // Flag to prevent state updates after component unmount
    
    const checkAuthStatus = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (isMounted) { // Only update state if component is still mounted
          if (response && response.data) {
            // Handle response format: response.data contains the user object
            const userData = response.data;
            setUser(userData);
            setIsAuthenticated(true);
          } else if (response) {
            // Handle case where response is directly the user object
            setUser(response);
            setIsAuthenticated(true);
          } else {
            // No user data returned
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        // User is not authenticated or there was an error
        console.error("Auth check failed:", error);
        if (isMounted) { // Only update state if component is still mounted
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) { // Only update state if component is still mounted
          setLoading(false);
        }
      }
    };

    checkAuthStatus();
    
    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      // Handle different response formats
      let userData = null;
      let token = null;
      
      if (response && response.data) {
        // Standard format: response.data contains user data
        userData = response.data.user || response.data;
        token = response.data.accessToken || response.data.token;
      } else if (response) {
        // Direct format: response is the user object
        userData = response.user || response;
        token = response.accessToken || response.token;
      }
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, data: userData };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      // Ensure user is logged out on login failure
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: error.message || "Login failed" };
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
      return { success: false, error: error.message || "Signup failed" };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      // Even if logout fails on the server, we still clear local state
      setUser(null);
      setIsAuthenticated(false);
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