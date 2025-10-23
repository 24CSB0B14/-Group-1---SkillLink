import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, Search, Rocket } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-header border-b border-accent/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold text-header-foreground">SkillLink</h1>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#about" className="text-header-foreground/80 hover:text-header-foreground transition">
                About
              </a>
              <a href="#how-it-works" className="text-header-foreground/80 hover:text-header-foreground transition">
                How It Works
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              SKILLLINK: Connect,
              <br />
              <span className="text-primary">Collaborate, Conquer</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Unlock Your Potential. Your Global Network Awaits
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/signup">
                <Button size="lg" className="text-lg px-8">
                  SIGNUP
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  LOGIN
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">1. Post a Project</h4>
              <p className="text-muted-foreground">Clients post projects with detailed requirements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">2. Hire Top Talent</h4>
              <p className="text-muted-foreground">Browse skilled freelancers and review proposals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">3. Get Work Done</h4>
              <p className="text-muted-foreground">Collaborate securely and deliver amazing results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-muted-foreground text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted rounded-full" />
              <span>Featured Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted rounded-full" />
              <span>Right Busy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted rounded-full" />
              <span>Featured Companies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-header py-8">
        <div className="container mx-auto px-4 text-center text-header-foreground/70">
          <p>&copy; 2025 SkillLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
