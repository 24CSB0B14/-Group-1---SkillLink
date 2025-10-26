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
  const { isAuthenticated, loading } = useAuth();
  const { hasRole, getUserRole } = useRole();
  const location = useLocation();

  // Show loading state while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
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
      if (userRole === "client" && location.pathname !== "/client-dashboard") {
        return <Navigate to="/client-dashboard" replace />;
      } else if (userRole === "freelancer" && location.pathname !== "/freelancer-dashboard") {
        return <Navigate to="/freelancer-dashboard" replace />;
      } else if (!userRole && location.pathname !== "/") {
        return <Navigate to="/" replace />;
      }
    }
  }

  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute;