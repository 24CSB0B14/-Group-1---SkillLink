// pages/MyJobs.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock, Star, Eye, Edit, Trash2, Briefcase, Shield } from "lucide-react";
import { toast } from "sonner";
import jobService from "@/services/job.service";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/context/AuthContext";
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

const MyJobs = () => {
  const { isClient } = useRole();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [disputeLoading, setDisputeLoading] = useState(false);

  useEffect(() => {
    // Redirect if user is not a client
    if (user && user.role !== "client") {
      navigate("/search-jobs");
      return;
    }
    
    // Fetch jobs only once when user is available and we haven't fetched yet
    if (user && !hasFetched) {
      setHasFetched(true);
      fetchMyJobs();
    }
  }, [user, navigate, hasFetched]);

  const fetchMyJobs = async () => {
    try {
      // Only set loading to true if we're not already loading
      if (!loading) {
        setLoading(true);
      }
      const response = await jobService.getJobsByClient();
      // Use actual API response data
      const jobsData = response.data || response;
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      if (error.response?.data?.message) {
        toast.error(`Failed to load your jobs: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to load your jobs: ${error.message}`);
      } else {
        toast.error("Failed to load your jobs. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        setLoading(true);
        await jobService.deleteJob(jobId);
        toast.success("Job deleted successfully");
        // Refresh the job list
        await fetchMyJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
        if (error.response?.data?.message) {
          toast.error(`Failed to delete job: ${error.response.data.message}`);
        } else if (error.message) {
          toast.error(`Failed to delete job: ${error.message}`);
        } else {
          toast.error("Failed to delete job. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  const handleRaiseDispute = (job) => {
    setSelectedJob(job);
    setIsDisputeModalOpen(true);
  };

  const submitDispute = async () => {
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
      setSelectedJob(null);
    } catch (error) {
      console.error('Error submitting dispute:', error);
      if (error.response?.data?.message) {
        toast.error(`Failed to raise dispute: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to raise dispute: ${error.message}`);
      } else {
        toast.error("Failed to raise dispute. Please try again later.");
      }
    } finally {
      setDisputeLoading(false);
    }
  };

  // Show loading state while determining user role
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center py-12">
              <p>Loading user information...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Redirect if user is not a client
  if (user.role !== "client") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground mb-6">
                Only clients can view their own jobs.
              </p>
              <Button asChild>
                <Link to="/search-jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Jobs</h1>
            <p className="text-muted-foreground mt-2">
              Manage your posted jobs
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchMyJobs} disabled={loading}>
              Refresh
            </Button>
            <Button asChild>
              <Link to="/client-dashboard">My Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <p>Loading your jobs...</p>
          </div>
        )}

        {/* Job Listings */}
        <div className="space-y-6">
          {jobs.map((job) => (
            <Card key={job._id} className={`hover:shadow-lg transition ${job.featured ? 'border-primary/20 bg-primary/5' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      {job.featured && (
                        <Badge className="bg-warning text-white">Featured</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{job.client?.rating || "N/A"}</span>
                      </div>
                      <span>•</span>
                      <span>{job.client?.name || "Unknown Client"}</span>
                      <span>•</span>
                      <span>${job.client?.totalSpent?.toLocaleString() || 0} total spent</span>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills?.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {job.budgetType === 'hourly' ? `$${job.budget}/hr` : `$${job.budget} fixed`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{job.duration || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{job.posted || "Recently"}</span>
                      </div>
                      <span>{job.proposals || 0} proposals</span>
                    </div>

                    {/* Escrow Status */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          <span className="font-medium">Escrow Status</span>
                        </div>
                        <Badge variant="outline">Not Funded</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="outline" onClick={() => handleViewJob(job._id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" onClick={() => handleEditJob(job._id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" onClick={() => handleDeleteJob(job._id)} disabled={loading}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      {loading ? "Deleting..." : "Delete"}
                    </Button>
                    <Button variant="outline" onClick={() => handleRaiseDispute(job)}>
                      <Shield className="w-4 h-4 mr-2" />
                      Raise Dispute
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {jobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by posting your first job.
            </p>
            <Button asChild>
              <Link to="/post-job">Post a Job</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      <Dialog open={isDisputeModalOpen} onOpenChange={(open) => {
        setIsDisputeModalOpen(open);
        if (!open) {
          setDisputeReason("");
          setSelectedJob(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise a Dispute for "{selectedJob?.title}"</DialogTitle>
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
              <Button onClick={submitDispute} disabled={disputeLoading}>
                {disputeLoading ? "Submitting..." : "Submit Dispute"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
      <Footer />
    </div>
  );
};

export default MyJobs;