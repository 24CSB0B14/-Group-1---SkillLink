// pages/PlaceBid.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Clock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import jobService from "@/services/job.service";
import bidService from "@/services/bid.service";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/context/AuthContext";

const PlaceBid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFreelancer, userRole } = useRole();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState(null);
  const [bidData, setBidData] = useState({
    amount: "",
    timeline: "",
    proposal: "",
    milestones: []
  });
  const [loading, setLoading] = useState(true);

  // Memoize the freelancer check to prevent infinite loops
  const checkFreelancerAccess = useCallback(() => {
    if (!isAuthenticated) {
      toast.error("Please login to place a bid");
      navigate("/login");
      return false;
    }
    
    if (!user) {
      toast.error("User data not available");
      navigate("/login");
      return false;
    }
    
    if (userRole !== "freelancer") {
      toast.error("Only freelancers can place bids");
      navigate("/job-details/" + id);
      return false;
    }
    
    return true;
  }, [isAuthenticated, user, userRole, id, navigate]);

  useEffect(() => {
    const hasAccess = checkFreelancerAccess();
    if (hasAccess) {
      fetchJobDetails();
    }
  }, [checkFreelancerAccess]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(id);
      // Use actual API response data
      const jobData = response.data || response;
      setJob(jobData);
    } catch (error) {
      toast.error("Failed to load job details");
      // Fallback to mock data if API fails
      setJob(mockJob);
    } finally {
      setLoading(false);
    }
  };

  const mockJob = {
    _id: "SKL-001",
    title: "Senior UI/UX Designer for Mobile App",
    budget: 5000,
    budgetType: "fixed",
    skills: ["Figma", "UI/UX Design", "Mobile Design"]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bidPayload = {
        amount: parseFloat(bidData.amount),
        coverLetter: bidData.proposal  // Map proposal to coverLetter for backend
      };

      const response = await bidService.placeBid(id, bidPayload);
      toast.success("Bid submitted successfully!");
      navigate("/job-details/" + id);
    } catch (error) {
      toast.error(error.message || "Failed to submit bid. Please try again.");
    }
  };

  // Show access denied message if user is not a freelancer
  // Additional check to ensure we have user data
  if (!isAuthenticated || !user || userRole !== "freelancer") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            Only freelancers can place bids on jobs.
          </p>
          <Button onClick={() => navigate("/job-details/" + id)}>
            Back to Job
          </Button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  if (!job) return <div className="min-h-screen bg-background flex items-center justify-center">Job not found</div>;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/job-details/" + id)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Job
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Place Your Bid</CardTitle>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bid Amount */}
              <div>
                <label className="text-sm font-medium mb-2 block">Your Bid Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Enter your bid amount"
                    className="pl-10"
                    value={bidData.amount}
                    onChange={(e) => setBidData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Client's budget: ${job.budget} ({job.budgetType})
                </p>
              </div>

              {/* Timeline */}
              <div>
                <label className="text-sm font-medium mb-2 block">Estimated Timeline</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g., 3 weeks, 1 month"
                    className="pl-10"
                    value={bidData.timeline}
                    onChange={(e) => setBidData(prev => ({ ...prev, timeline: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Proposal */}
              <div>
                <label className="text-sm font-medium mb-2 block">Your Proposal</label>
                <Textarea
                  placeholder="Describe why you're the best fit for this project. Include your relevant experience and approach..."
                  rows={8}
                  value={bidData.proposal}
                  onChange={(e) => setBidData(prev => ({ ...prev, proposal: e.target.value }))}
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" size="lg" className="flex-1">
                  Submit Bid
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => navigate("/job-details/" + id)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Bidding Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Research similar projects to set a competitive price</p>
            <p>• Be specific about your approach and timeline</p>
            <p>• Highlight relevant experience and portfolio items</p>
            <p>• Ask clarifying questions if job details are unclear</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlaceBid;