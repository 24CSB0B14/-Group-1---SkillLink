import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Plus, Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import profileService from "@/services/profile.service";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getUserProfile();
      const userData = response.data || response;
      
      // Extract profile data based on user role
      let profileData = {};
      if (userData.role === "freelancer" && userData.freelancerProfile) {
        profileData = userData.freelancerProfile;
      } else if (userData.role === "client" && userData.clientProfile) {
        profileData = userData.clientProfile;
      }
      
      // Merge user and profile data
      setProfile({
        ...profileData,
        displayName: userData.username,
        email: userData.email,
        role: userData.role
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent via-accent/90 to-header flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const isFreelancer = user.role === "freelancer";

  const updateProfileState = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addSkill = () => {
    try {
      if (skillInput.trim() && !(profile.skills || []).includes(skillInput.trim())) {
        updateProfileState({ skills: [...(profile.skills || []), skillInput.trim()] });
        setSkillInput("");
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error("Failed to add skill");
    }
  };

  const removeSkill = (skill) => {
    try {
      updateProfileState({ skills: (profile.skills || []).filter((s) => s !== skill) });
    } catch (error) {
      console.error('Error removing skill:', error);
      toast.error("Failed to remove skill");
    }
  };

  const addPortfolioLink = () => {
    try {
      updateProfileState({ portfolioLinks: [...(profile.portfolioLinks || []), ""] });
    } catch (error) {
      console.error('Error adding portfolio link:', error);
      toast.error("Failed to add portfolio link");
    }
  };

  const updatePortfolioLink = (index, value) => {
    try {
      const newLinks = [...(profile.portfolioLinks || [])];
      newLinks[index] = value;
      updateProfileState({ portfolioLinks: newLinks });
    } catch (error) {
      console.error('Error updating portfolio link:', error);
      toast.error("Failed to update portfolio link");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare profile data for submission
      const profileData = { ...profile };
      
      // Remove fields that shouldn't be sent to backend
      delete profileData.displayName;
      delete profileData.email;
      delete profileData.role;
      
      // Convert skills array to comma-separated string if needed
      if (Array.isArray(profileData.skills)) {
        profileData.skills = profileData.skills.join(', ');
      }
      
      const response = await profileService.updateUserProfile(profileData);
      
      // Update the user context with the new profile data
      const updatedUser = {
        ...user,
        freelancerProfile: isFreelancer ? response.data : user.freelancerProfile,
        clientProfile: !isFreelancer ? response.data : user.clientProfile
      };
      
      setUser(updatedUser);
      
      toast.success("Profile updated successfully!");
      
      if (isFreelancer) {
        navigate("/freelancer-dashboard");
      } else {
        navigate("/client-dashboard");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        toast.error(`Failed to update profile: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to update profile: ${error.message}`);
      } else {
        toast.error("Failed to update profile. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-accent/90 to-header p-4 py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage src={user.avatar?.url || ""} />
                    <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                      {user.username?.[0] || "U"}
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
                  <h3 className="font-semibold text-lg">{user.username || "User"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isFreelancer ? "Freelancer" : "Client"}
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
                      value={user.username || ""}
                      disabled
                    />
                  </div>

                  {!isFreelancer && (
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={profile.companyName || ""}
                        onChange={(e) => updateProfileState({ companyName: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="bio">About</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio || ""}
                      onChange={(e) => updateProfileState({ bio: e.target.value })}
                      rows={4}
                      placeholder="Tell us about yourself..."
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
                          <Button type="button" onClick={addSkill} size="icon" disabled={loading}>
                            <Plus size={20} />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(profile.skills || []).map((skill, index) => (
                            <Badge key={index} className="gap-1">
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-1 hover:text-destructive"
                                disabled={loading}
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
                            onChange={(e) => updateProfileState({ hourlyRate: e.target.value })}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Currency: USD</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Portfolio</h3>
                      {(profile.portfolioLinks || [""]).map((link, index) => (
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
                        disabled={loading}
                      >
                        + Add Another Link
                      </Button>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
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