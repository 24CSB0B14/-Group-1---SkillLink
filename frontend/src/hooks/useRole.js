import { useAuth } from "@/context/AuthContext";

/**
 * Custom hook to handle role-based access control
 * @returns {Object} Object containing role-related helper functions
 */
export const useRole = () => {
  const { user } = useAuth();

  /**
   * Extract role from user object regardless of structure
   * @param {Object} userObj - The user object
   * @returns {string|null} The user's role or null if not found
   */
  const extractRole = (userObj) => {
    if (!userObj) return null;
    
    // Try different possible locations for the role
    return userObj.role || 
           userObj.user?.role || 
           userObj.data?.role || 
           userObj.userData?.role || 
           null;
  };

  /**
   * Check if the current user has a specific role
   * @param {string} role - The role to check for
   * @returns {boolean} True if the user has the specified role, false otherwise
   */
  const hasRole = (role) => {
    if (!user || !role) return false;
    const userRole = extractRole(user);
    return userRole === role;
  };

  /**
   * Check if the current user is a client
   * @returns {boolean} True if the user is a client, false otherwise
   */
  const isClient = () => {
    return hasRole("client");
  };

  /**
   * Check if the current user is a freelancer
   * @returns {boolean} True if the user is a freelancer, false otherwise
   */
  const isFreelancer = () => {
    return hasRole("freelancer");
  };

  /**
   * Check if the current user is an admin
   * @returns {boolean} True if the user is an admin, false otherwise
   */
  const isAdmin = () => {
    return hasRole("admin");
  };

  /**
   * Get the current user's role
   * @returns {string|null} The user's role or null if not authenticated
   */
  const getUserRole = () => {
    if (!user) return null;
    return extractRole(user);
  };

  return {
    hasRole,
    isClient,
    isFreelancer,
    isAdmin,
    getUserRole,
    userRole: getUserRole(),
  };
};