// pages/TestForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import authService from "@/services/auth.service";

const TestForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authService.forgotPassword({ email });
      
      // Check if we're in development and have a reset token in the response
      if (response.data && response.data.resetToken) {
        setResetToken(response.data.resetToken);
        toast.success(`Password reset token (Development mode): ${response.data.resetToken}`);
      } else {
        toast.success("Password reset instructions sent to your email!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to send reset instructions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetToken) {
      toast.error("Please enter a reset token");
      return;
    }
    
    setLoading(true);
    
    try {
      await authService.resetPassword({ resetToken, newPassword: "NewPassword123!" });
      toast.success("Password reset successfully!");
      setResetToken("");
    } catch (error) {
      toast.error(error.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
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
          <CardTitle className="text-2xl">Test Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or test with token
                </span>
              </div>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetToken">Reset Token</Label>
                <Input
                  id="resetToken"
                  type="text"
                  placeholder="Enter reset token"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>

            <div className="text-center">
              <Link to="/login" className="text-primary hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestForgotPassword;