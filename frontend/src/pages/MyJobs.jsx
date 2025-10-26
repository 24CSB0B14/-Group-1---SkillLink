// pages/MyJobs.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock, MapPin, Star, Eye, Edit, Trash2, Briefcase } from "lucide-react";
import { toast } from "sonner";
import jobService from "@/services/job.service";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/context/AuthContext";

const MyJobs = () => {
  const { isClient } = useRole();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

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
      console.error("Failed to fetch jobs:", error);
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
        toast.error("Failed to delete job");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  // Show loading state while determining user role
  if (!user) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-12">
            <p>Loading user information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if user is not a client
  if (user.role !== "client") {
    return (
      <div className="min-h-screen bg-background py-8">
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
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
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
                      Delete
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
    </div>
  );
};

export default MyJobs;