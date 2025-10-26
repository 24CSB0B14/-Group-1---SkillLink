// pages/PostJob.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, DollarSign, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import jobService from "@/services/job.service";
import { useAuth } from "@/context/AuthContext";

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    budgetType: "fixed",
    deadline: "",
    skills: [],
    newSkill: "",
    category: "",
    experienceLevel: "intermediate"
  });
  const [loading, setLoading] = useState(false);

  // Ensure we have user data
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You must be logged in as a client to post jobs.
          </p>
          <Button onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const addSkill = () => {
    if (formData.newSkill && !formData.skills.includes(formData.newSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill],
        newSkill: ""
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form data before sending
    const title = formData.title?.trim();
    const description = formData.description?.trim();
    const budget = parseFloat(formData.budget);
    const category = formData.category?.trim();
    
    if (!title || title.length < 5) {
      toast.error("Job title must be at least 5 characters long");
      setLoading(false);
      return;
    }
    
    if (!description || description.length < 20) {
      toast.error("Job description must be at least 20 characters long");
      setLoading(false);
      return;
    }
    
    if (!formData.budget || isNaN(budget) || budget < 10) {
      toast.error("Budget must be a valid number and at least $10");
      setLoading(false);
      return;
    }
    
    if (!category) {
      toast.error("Please select a category");
      setLoading(false);
      return;
    }
    
    try {
      // Prepare job data to match backend expectations
      const jobData = {
        title,
        description,
        budget,
        category,
        type: "OPEN", // Required by backend
        skills: Array.isArray(formData.skills) ? formData.skills.filter(skill => skill && skill.trim().length > 0) : [],
        experienceLevel: formData.experienceLevel,
        deadline: formData.deadline
      };

      console.log("Sending job data:", jobData);
      
      const response = await jobService.createJob(jobData);
      console.log("Job posted:", response);
      toast.success("Job posted successfully!");
      navigate("/client-dashboard");
    } catch (error) {
      console.error("Error posting job:", error);
      console.error("Error response:", error.response);
      toast.error(error.message || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Plus className="w-6 h-6 text-primary" />
              Post a New Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="text-sm font-medium mb-2 block">Job Title *</label>
                <Input
                  placeholder="e.g., Senior UI/UX Designer for Mobile App"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">Job Description *</label>
                <Textarea
                  placeholder="Describe the project requirements, goals, and expectations..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              {/* Budget & Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Budget Type</label>
                  <Select value={formData.budgetType} onValueChange={(value) => setFormData(prev => ({ ...prev, budgetType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Budget ($) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="e.g., 5000"
                      className="pl-10"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Deadline & Category */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Deadline</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-dev">Web Development</SelectItem>
                      <SelectItem value="mobile-dev">Mobile Development</SelectItem>
                      <SelectItem value="ui-ux">UI/UX Design</SelectItem>
                      <SelectItem value="writing">Writing & Content</SelectItem>
                      <SelectItem value="marketing">Digital Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="text-sm font-medium mb-2 block">Required Skills</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a skill (e.g., React, Figma)"
                    value={formData.newSkill}
                    onChange={(e) => setFormData(prev => ({ ...prev, newSkill: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="text-sm font-medium mb-2 block">Experience Level</label>
                <Select value={formData.experienceLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" size="lg" className="flex-1" disabled={loading}>
                  {loading ? "Posting Job..." : "Post Job"}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => navigate("/client-dashboard")} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;