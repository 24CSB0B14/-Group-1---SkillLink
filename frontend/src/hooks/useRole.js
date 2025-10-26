import { useAuth } from "@/context/AuthContext";

/**
 * Custom hook to handle role-based access control
 * @returns {Object} Object containing role-related helper functions
 */
export const useRole = () => {
  const { user } = useAuth();

  /**
   * Check if the current user has a specific role
   * @param {string} role - The role to check for
   * @returns {boolean} True if the user has the specified role, false otherwise
   */
  const hasRole = (role) => {
    if (!user || !role) return false;
    // Handle different user object structures
    const userRole = user.role || user.user?.role;
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
    // Handle different user object structures
    return user.role || user.user?.role || null;
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