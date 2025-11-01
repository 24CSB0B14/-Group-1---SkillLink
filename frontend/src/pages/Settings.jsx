// pages/Settings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Save, Bell, Shield, User, CreditCard, Globe, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import authService from "@/services/auth.service";
import profileService from "@/services/profile.service";

const Settings = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Load initial state from localStorage or defaults
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('settings_profile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: user?.username || "",
      email: user?.email || "",
      phone: "",
      bio: "",
      company: "",
      website: ""
    };
  });

  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('settings_notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : {
      emailNotifications: true,
      bidAlerts: true,
      messageAlerts: true,
      paymentAlerts: true,
      marketingEmails: false
    };
  });

  const [security, setSecurity] = useState(() => {
    const savedSecurity = localStorage.getItem('settings_security');
    return savedSecurity ? JSON.parse(savedSecurity) : {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: 30
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('settings_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('settings_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('settings_security', JSON.stringify(security));
  }, [security]);

  const handleSaveProfile = async () => {
    try {
      // Save profile data to backend
      const profileData = {
        bio: profile.bio,
        phone: profile.phone,
        company: profile.company,
        website: profile.website
      };
      
      const response = await profileService.updateUserProfile(profileData);
      toast.success("Profile settings saved successfully!");
      
      // Also save to localStorage for immediate persistence
      localStorage.setItem('settings_profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile settings:', error);
      if (error.response?.data?.message) {
        toast.error(`Failed to save profile settings: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to save profile settings: ${error.message}`);
      } else {
        toast.error("Failed to save profile settings. Please try again later.");
      }
    }
  };

  const handleSaveNotifications = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('settings_notifications', JSON.stringify(notifications));
      toast.success("Notification settings saved successfully!");
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error("Failed to save notification settings. Please try again later.");
    }
  };

  const handleSaveSecurity = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('settings_security', JSON.stringify(security));
      toast.success("Security settings saved successfully!");
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast.error("Failed to save security settings. Please try again later.");
    }
  };

  const handleSave = async (section) => {
    switch (section) {
      case "profile":
        await handleSaveProfile();
        break;
      case "notifications":
        await handleSaveNotifications();
        break;
      case "security":
        await handleSaveSecurity();
        break;
      default:
        toast.success("Settings saved successfully!");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.")) {
      return;
    }

    try {
      // Use the authService to delete the account
      await authService.deleteAccount();
      toast.success("Account deleted successfully");
      await logout();
      navigate("/");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(`Failed to delete account: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <User className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and how others see you on the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone</label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Company</label>
                    <Input
                      value={profile.company}
                      onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Website</label>
                  <Input
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Bio</label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getNotificationDescription(key)}
                      </div>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => {
                        try {
                          setNotifications(prev => ({ ...prev, [key]: checked }));
                        } catch (error) {
                          console.error('Error updating notification setting:', error);
                          toast.error("Failed to update notification setting");
                        }
                      }}
                    />
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveNotifications}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </div>
                  </div>
                  <Switch
                    checked={security.twoFactorAuth}
                    onCheckedChange={(checked) => {
                      try {
                        setSecurity(prev => ({ ...prev, twoFactorAuth: checked }));
                      } catch (error) {
                        console.error('Error updating security setting:', error);
                        toast.error("Failed to update security setting");
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Login Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified when someone logs into your account
                    </div>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => {
                      try {
                        setSecurity(prev => ({ ...prev, loginAlerts: checked }));
                      } catch (error) {
                        console.error('Error updating security setting:', error);
                        toast.error("Failed to update security setting");
                      }
                    }}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveSecurity}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delete Account Section */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Delete Account</CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Delete Your Account</div>
                    <div className="text-sm text-muted-foreground">
                      This action cannot be undone. All your data will be permanently removed.
                    </div>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Settings */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Payments</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Current Balance</div>
                    <Badge variant="outline">Account</Badge>
                  </div>
                  <div className="text-2xl font-bold">$0.00</div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm">Add Funds</Button>
                    <Button variant="outline" size="sm">Withdraw</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Payment Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">Visa ending in 4242</div>
                          <div className="text-sm text-muted-foreground">Expires 12/2026</div>
                        </div>
                      </div>
                      <Badge variant="success">Primary</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Helper function for notification descriptions
const getNotificationDescription = (key) => {
  const descriptions = {
    emailNotifications: "Receive notifications via email",
    bidAlerts: "Get alerted when someone bids on your projects",
    messageAlerts: "Notify me about new messages",
    paymentAlerts: "Alert me about payment activities",
    marketingEmails: "Send me marketing emails and updates"
  };
  return descriptions[key] || "Notification preference";
};

export default Settings;