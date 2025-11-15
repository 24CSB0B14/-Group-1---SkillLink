import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/hooks/useRole";
import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * ProtectedRoute component to protect routes based on authentication and roles
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string|string[]} props.allowedRoles - Allowed roles for this route
 * @param {boolean} props.requireAuth - Whether authentication is required
 * @returns {React.ReactNode} Protected route or redirect
 */
const ProtectedRoute = ({ children, allowedRoles = null, requireAuth = true }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { hasRole, getUserRole } = useRole();
  const location = useLocation();

  // Show loading state while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required and user is not authenticated, redirect to login
  // But only if we're not already on the login page
  if (requireAuth && !isAuthenticated && location.pathname !== "/login" && location.pathname !== "/signup") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is specified, check if user has one of the allowed roles
  if (allowedRoles && isAuthenticated) {
    // Normalize allowedRoles to array
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // Check if user has any of the allowed roles
    const hasAllowedRole = rolesArray.some(role => hasRole(role));
    
    if (!hasAllowedRole) {
      // Redirect to appropriate dashboard based on user role
      // But prevent redirect loops by checking current path
      const userRole = getUserRole();
      if (userRole === "client" && location.pathname !== "/client") {
        return <Navigate to="/client" replace />;
      } else if (userRole === "freelancer" && location.pathname !== "/freelancer") {
        return <Navigate to="/freelancer" replace />;
      } else if (!userRole && location.pathname !== "/") {
        return <Navigate to="/" replace />;
      }
      // If user doesn't have the right role, show a simple unauthorized message
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Unauthorized Access</h1>
            <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
            <button 
              onClick={() => window.history.back()} 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute;