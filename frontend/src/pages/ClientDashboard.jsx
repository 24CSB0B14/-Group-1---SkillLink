import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Briefcase, User, FileText, AlertTriangle, DollarSign, MessageSquare } from "lucide-react";
import profileService from "@/services/profile.service";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import escrowService from "@/services/escrow.service";

const ClientDashboard = () => {
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
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        {/* Main Content Skeleton */}
        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Dashboard</CardTitle>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="grid gap-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome back, {getWelcomeMessage()}!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Here's what's happening with your projects today.
              </p>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Jobs</p>
                    <p className="text-xl font-bold">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-xl font-bold">$2,450</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-100">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Messages</p>
                    <p className="text-xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button onClick={() => navigate("/post-job")} className="flex flex-col items-center justify-center h-24 gap-2">
                  <Briefcase className="w-6 h-6" />
                  <span>Post a Job</span>
                </Button>
                <Button variant="outline" onClick={() => navigate("/my-jobs")} className="flex flex-col items-center justify-center h-24 gap-2">
                  <FileText className="w-6 h-6" />
                  <span>My Jobs</span>
                </Button>
                <Button variant="outline" onClick={() => navigate("/freelancers")} className="flex flex-col items-center justify-center h-24 gap-2">
                  <User className="w-6 h-6" />
                  <span>Find Freelancers</span>
                </Button>
                <Dialog open={isDisputeModalOpen} onOpenChange={setIsDisputeModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex flex-col items-center justify-center h-24 gap-2">
                      <AlertTriangle className="w-6 h-6" />
                      <span>Raise Dispute</span>
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
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">New bid received</p>
                    <p className="text-sm text-muted-foreground">Web design project - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 rounded-full bg-green-100">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Payment released</p>
                    <p className="text-sm text-muted-foreground">Mobile app development - 1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 rounded-full bg-purple-100">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">New message</p>
                    <p className="text-sm text-muted-foreground">From Alex Johnson - 2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;