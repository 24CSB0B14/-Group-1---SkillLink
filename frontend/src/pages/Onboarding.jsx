import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("skilllink_user") || "{}");
  const isFreelancer = storedUser.role === "freelancer";

  const [profile, setProfile] = useState({
    displayName: storedUser.name || "",
    bio: "",
    companyName: "",
    skills: [],
    portfolioLinks: [""],
    hourlyRate: "",
    experience: "",
  });

  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
  };

  const addPortfolioLink = () => {
    setProfile({ ...profile, portfolioLinks: [...profile.portfolioLinks, ""] });
  };

  const updatePortfolioLink = (index, value) => {
    const newLinks = [...profile.portfolioLinks];
    newLinks[index] = value;
    setProfile({ ...profile, portfolioLinks: newLinks });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user profile in localStorage
    const updatedUser = {
      ...storedUser,
      profile,
      wallet: { balance: 0 },
    };
    localStorage.setItem("skilllink_user", JSON.stringify(updatedUser));
    
    toast.success("Profile setup complete!");
    
    // Redirect to appropriate dashboard
    if (isFreelancer) {
      navigate("/freelancer-dashboard");
    } else {
      navigate("/client-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-accent/90 to-header p-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">S</span>
              </div>
              <CardTitle className="text-2xl text-primary">SkillLink</CardTitle>
            </div>
            <CardTitle className="text-2xl">Set Up Your Professional Profile</CardTitle>
            <p className="text-muted-foreground">Step 1 of 1 (Profile)</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="displayName">
                    {isFreelancer ? "Full Name" : "Name/Company Name"}
                  </Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    required
                  />
                </div>

                {!isFreelancer && (
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name (Optional)</Label>
                    <Input
                      id="companyName"
                      value={profile.companyName}
                      onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="bio">About</Label>
                  <Textarea
                    id="bio"
                    placeholder={
                      isFreelancer
                        ? "Tell clients about your expertise and experience..."
                        : "Tell freelancers about your company and project needs..."
                    }
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              {/* Freelancer-specific fields */}
              {isFreelancer && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Expertise</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <div className="flex gap-2">
                        <Input
                          id="skills"
                          placeholder="Add a skill (e.g., Web Development)"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        />
                        <Button type="button" onClick={addSkill} size="icon">
                          <Plus size={20} />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="gap-1">
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X size={14} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Portfolio Links</Label>
                      {profile.portfolioLinks.map((link, index) => (
                        <Input
                          key={index}
                          placeholder="https://your-portfolio-link.com"
                          value={link}
                          onChange={(e) => updatePortfolioLink(index, e.target.value)}
                        />
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addPortfolioLink}
                        className="w-full"
                      >
                        + Add Another Link
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            id="hourlyRate"
                            type="number"
                            className="pl-7"
                            placeholder="75.00"
                            value={profile.hourlyRate}
                            onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          type="number"
                          placeholder="5"
                          value={profile.experience}
                          onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <p className="text-sm text-success-foreground/90">
                      Your secure <span className="font-semibold">$0.00</span> SkillLink Wallet has been automatically created.
                    </p>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" size="lg">
                Save & Go to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;