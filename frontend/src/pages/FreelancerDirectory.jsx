// pages/FreelancerDirectory.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MapPin, Briefcase, DollarSign } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/context/AuthContext";

const FreelancerDirectory = () => {
  const { isClient } = useRole();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [rateFilter, setRateFilter] = useState("all");

  const freelancers = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Senior UI/UX Designer",
      avatar: "",
      rating: 4.9,
      completedProjects: 47,
      skills: ["Figma", "UI/UX Design", "Prototyping", "User Research"],
      hourlyRate: 85,
      location: "San Francisco, CA",
      experience: "expert",
      bio: "Specialized in mobile app design with 8+ years of experience in fintech and e-commerce."
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      title: "Full-Stack Developer",
      avatar: "",
      rating: 4.7,
      completedProjects: 32,
      skills: ["React", "Node.js", "Python", "MongoDB"],
      hourlyRate: 75,
      location: "Austin, TX",
      experience: "expert",
      bio: "Passionate about building scalable web applications with modern technologies."
    },
    {
      id: 3,
      name: "Emily Watson",
      title: "Content Writer & SEO Specialist",
      avatar: "",
      rating: 4.8,
      completedProjects: 28,
      skills: ["Content Writing", "SEO", "Blogging", "Copywriting"],
      hourlyRate: 45,
      location: "Remote",
      experience: "intermediate",
      bio: "Creating engaging content that ranks well and converts readers into customers."
    }
  ];

  const skills = ["React", "Node.js", "UI/UX Design", "Figma", "Python", "Content Writing", "SEO", "Mobile Design"];

  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesExperience = experienceFilter === "all" || freelancer.experience === experienceFilter;
    const matchesRate = rateFilter === "all" || 
                       (rateFilter === "low" && freelancer.hourlyRate < 50) ||
                       (rateFilter === "medium" && freelancer.hourlyRate >= 50 && freelancer.hourlyRate < 80) ||
                       (rateFilter === "high" && freelancer.hourlyRate >= 80);

    return matchesSearch && matchesExperience && matchesRate;
  });

  // Additional check to ensure we have user data
  const canInvite = isClient() && user;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Find Freelancers</h1>
            <p className="text-muted-foreground mt-2">
              Browse skilled professionals for your projects
            </p>
          </div>
          {canInvite && (
            <Button asChild>
              <Link to="/post-job">Post a Job</Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search freelancers..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>

              <Select value={rateFilter} onValueChange={setRateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Hourly Rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Rate</SelectItem>
                  <SelectItem value="low">Under $50/hr</SelectItem>
                  <SelectItem value="medium">$50 - $80/hr</SelectItem>
                  <SelectItem value="high">Over $80/hr</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setExperienceFilter("all");
                setRateFilter("all");
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFreelancers.map((freelancer) => (
            <Card key={freelancer.id} className="hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={freelancer.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {freelancer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{freelancer.name}</h3>
                      <p className="text-sm text-muted-foreground">{freelancer.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{freelancer.rating}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {freelancer.completedProjects} projects
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {freelancer.bio}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {freelancer.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${freelancer.hourlyRate}/hr
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {freelancer.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {freelancer.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{freelancer.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link to={`/freelancer-profile/${freelancer.id}`}>
                      View Profile
                    </Link>
                  </Button>
                  {canInvite && (
                    <Button variant="outline" asChild>
                      <Link to={`/invite-freelancer/${freelancer.id}`}>
                        Invite
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFreelancers.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No freelancers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all freelancers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDirectory;