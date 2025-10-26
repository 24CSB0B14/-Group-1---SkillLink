import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import profileService from "@/services/profile.service";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileService.getUserProfile();
        // The backend returns data in response.data, and user info is in response.data.data
        const profileData = response.data || response;
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Determine the correct welcome message based on user role
  const getWelcomeMessage = () => {
    if (user?.username) return user.username;
    if (user?.name) return user.name;
    if (user?.role === "client") return "Client";
    if (user?.role === "freelancer") return "Freelancer";
    return "User";
  };

  // Get user role for display
  const getUserRole = () => {
    if (user?.role) return user.role;
    if (profile?.role) return profile.role;
    return "client"; // Default to client for this dashboard
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-header border-b border-accent/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold text-header-foreground">SkillLink</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-header-foreground">Welcome, {getWelcomeMessage()}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Your Profile</h3>
                  {profile ? (
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Name:</span> {profile.username || profile.name || "N/A"}</p>
                      <p><span className="font-medium">Email:</span> {profile.email || "N/A"}</p>
                      <p><span className="font-medium">Role:</span> {getUserRole()}</p>
                    </div>
                  ) : (
                    <p>No profile data available</p>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <Button onClick={() => navigate("/post-job")}>Post a Job</Button>
                  <Button variant="outline" onClick={() => navigate("/my-jobs")}>View My Jobs</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;