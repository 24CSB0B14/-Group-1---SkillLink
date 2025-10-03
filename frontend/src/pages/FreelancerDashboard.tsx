import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Briefcase, Wallet, User, TrendingUp, Search } from "lucide-react";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("skilllink_user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role !== "freelancer") {
        navigate("/client-dashboard");
      } else {
        setUser(userData);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  const demoJobs = [
    {
      id: "1",
      title: "Mobile App UI/UX Design",
      client: "Client & Morgan Industries",
      status: "Open",
      statusColor: "bg-success",
      budget: "Hourly",
    },
    {
      id: "2",
      title: "Full-Stack UI/UX Design",
      client: "Client & Morgan Industries",
      status: "Premium",
      statusColor: "bg-warning",
      budget: "Fixed",
    },
    {
      id: "3",
      title: "Full-Stack E-commerce Project",
      client: "Client & Morgan Industries",
      status: "Open",
      statusColor: "bg-success",
      budget: "Premium",
    },
  ];

  return (
    <div className="min-h-screen bg-header">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 min-h-screen bg-header border-r border-header-foreground/10 p-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="font-bold text-primary text-xl">SkillLink</span>
          </div>

          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-header-foreground hover:bg-header-foreground/10"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-header-foreground hover:bg-header-foreground/10"
            >
              <Search size={18} />
              Browse Jobs
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-header-foreground hover:bg-header-foreground/10"
            >
              <Briefcase size={18} />
              Jobs Applied
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-header-foreground hover:bg-header-foreground/10"
            >
              <Wallet size={18} />
              Wallet
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Top Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-header border-header-foreground/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-header-foreground/70">
                    Earnings Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-header-foreground mb-2">
                    ${user.wallet?.balance?.toFixed(2) || "1,780.45"}
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary/50" />
                </CardContent>
              </Card>

              <Card className="bg-header border-header-foreground/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-header-foreground/70">
                    Active Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-5xl font-bold text-header-foreground">8</div>
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-header-foreground/10"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(8 / 10) * 226} 226`}
                          className="text-primary"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-header-foreground">
                        8
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button className="gap-2" size="lg">
              <Search size={20} />
              Explore New Job Opportunities
            </Button>

            {/* Recent Job Proposals */}
            <Card className="bg-header border-header-foreground/10">
              <CardHeader>
                <CardTitle className="text-header-foreground">Recent Job Proposals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center gap-4 p-4 bg-header-foreground/5 rounded-lg border border-header-foreground/10 hover:border-primary/50 transition"
                  >
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        C
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h4 className="font-semibold text-header-foreground mb-1">{job.title}</h4>
                      <p className="text-sm text-header-foreground/70">{job.client}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`${job.statusColor} text-white border-0`}
                      >
                        {job.status}
                      </Badge>
                      {job.budget === "Premium" && (
                        <Badge className="bg-warning text-white border-0">Premium</Badge>
                      )}
                    </div>
                  </div>
                ))}

                {demoJobs.length === 0 && (
                  <div className="text-center py-8 text-header-foreground/50">
                    <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No job applications yet. Browse jobs to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
