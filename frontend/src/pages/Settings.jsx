// pages/Settings.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Save, Bell, Shield, User, CreditCard, Globe } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Product manager with 5+ years of experience in tech startups.",
    company: "Tech Innovations Inc.",
    website: "https://techinnovations.com"
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    bidAlerts: true,
    messageAlerts: true,
    paymentAlerts: true,
    marketingEmails: false
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30
  });

  const handleSave = (section) => {
    // Simulate saving settings
    console.log(`Saving ${section} settings:`, {
      profile,
      notifications,
      security
    }[section]);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
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
                  <Button onClick={() => handleSave("profile")}>
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
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [key]: checked }))}
                    />
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <Button onClick={() => handleSave("notifications")}>
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
                  <div className="flex items-center gap-3">
                    <Badge variant={security.twoFactorAuth ? "success" : "secondary"}>
                      {security.twoFactorAuth ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactorAuth: checked }))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Login Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified of new sign-ins from unknown devices
                    </div>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, loginAlerts: checked }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Session Timeout</label>
                  <Select
                    value={security.sessionTimeout.toString()}
                    onValueChange={(value) => setSecurity(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => handleSave("security")}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Security Settings
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
                    <Badge variant="outline">Client Account</Badge>
                  </div>
                  <div className="text-2xl font-bold">$8,450.75</div>
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