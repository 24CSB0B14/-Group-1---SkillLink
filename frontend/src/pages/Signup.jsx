import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Wrench } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store user data in localStorage for demo purposes
    localStorage.setItem("skilllink_user", JSON.stringify(formData));
    
    toast.success("Account created successfully!");
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">S</span>
            </div>
            <CardTitle className="text-2xl text-primary">SkillLink</CardTitle>
          </div>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="text-success">✓</span> Strong Password
              </p>
            </div>

            <div className="space-y-3">
              <Label>Choose Your Role</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "client" })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === "client"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      formData.role === "client" ? "bg-primary/10" : "bg-muted"
                    }`}>
                      <Briefcase className={formData.role === "client" ? "text-primary" : "text-muted-foreground"} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">I am a Client</p>
                      <p className="text-xs text-muted-foreground">(Need Work Done)</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "freelancer" })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === "freelancer"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      formData.role === "freelancer" ? "bg-primary/10" : "bg-muted"
                    }`}>
                      <Wrench className={formData.role === "freelancer" ? "text-primary" : "text-muted-foreground"} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">Freelancer</p>
                      <p className="text-xs text-muted-foreground">(Offer Services)</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create My SkillLink Account
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              You're almost there! Next, set up your profile.
            </p>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;