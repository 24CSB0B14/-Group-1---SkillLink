// pages/FreelancerDirectory.jsx
import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import profileService from "@/services/profile.service";

const FreelancerDirectory = () => {
  const { isClient } = useRole();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [rateFilter, setRateFilter] = useState("all");

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const response = await profileService.getAllFreelancers({ search: searchTerm });
      const data = response.data || [];
      setFreelancers(data);
    } catch (error) {
      toast.error("Failed to load freelancers");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchFreelancers();
  };

  const filteredFreelancers = freelancers.filter(freelancer => {
    const profile = freelancer.freelancerProfile;
    if (!profile) return false;
    
    const matchesExperience = experienceFilter === "all" || profile.experience === experienceFilter;
    const matchesRate = rateFilter === "all" || 
                       (rateFilter === "low" && profile.hourlyRate < 50) ||
                       (rateFilter === "medium" && profile.hourlyRate >= 50 && profile.hourlyRate < 80) ||
                       (rateFilter === "high" && profile.hourlyRate >= 80);

    return matchesExperience && matchesRate;
  });

  const canInvite = isClient() && user;

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

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
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <Button onClick={handleSearch}>
                Search
              </Button>
              
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
                fetchFreelancers();
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFreelancers.map((freelancer) => {
            const profile = freelancer.freelancerProfile || {};
            return (
            <Card key={freelancer._id} className="hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={freelancer.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {freelancer.username?.charAt(0).toUpperCase() || 'F'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{freelancer.username}</h3>
                      <p className="text-sm text-muted-foreground">{profile.title || 'Freelancer'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{profile.rating || 'New'}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {profile.completedProjects || 0} projects
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {profile.bio || 'Professional freelancer ready to work on your project.'}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${profile.hourlyRate || 0}/hr
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {(profile.skills || []).slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {(profile.skills || []).length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{(profile.skills || []).length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link to={`/freelancer/${freelancer._id}`}>View Profile</Link>
                  </Button>
                  {canInvite && (
                    <Button variant="outline">
                      Invite
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )})}
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