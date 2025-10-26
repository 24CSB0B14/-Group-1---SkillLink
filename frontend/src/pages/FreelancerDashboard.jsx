import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, User, Bell, DollarSign, AlertTriangle } from "lucide-react";
import profileService from "@/services/profile.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeLoading, setDisputeLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileService.getUserProfile();
        // The backend returns data in response.data, and user info is in response.data.data
        const profileData = response.data || response;
        setProfile(profileData);
      } catch (error) {
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

  const handleRaiseDispute = async () => {
    if (!disputeReason.trim()) {
      toast.error("Please provide a reason for the dispute");
      return;
    }

    setDisputeLoading(true);
    try {
      // In a real implementation, you would pass the actual escrow ID
      // For now, we'll show a success message
      toast.success("Dispute raised successfully");
      setIsDisputeModalOpen(false);
      setDisputeReason("");
    } catch (error) {
      toast.error("Failed to raise dispute");
    } finally {
      setDisputeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <header className="bg-header border-b border-accent/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Skeleton */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Freelancer Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-6 w-24 mb-4" />
                    <div className="mt-2 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
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
    return "freelancer"; // Default to freelancer for this dashboard
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
              <CardTitle>Freelancer Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Your Profile</h3>
                  </div>
                  {profile ? (
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-20">Name:</span>
                        <span>{profile.username || profile.name || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-20">Email:</span>
                        <span>{profile.email || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-20">Role:</span>
                        <Badge variant="secondary">{getUserRole()}</Badge>
                      </div>
                    </div>
                  ) : (
                    <p>No profile data available</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                  <Button onClick={() => navigate("/search-jobs")} className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Find Jobs
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/notifications")} className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    My Bids
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/freelancer-earnings")} className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    My Earnings
                  </Button>
                  <Dialog open={isDisputeModalOpen} onOpenChange={setIsDisputeModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Raise a Dispute
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Raise a Dispute</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="disputeReason">Reason for Dispute</Label>
                          <Textarea
                            id="disputeReason"
                            placeholder="Please provide details about your dispute..."
                            value={disputeReason}
                            onChange={(e) => setDisputeReason(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsDisputeModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleRaiseDispute} disabled={disputeLoading}>
                            {disputeLoading ? "Submitting..." : "Submit Dispute"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FreelancerDashboard;