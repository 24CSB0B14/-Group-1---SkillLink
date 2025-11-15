import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  Briefcase,
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  MapPin,
  ChevronRight,
  Code,
  Palette,
  BarChart,
  MessageSquare,
  Video,
  Pencil,
} from "lucide-react";

const FreelancerHomepage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-jobs?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Sample job categories
  const categories = [
    { name: "Web Development", icon: Code, count: "2,547" },
    { name: "Graphic Design", icon: Palette, count: "1,832" },
    { name: "Digital Marketing", icon: BarChart, count: "1,243" },
    { name: "Content Writing", icon: Pencil, count: "987" },
    { name: "Video Editing", icon: Video, count: "756" },
    { name: "Social Media", icon: MessageSquare, count: "654" },
  ];

  // Sample featured jobs
  const featuredJobs = [
    {
      id: 1,
      title: "Full Stack Developer for E-commerce Platform",
      client: "TechCorp Inc.",
      rating: 4.9,
      reviews: 127,
      budget: "$3000 - $5000",
      duration: "3-6 months",
      skills: ["React", "Node.js", "MongoDB", "AWS"],
      description: "We're looking for an experienced full stack developer to build a modern e-commerce platform...",
      posted: "2 hours ago",
      proposals: 15,
    },
    {
      id: 2,
      title: "Mobile App UI/UX Designer Needed",
      client: "StartupHub",
      rating: 5.0,
      reviews: 89,
      budget: "$2000 - $3500",
      duration: "1-3 months",
      skills: ["Figma", "UI/UX", "Mobile Design", "Prototyping"],
      description: "Seeking a creative designer to craft beautiful and intuitive mobile app interfaces...",
      posted: "5 hours ago",
      proposals: 23,
    },
    {
      id: 3,
      title: "SEO & Content Marketing Specialist",
      client: "GrowthCo",
      rating: 4.8,
      reviews: 203,
      budget: "$1500 - $2500",
      duration: "Ongoing",
      skills: ["SEO", "Content Strategy", "Google Analytics", "Copywriting"],
      description: "Looking for an SEO expert to help increase our organic traffic and improve content strategy...",
      posted: "1 day ago",
      proposals: 31,
    },
  ];

  // Sample job recommendations
  const recommendedJobs = [
    {
      id: 4,
      title: "WordPress Plugin Development",
      budget: "$800 - $1200",
      skills: ["WordPress", "PHP", "JavaScript"],
      posted: "3 hours ago",
    },
    {
      id: 5,
      title: "Logo Design for Tech Startup",
      budget: "$300 - $600",
      skills: ["Logo Design", "Branding", "Illustrator"],
      posted: "6 hours ago",
    },
    {
      id: 6,
      title: "Python Data Analysis Script",
      budget: "$500 - $800",
      skills: ["Python", "Pandas", "Data Analysis"],
      posted: "12 hours ago",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Next Great Opportunity
            </h1>
            <p className="text-xl text-purple-50 mb-8">
              Browse thousands of projects and connect with clients worldwide
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for jobs (e.g., web development, logo design)..."
                  className="pl-10 h-12 text-gray-900 bg-white border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="bg-white text-purple-700 hover:bg-gray-100 px-8">
                Search
              </Button>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-emerald-100 text-sm">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">5M+</div>
                <div className="text-emerald-100 text-sm">Jobs Posted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">$2B+</div>
                <div className="text-emerald-100 text-sm">Paid to Freelancers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
            <Button variant="ghost" className="text-emerald-600">
              View All Categories <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="cursor-pointer hover:shadow-lg transition border-gray-200"
                onClick={() => navigate(`/search-jobs?category=${encodeURIComponent(category.name)}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <category.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.count} jobs</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
            <Link to="/search-jobs">
              <Button variant="ghost" className="text-emerald-600">
                Browse All Jobs <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Card
                key={job.id}
                className="cursor-pointer hover:shadow-xl transition border-gray-200"
                onClick={() => navigate(`/job-details/${job.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      Featured
                    </Badge>
                    <span className="text-xs text-gray-500">{job.posted}</span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <span className="font-medium text-gray-900">{job.client}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{job.rating}</span>
                      <span className="text-xs text-gray-500">({job.reviews})</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">{job.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{job.duration}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex items-center justify-between w-full text-sm text-gray-500">
                    <span>Proposals: {job.proposals}</span>
                    <Button variant="link" className="text-emerald-600 p-0 h-auto">
                      View Details →
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations & Tips Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recommended Jobs */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="cursor-pointer hover:shadow-md transition"
                    onClick={() => navigate(`/job-details/${job.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="font-semibold text-emerald-600">{job.budget}</span>
                            <span className="text-gray-400">•</span>
                            <span>{job.posted}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {job.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-4">
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tips & Resources */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Freelancer Resources</h2>
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">💡 Pro Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2" />
                    <p className="text-gray-600">
                      Submit personalized proposals highlighting relevant experience
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2" />
                    <p className="text-gray-600">
                      Keep your profile updated with latest skills and portfolio
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2" />
                    <p className="text-gray-600">
                      Respond to client messages within 24 hours
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🚀 Boost Your Success</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-between">
                    Complete Profile
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    Take Skill Tests
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    Upgrade to Pro
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-xl text-purple-50 mb-8 max-w-2xl mx-auto">
            Complete your profile and start applying to jobs that match your skills
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-gray-100"
              onClick={() => navigate("/edit-profile")}
            >
              Complete Profile
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/search-jobs")}
            >
              Browse All Jobs
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FreelancerHomepage;