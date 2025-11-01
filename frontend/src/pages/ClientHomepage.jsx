import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  Star,
  MapPin,
  Verified,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  ChevronRight,
  Code,
  Palette,
  BarChart,
  MessageSquare,
  Video,
  Pencil,
} from "lucide-react";

const ClientHomepage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/freelancers?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Sample categories
  const categories = [
    { name: "Web Development", icon: Code, freelancers: "12,547" },
    { name: "Graphic Design", icon: Palette, freelancers: "8,832" },
    { name: "Digital Marketing", icon: BarChart, freelancers: "6,243" },
    { name: "Content Writing", icon: Pencil, freelancers: "5,987" },
    { name: "Video Editing", icon: Video, freelancers: "4,756" },
    { name: "Social Media", icon: MessageSquare, freelancers: "3,654" },
  ];

  // Sample top freelancers
  const topFreelancers = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Full Stack Developer",
      rating: 5.0,
      reviews: 243,
      hourlyRate: "$85",
      avatar: null,
      skills: ["React", "Node.js", "Python", "AWS"],
      completedJobs: 187,
      description: "Senior developer with 8+ years building scalable web applications for startups and enterprises...",
      location: "United States",
      topRated: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "UI/UX Designer & Brand Strategist",
      rating: 4.9,
      reviews: 156,
      hourlyRate: "$70",
      avatar: null,
      skills: ["Figma", "Adobe XD", "Branding", "User Research"],
      completedJobs: 134,
      description: "Award-winning designer creating beautiful, user-centered experiences for digital products...",
      location: "Canada",
      topRated: true,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "Digital Marketing Expert",
      rating: 5.0,
      reviews: 198,
      hourlyRate: "$65",
      avatar: null,
      skills: ["SEO", "Google Ads", "Content Marketing", "Analytics"],
      completedJobs: 211,
      description: "Helping businesses grow through data-driven marketing strategies and conversion optimization...",
      location: "United Kingdom",
      topRated: true,
    },
  ];

  // Sample featured freelancers
  const featuredFreelancers = [
    {
      id: 4,
      name: "David Kim",
      title: "Mobile App Developer",
      rating: 4.8,
      hourlyRate: "$75",
      skills: ["React Native", "iOS", "Android"],
    },
    {
      id: 5,
      name: "Lisa Anderson",
      title: "Content Writer & Strategist",
      rating: 4.9,
      hourlyRate: "$45",
      skills: ["Copywriting", "SEO", "Blog Posts"],
    },
    {
      id: 6,
      name: "James Wilson",
      title: "Data Scientist",
      rating: 5.0,
      hourlyRate: "$90",
      skills: ["Python", "Machine Learning", "SQL"],
    },
  ];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hire Expert Freelancers for Any Job
            </h1>
            <p className="text-xl text-purple-50 mb-8">
              Connect with talented professionals ready to bring your vision to life
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for freelancers (e.g., React developer, logo designer)..."
                  className="pl-10 h-12 text-gray-900 bg-white border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="bg-white text-purple-700 hover:bg-gray-100 px-8">
                Search
              </Button>
            </form>

            {/* Quick Actions - Removed as requested */}
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-emerald-100 text-sm">Top Freelancers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10M+</div>
                <div className="text-emerald-100 text-sm">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-emerald-100 text-sm">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Browse Talent by Category</h2>
            <Button variant="ghost" className="text-emerald-600">
              View All Categories <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="cursor-pointer hover:shadow-lg transition border-gray-200"
                onClick={() => navigate(`/freelancers?category=${encodeURIComponent(category.name)}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <category.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.freelancers} freelancers</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Freelancers */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Top Rated Freelancers</h2>
              <p className="text-gray-600 mt-1">Handpicked professionals with proven track records</p>
            </div>
            <Link to="/freelancers">
              <Button variant="ghost" className="text-emerald-600">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topFreelancers.map((freelancer) => (
              <Card
                key={freelancer.id}
                className="cursor-pointer hover:shadow-xl transition border-gray-200"
                onClick={() => navigate(`/freelancer-profile/${freelancer.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                      <AvatarFallback className="bg-purple-100 text-purple-700 text-lg">
                        {getInitials(freelancer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {freelancer.name}
                            {freelancer.topRated && (
                              <Verified className="h-4 w-4 text-emerald-600" />
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {freelancer.title}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-sm">{freelancer.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">({freelancer.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {freelancer.description}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Hourly Rate</span>
                      <span className="font-bold text-purple-600 text-lg">
                        {freelancer.hourlyRate}/hr
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Jobs Completed</span>
                      <span className="font-semibold">{freelancer.completedJobs}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{freelancer.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {freelancer.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {freelancer.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{freelancer.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Hire on SkillLink</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your project done in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Post a Job</h3>
              <p className="text-gray-600 text-sm">
                Tell us about your project and what skills you need
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Review Proposals</h3>
              <p className="text-gray-600 text-sm">
                Get proposals from talented freelancers within hours
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Hire & Pay</h3>
              <p className="text-gray-600 text-sm">
                Choose the best fit and fund the project securely
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Results</h3>
              <p className="text-gray-600 text-sm">
                Collaborate and receive high-quality deliverables
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 px-8"
              onClick={() => navigate("/post-job")}
            >
              Post Your First Job - It's Free
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Freelancers Carousel */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">More Top Talent</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredFreelancers.map((freelancer) => (
              <Card
                key={freelancer.id}
                className="cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/freelancer-profile/${freelancer.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {getInitials(freelancer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{freelancer.name}</h3>
                      <p className="text-sm text-gray-600">{freelancer.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{freelancer.rating}</span>
                    </div>
                    <span className="font-bold text-purple-600">{freelancer.hourlyRate}/hr</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Leading Companies</h2>
            <p className="text-lg text-gray-600">See what our clients say about working with SkillLink</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "SkillLink helped us find the perfect developer for our project. The quality of talent is exceptional!"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gray-200">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-sm text-gray-500">CEO, TechStartup</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The escrow system gives us peace of mind. We've completed 10+ projects successfully!"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gray-200">SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Sarah Miller</p>
                    <p className="text-sm text-gray-500">Marketing Director</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Fast, reliable, and professional. SkillLink is our go-to platform for hiring freelancers."
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gray-200">RJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Robert Johnson</p>
                    <p className="text-sm text-gray-500">Product Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-purple-50 mb-8 max-w-2xl mx-auto">
            Post your job today and get proposals from qualified freelancers within hours
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-700 hover:bg-gray-100 px-8"
            onClick={() => navigate("/post-job")}
          >
            Post a Job - It's Free
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ClientHomepage;