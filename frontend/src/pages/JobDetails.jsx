// pages/JobDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, Clock, MapPin, User, Briefcase } from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    // Simulate API call
    const mockJob = {
      id: "SKL-001",
      title: "Senior UI/UX Designer for Mobile App",
      description: "We're looking for an experienced UI/UX designer to redesign our mobile banking application. The ideal candidate should have experience in financial apps and a strong portfolio of mobile design work.",
      budget: 5000,
      budgetType: "fixed",
      deadline: "2025-02-15",
      skills: ["Figma", "UI/UX Design", "Mobile Design", "Prototyping", "User Research"],
      category: "UI/UX Design",
      experienceLevel: "expert",
      client: {
        name: "Tech Innovations Inc.",
        rating: 4.8,
        completedProjects: 24
      },
      status: "open",
      postedDate: "2025-01-10"
    };

    const mockBids = [
      {
        id: 1,
        freelancer: {
          name: "Sarah Chen",
          avatar: "",
          rating: 4.9,
          skills: ["UI/UX Design", "Figma", "Prototyping"]
        },
        amount: 4500,
        timeline: "3 weeks",
        proposal: "I have extensive experience in financial app design and can deliver a modern, user-friendly interface.",
        submittedDate: "2025-01-11"
      },
      {
        id: 2,
        freelancer: {
          name: "Mike Rodriguez",
          avatar: "",
          rating: 4.7,
          skills: ["Mobile Design", "UI/UX", "Adobe XD"]
        },
        amount: 5200,
        timeline: "4 weeks",
        proposal: "I specialize in mobile banking apps and can provide research-backed design solutions.",
        submittedDate: "2025-01-12"
      }
    ];

    setJob(mockJob);
    setBids(mockBids);
  }, [id]);

  if (!job) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background py-8">
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
                        {job.category}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Posted {job.postedDate}
                      </div>
                      <Badge variant={job.status === "open" ? "success" : "secondary"}>
                        {job.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <Button onClick={() => navigate("/place-bid/" + job.id)}>
                    Place Bid
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Job Description */}
                <div>
                  <h3 className="font-semibold mb-2">Job Description</h3>
                  <p className="text-muted-foreground">{job.description}</p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-semibold mb-2">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Job Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>Budget: ${job.budget} ({job.budgetType})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Deadline: {job.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Experience: {job.experienceLevel}</span>
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
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div key={bid.id} className="border rounded-lg p-4 hover:border-primary/50 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={bid.freelancer.avatar} />
                            <AvatarFallback>
                              {bid.freelancer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{bid.freelancer.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>⭐ {bid.freelancer.rating}</span>
                              <span>•</span>
                              <span>Submitted {bid.submittedDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">${bid.amount}</div>
                          <div className="text-sm text-muted-foreground">{bid.timeline}</div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{bid.proposal}</p>
                      <div className="flex flex-wrap gap-1">
                        {bid.freelancer.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {job.client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{job.client.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>⭐ {job.client.rating}</span>
                      <span>•</span>
                      <span>{job.client.completedProjects} projects</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View Client Profile
                </Button>
              </CardContent>
            </Card>

            {/* Job Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  Place Bid
                </Button>
                <Button variant="outline" className="w-full">
                  Save Job
                </Button>
                <Button variant="outline" className="w-full">
                  Share Job
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;