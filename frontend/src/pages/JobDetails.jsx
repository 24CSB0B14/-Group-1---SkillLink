// pages/JobDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, Clock, MapPin, User, Briefcase } from "lucide-react";
import { toast } from "sonner";
import jobService from "@/services/job.service";
import bidService from "@/services/bid.service";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { isFreelancer } = useRole();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
    fetchBids();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      // Log the job ID for debugging
      console.log("Fetching job with ID:", jobId);
      
      const response = await jobService.getJobById(jobId);
      // Handle different response formats
      const jobData = response.data || response;
      if (jobData) {
        setJob(jobData);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to load job details:", error);
      if (error.response?.data?.message) {
        toast.error(`Failed to load job details: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to load job details: ${error.message}`);
      } else {
        toast.error("Failed to load job details. Please try again later.");
      }
      // Navigate back if job not found
      if (error.response?.status === 404) {
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await bidService.getBidsForJob(jobId);
      // Handle different response formats
      let bidsData = [];
      if (response && response.data) {
        bidsData = Array.isArray(response.data) ? response.data : [response.data];
      } else if (response) {
        bidsData = Array.isArray(response) ? response : [response];
      }
      // Ensure each bid has the required properties
      const validatedBids = bidsData.map(bid => ({
        _id: bid._id || bid.id,
        id: bid.id || bid._id,
        freelancer: bid.freelancer || {},
        amount: bid.amount || bid.price || 0,
        coverLetter: bid.coverLetter || bid.description || "",
        status: bid.status || "pending",
        createdAt: bid.createdAt || bid.created_at || new Date()
      }));
      setBids(validatedBids);
    } catch (error) {
      console.error("Failed to load bids:", error);
      setBids([]);
      if (error.response?.data?.message) {
        toast.error(`Failed to load bids: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to load bids: ${error.message}`);
      } else {
        toast.error("Failed to load bids. Please try again later.");
      }
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      const response = await bidService.acceptBid(bidId);
      toast.success("Bid accepted successfully!");
      
      // If a conversation was created, redirect to chat
      if (response.data?.conversation?._id) {
        navigate(`/chat/${response.data.conversation._id}`);
      } else {
        // Otherwise, refresh the job details and bids
        fetchJobDetails();
        fetchBids();
      }
    } catch (error) {
      console.error("Failed to accept bid:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to accept bid");
    }
  };

  if (loading) return <Loading />;
  if (!job) return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Job not found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
      <Footer />
    </div>
  );

  // Additional check to ensure we have user data
  const canPlaceBid = isFreelancer() && user;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.category || "General"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Unknown"}
                      </div>
                      <Badge variant={job.status === "ACTIVE" ? "success" : "secondary"}>
                        {job.status || "ACTIVE"}
                      </Badge>
                    </div>
                  </div>
                  {canPlaceBid && (
                    <Button onClick={() => navigate("/place-bid/" + (job._id || job.id))}>
                      Place Bid
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Job Description */}
                <div>
                  <h3 className="font-semibold mb-2">Job Description</h3>
                  <p className="text-muted-foreground">{job.description || "No description provided"}</p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-semibold mb-2">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {(job.skills || []).map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                    {(!job.skills || job.skills.length === 0) && (
                      <p className="text-muted-foreground">No skills specified</p>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>Budget: ${job.budget || job.price || "Not specified"} (fixed)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Experience: {job.experienceLevel || "Not specified"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bids Section */}
            <Card>
              <CardHeader>
                <CardTitle>Proposals ({bids.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {bids.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No proposals yet. Be the first to bid!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <div key={bid._id || bid.id} className="border rounded-lg p-4 hover:border-primary/50 transition">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={bid.freelancer?.avatar?.url || bid.freelancer?.avatar} />
                              <AvatarFallback>
                                {bid.freelancer?.username?.substring(0, 2).toUpperCase() || bid.freelancer?.name?.substring(0, 2).toUpperCase() || "FL"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{bid.freelancer?.username || bid.freelancer?.name || "Freelancer"}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Submitted {bid.createdAt ? new Date(bid.createdAt).toLocaleDateString() : "Unknown"}</span>
                                <span>•</span>
                                <Badge variant={bid.status === "accepted" ? "success" : bid.status === "rejected" ? "destructive" : "secondary"}>
                                  {bid.status?.toUpperCase() || "PENDING"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary">${bid.amount || bid.price || 0}</div>
                          </div>
                        </div>
                        {bid.coverLetter && (
                          <p className="text-muted-foreground mb-3">{bid.coverLetter}</p>
                        )}
                        {user && job.client && (job.client._id === user._id || job.client.id === user.id) && bid.status === "pending" && (
                          <Button 
                            onClick={() => handleAcceptBid(bid._id || bid.id)}
                            className="mt-2"
                            size="sm"
                          >
                            Accept Bid
                          </Button>
                        )}
                        {user && bid.status === "accepted" && (
                          <Button 
                            onClick={() => navigate(`/chat/${bid.conversation?._id || job.conversation?._id}`)}
                            className="mt-2"
                            size="sm"
                            variant="outline"
                          >
                            Start Chat
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={job.client?.avatar?.url || job.client?.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {job.client?.username?.substring(0, 2).toUpperCase() || job.client?.name?.substring(0, 2).toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{job.client?.username || job.client?.name || job.client?.fullname || "Unknown Client"}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{job.client?.email || ""}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Verified client on SkillLink platform.
                </p>
              </CardContent>
            </Card>

            {/* Job Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Proposals</span>
                  <span className="font-semibold">{bids.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Bid</span>
                  <span className="font-semibold">
                    ${bids.length > 0 ? Math.round(bids.reduce((acc, bid) => acc + (bid.amount || bid.price || 0), 0) / bids.length) : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posted</span>
                  <span className="font-semibold">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Unknown"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDetails;