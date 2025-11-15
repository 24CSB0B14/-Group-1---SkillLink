import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, Menu, Briefcase, User, Settings, LogOut, Home, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useEffect, useState, useMemo } from "react";
import notificationService from "@/services/notification.service";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Memoize the authentication state to ensure proper re-rendering
  const authState = useMemo(() => ({
    user,
    isAuthenticated
  }), [user, isAuthenticated]);

  // Debug logging to see what's happening with auth state
  useEffect(() => {
    console.log("Header auth state changed:", { user, isAuthenticated });
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchUnreadNotifications();
    } else {
      // Reset notifications when user logs out
      setUnreadNotifications(0);
    }
  }, [authState.isAuthenticated]);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      const count = response.data?.count || 0;
      setUnreadNotifications(count);
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      setUnreadNotifications(0);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      // Navigate to home page after logout
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (authState.user?.role === "client") {
      navigate("/freelancers");
    } else if (authState.user?.role === "freelancer") {
      navigate("/search-jobs");
    } else {
      // For non-authenticated users, go to the appropriate search page
      navigate("/search-jobs");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDashboardLink = () => {
    if (authState.user?.role === "client") return "/client";
    if (authState.user?.role === "freelancer") return "/freelancer";
    if (authState.user?.role === "admin") return "/admin";
    return "/";
  };

  const getHomepageLink = () => {
    if (authState.user?.role === "client") return "/client";
    if (authState.user?.role === "freelancer") return "/freelancer";
    return "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to={authState.isAuthenticated ? getHomepageLink() : "/"} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SkillLink
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {authState.isAuthenticated ? (
              <>
                {authState.user?.role === "freelancer" && (
                  <>
                    <Link
                      to="/freelancer"
                      className="text-gray-700 hover:text-primary transition font-medium"
                    >
                      Find Work
                    </Link>
                    <Link
                      to="/search-jobs"
                      className="text-gray-700 hover:text-primary transition font-medium"
                    >
                      Browse Jobs
                    </Link>
                    <Link
                      to="/freelancer-earnings"
                      className="text-gray-700 hover:text-primary transition font-medium"
                    >
                      Earnings
                    </Link>
                  </>
                )}
                {authState.user?.role === "client" && (
                  <>
                    <Link
                      to="/client"
                      className="text-gray-700 hover:text-primary transition font-medium"
                    >
                      Find Talent
                    </Link>
                    <Link
                      to="/freelancers"
                      className="text-gray-700 hover:text-primary transition font-medium"
                    >
                      Browse Freelancers
                    </Link>
                    <Link
                      to="/my-jobs"
                      className="text-gray-700 hover:text-primary transition font-medium"
                    >
                      My Jobs
                    </Link>
                    <Link to="/post-job">
                      <Button variant="default" size="sm" className="bg-gradient-to-r from-primary to-accent hover:from-purple-700 hover:to-blue-700 text-white">
                        Post a Job
                      </Button>
                    </Link>
                  </>
                )}
                {authState.user?.role === "admin" && (
                  <>
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-emerald-600 transition font-medium"
                    >
                      Dashboard
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary transition font-medium"
                >
                  Find Talent
                </Link>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary transition font-medium"
                >
                  Find Work
                </Link>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary transition font-medium"
                >
                  Why SkillLink
                </Link>
              </>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {authState.isAuthenticated ? (
              <>
                {/* Search Icon */}
                <form onSubmit={handleSearch} className="hidden md:flex items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 h-8 w-40 text-sm focus:w-64 transition-all"
                      onClick={() => {
                        if (authState.user?.role === "client") {
                          navigate("/freelancers");
                        } else if (authState.user?.role === "freelancer") {
                          navigate("/search-jobs");
                        }
                      }}
                    />
                  </div>
                </form>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => navigate("/notifications")}
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </Button>

                {/* Messages */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/messages")}
                >
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={authState.user?.avatar} alt={authState.user?.fullName || authState.user?.username} />
                        <AvatarFallback className="bg-primary-light text-primary">
                          {getInitials(authState.user?.fullName || authState.user?.username)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {authState.user?.fullName || authState.user?.username}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {authState.user?.email}
                        </p>
                        <p className="text-xs leading-none text-primary capitalize mt-1">
                          {authState.user?.role}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(getHomepageLink())}>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/edit-profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/messages")}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-primary">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-purple-700 hover:to-blue-700 text-white">Sign Up</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {authState.isAuthenticated ? (
                  <>
                    {authState.user?.role === "freelancer" && (
                      <>
                        <DropdownMenuItem onClick={() => navigate("/freelancer")}>
                          Find Work
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/search-jobs")}>
                          Browse Jobs
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/freelancer-earnings")}>
                          Earnings
                        </DropdownMenuItem>
                      </>
                    )}
                    {authState.user?.role === "client" && (
                      <>
                        <DropdownMenuItem onClick={() => navigate("/client")}>
                          Find Talent
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/freelancers")}>
                          Browse Freelancers
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/my-jobs")}>
                          My Jobs
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/post-job")}>
                          Post a Job
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/")}>
                      Find Talent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/")}>
                      Find Work
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/")}>
                      Why SkillLink
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;