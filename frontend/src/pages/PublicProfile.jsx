// pages/PublicProfile.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Briefcase, Calendar, DollarSign, Download, MessageCircle } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/context/AuthContext";

const PublicProfile = () => {
  const { id } = useParams();
  const { isClient } = useRole();
  const { user } = useAuth();
  const [freelancer, setFreelancer] = useState(null);

  useEffect(() => {
    // Simulate API call
    const mockFreelancer = {
      id: 1,
      name: "Sarah Chen",
      title: "Senior UI/UX Designer",
      avatar: "",
      rating: 4.9,
      totalReviews: 47,
      completedProjects: 52,
      location: "San Francisco, CA",
      hourlyRate: 85,
      memberSince: "2023",
      skills: ["Figma", "UI/UX Design", "Prototyping", "User Research", "Mobile Design", "Web Design"],
      bio: "Senior UI/UX designer with 8+ years of experience specializing in mobile and web applications. Passionate about creating intuitive, user-centered designs that drive business results. I've worked with startups and Fortune 500 companies across fintech, e-commerce, and healthcare industries.",
      portfolio: [
        {
          id: 1,
          title: "Banking Mobile App Redesign",
          description: "Complete redesign of a banking mobile application focusing on user experience and accessibility.",
          image: "",
          tags: ["Mobile", "Fintech", "UI/UX"]
        },
        {
          id: 2,
          title: "E-commerce Dashboard",
          description: "Analytics dashboard for e-commerce merchants with real-time data visualization.",
          image: "",
          tags: ["Web", "Dashboard", "Data Visualization"]
        }
      ],
      workHistory: [
        {
          company: "Design Studio Inc.",
          position: "Lead UI/UX Designer",
          period: "2022 - Present",
          description: "Leading design team for client projects across various industries."
        },
        {
          company: "Tech Solutions LLC",
          position: "Senior Designer",
          period: "2020 - 2022",
          description: "Designed user interfaces for web and mobile applications."
        }
      ],
      reviews: [
        {
          id: 1,
          client: "John Smith",
          rating: 5,
          comment: "Sarah delivered exceptional work on our mobile app redesign. Her attention to detail and user experience focus was outstanding.",
          date: "2025-01-10",
          project: "Mobile App UI/UX"
        },
        {
          id: 2,
          client: "Emma Wilson",
          rating: 5,
          comment: "Professional, creative, and great communicator. Would definitely work with Sarah again!",
          date: "2024-12-15",
          project: "Website Redesign"
        }
      ]
    };

    setFreelancer(mockFreelancer);
  }, [id]);

  if (!freelancer) return <div>Loading...</div>;

  // Additional check to ensure we have user data
  const canContact = isClient() && user;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="w-24 h-24">
                <AvatarImage src={freelancer.avatar} />
                <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                  {freelancer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{freelancer.name}</h1>
                    <p className="text-xl text-muted-foreground mt-1">{freelancer.title}</p>
                  </div>
                  {canContact && (
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button>
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
                      <div className="font-semibold">{freelancer.rating}</div>
                      <div className="text-sm text-muted-foreground">{freelancer.totalReviews} reviews</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{freelancer.completedProjects}</div>
                      <div className="text-sm text-muted-foreground">Projects</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">${freelancer.hourlyRate}/hr</div>
                      <div className="text-sm text-muted-foreground">Rate</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{freelancer.memberSince}</div>
                      <div className="text-sm text-muted-foreground">Member since</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {freelancer.location}
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
                  {freelancer.bio}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {freelancer.portfolio.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <Briefcase className="w-12 h-12 text-muted-foreground opacity-50" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {freelancer.workHistory.map((job, index) => (
                  <div key={index} className="flex gap-4 pb-6 border-b last:border-b-0 last:pb-0 last:mb-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{job.position}</h3>
                      <p className="text-muted-foreground">{job.company}</p>
                      <p className="text-sm text-muted-foreground mb-2">{job.period}</p>
                      <p className="text-muted-foreground">{job.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="space-y-4">
              {freelancer.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{review.client}</h4>
                        <p className="text-sm text-muted-foreground">{review.project}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{review.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">{review.comment}</p>
                    <p className="text-sm text-muted-foreground">Posted on {review.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PublicProfile;