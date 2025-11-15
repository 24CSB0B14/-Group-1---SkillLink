import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Briefcase, Calendar, DollarSign, Download, MessageCircle } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import profileService from "@/services/profile.service";
import messageService from "@/services/message.service";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isClient } = useRole();
  const { user } = useAuth();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      fetchProfile();
    } catch (error) {
      console.error('Error initializing profile:', error);
      toast.error("Failed to initialize profile");
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getPublicProfile(id);
      // Handle different response formats
      const data = response.data || response;
      if (data) {
        setFreelancer(data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.data?.message) {
        toast.error(`Failed to load profile: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to load profile: ${error.message}`);
      } else {
        toast.error("Failed to load profile. Please try again later.");
      }
      // Navigate back if profile not found
      if (error.response?.status === 404) {
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    try {
      const response = await messageService.startConversation(freelancer.username);
      navigate(`/chat/${response.data._id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      if (error.response?.data?.message) {
        toast.error(`Failed to start conversation: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to start conversation: ${error.message}`);
      } else {
        toast.error("Failed to start conversation. Please try again later.");
      }
    }
  };

  // Check if freelancer data is available
  if (loading) return <Loading />;
  if (!freelancer) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Header />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
          <p className="text-muted-foreground">The freelancer profile you're looking for doesn't exist.</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  // Safely extract profile data
  const profile = freelancer.freelancerProfile || freelancer.profile || {};
  const canContact = isClient() && user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Header />
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="w-24 h-24">
                <AvatarImage src={freelancer.avatar || freelancer.profilePicture || ''} />
                <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                  {freelancer.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{freelancer.username || 'Unknown User'}</h1>
                    <p className="text-xl text-muted-foreground mt-1">{profile.title || profile.jobTitle || 'Freelancer'}</p>
                  </div>
                  {canContact && (
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button
                        onClick={handleStartChat}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline">
                        Invite to Job
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <div>
                      <div className="font-semibold">{profile.rating || 'New'}</div>
                      <div className="text-sm text-muted-foreground">{profile.totalReviews || 0} reviews</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{profile.completedProjects || 0}</div>
                      <div className="text-sm text-muted-foreground">Projects</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">${profile.hourlyRate || 0}/hr</div>
                      <div className="text-sm text-muted-foreground">Rate</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">
                        {freelancer.createdAt ? new Date(freelancer.createdAt).getFullYear() : 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">Member since</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location || profile.address || 'Remote'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.bio || profile.description || profile.about || 'Professional freelancer ready to work on your next project.'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(profile.skills || profile.expertise || []).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                      {skill}
                    </Badge>
                  ))}
                  {(!profile.skills || !profile.skills.length) && (
                    <p className="text-muted-foreground">No skills listed</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {((profile.portfolio || profile.workSamples || [])?.length > 0) ? (
                (profile.portfolio || profile.workSamples || []).map((project, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="h-48 bg-muted flex items-center justify-center">
                      <Briefcase className="w-12 h-12 text-muted-foreground opacity-50" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{project.title || project.name || 'Project'}</h3>
                      <p className="text-muted-foreground mb-4">{project.description || project.details || 'No description'}</p>
                      <div className="flex flex-wrap gap-1">
                        {(project.tags || project.skills || []).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No portfolio items yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {((profile.experience || profile.workHistory || [])?.length > 0) ? (
                  (profile.experience || profile.workHistory || []).map((job, index) => (
                    <div key={index} className="flex gap-4 pb-6 border-b last:border-b-0 last:pb-0 last:mb-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{job.position || job.title || job.role || 'Position'}</h3>
                        <p className="text-muted-foreground">{job.company || job.organization || 'Company'}</p>
                        <p className="text-sm text-muted-foreground mb-2">{job.period || job.duration || job.date || 'Duration'}</p>
                        <p className="text-muted-foreground">{job.description || job.details || 'No description'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No work experience listed</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="space-y-4">
              {((profile.reviews || profile.feedback || [])?.length > 0) ? (
                (profile.reviews || profile.feedback || []).map((review, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{review.client || review.reviewer || 'Client'}</h4>
                          <p className="text-sm text-muted-foreground">{review.project || review.work || 'Project'}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{review.rating || 5}.0</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{review.comment || review.feedback || 'No comment'}</p>
                      <p className="text-sm text-muted-foreground">Posted on {review.date || review.createdAt || 'N/A'}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No reviews yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default PublicProfile;