import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Plus, Upload } from "lucide-react";
import { toast } from "sonner";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("skilllink_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  const isFreelancer = user.role === "freelancer";
  const profile = user.profile || {};

  const updateProfile = (updates: any) => {
    setUser({
      ...user,
      profile: { ...profile, ...updates },
    });
  };

  const addSkill = () => {
    if (skillInput.trim() && !(profile.skills || []).includes(skillInput.trim())) {
      updateProfile({ skills: [...(profile.skills || []), skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    updateProfile({ skills: profile.skills.filter((s: string) => s !== skill) });
  };

  const addPortfolioLink = () => {
    updateProfile({ portfolioLinks: [...(profile.portfolioLinks || [""]), ""] });
  };

  const updatePortfolioLink = (index: number, value: string) => {
    const newLinks = [...(profile.portfolioLinks || [""])];
    newLinks[index] = value;
    updateProfile({ portfolioLinks: newLinks });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("skilllink_user", JSON.stringify(user));
    toast.success("Profile updated successfully!");
    
    if (isFreelancer) {
      navigate("/freelancer-dashboard");
    } else {
      navigate("/client-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-accent/90 to-header p-4 py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                      {profile.displayName?.[0] || user.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full"
                  >
                    <Upload size={16} />
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{profile.displayName || user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isFreelancer ? "Freelancer" : "Client"} at S.L Planety
                  </p>
                </div>

                {user.wallet && (
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Wallet Balance</p>
                    <p className="text-2xl font-bold text-primary">
                      ${user.wallet.balance?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Edit Your Profile</CardTitle>
              <p className="text-sm text-muted-foreground">Step 2 of 1 (Profile)</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Basic Info</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Name</Label>
                    <Input
                      id="displayName"
                      value={profile.displayName || ""}
                      onChange={(e) => updateProfile({ displayName: e.target.value })}
                    />
                  </div>

                  {!isFreelancer && (
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={profile.companyName || ""}
                        onChange={(e) => updateProfile({ companyName: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="bio">About</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio || ""}
                      onChange={(e) => updateProfile({ bio: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>

                {/* Freelancer-specific fields */}
                {isFreelancer && (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Skills & Rates</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="skills">Skills</Label>
                        <div className="flex gap-2">
                          <Input
                            id="skills"
                            placeholder="Add a skill"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                          />
                          <Button type="button" onClick={addSkill} size="icon">
                            <Plus size={20} />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(profile.skills || []).map((skill: string) => (
                            <Badge key={skill} className="gap-1">
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
                        <Label>Hourly Rate</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            className="pl-7"
                            placeholder="75.00"
                            value={profile.hourlyRate || ""}
                            onChange={(e) => updateProfile({ hourlyRate: e.target.value })}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Currency: USD</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Portfolio</h3>
                      {(profile.portfolioLinks || [""]).map((link: string, index: number) => (
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
                  </>
                )}

                <Button type="submit" className="w-full" size="lg">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
