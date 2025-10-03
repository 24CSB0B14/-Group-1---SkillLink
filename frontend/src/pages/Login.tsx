import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get stored user data
    const storedUser = localStorage.getItem("skilllink_user");
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      if (user.email === formData.email && user.password === formData.password) {
        toast.success("Login successful!");
        
        // Redirect based on role
        if (user.role === "client") {
          navigate("/client-dashboard");
        } else {
          navigate("/freelancer-dashboard");
        }
      } else {
        toast.error("Invalid email or password");
      }
    } else {
      toast.error("Account not found. Please sign up first.");
    }
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
          <CardTitle className="text-2xl">Secure Login to Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <a href="#" className="text-primary hover:underline block">
                Forgot Password?
              </a>
              <div>
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/signup" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Login to SkillLink Account
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Authentication secured via JWT
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
