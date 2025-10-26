// pages/EditJob.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import jobService from "@/services/job.service";
import { useRole } from "@/hooks/useRole";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isClient } = useRole();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    type: "OPEN",
    skills: "",
    experienceLevel: "intermediate",
    deadline: ""
  });

  const categories = [
    "Web Development",
    "Mobile Development", 
    "UI/UX Design",
    "Writing & Content",
    "Digital Marketing",
    "Data Science",
    "Video & Animation",
    "Music & Audio",
    "Programming & Tech",
    "Business"
  ];

  useEffect(() => {
    if (!isClient()) {
      navigate("/search-jobs");
      return;
    }
    
    fetchJobDetails();
  }, [id, isClient, navigate]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(id);
      const jobData = response.data || response;
      
      setFormData({
        title: jobData.title || "",
        description: jobData.description || "",
        budget: jobData.budget || "",
        category: jobData.category || "",
        type: jobData.type || "OPEN",
        skills: jobData.skills ? jobData.skills.join(", ") : "",
        experienceLevel: jobData.experienceLevel || "intermediate",
        deadline: jobData.deadline ? new Date(jobData.deadline).toISOString().split('T')[0] : ""
      });
    } catch (error) {
      console.error("Failed to fetch job:", error);
      toast.error("Failed to load job details");
      navigate("/my-jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const jobData = {
        ...formData,
        skills: formData.skills.split(",").map(skill => skill.trim()).filter(skill => skill)
      };
      
      await jobService.updateJob(id, jobData);
      toast.success("Job updated successfully");
      navigate("/my-jobs");
    } catch (error) {
      console.error("Failed to update job:", error);
      toast.error("Failed to update job");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-12">
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Edit Job</h1>
            <p className="text-muted-foreground mt-2">
              Update your job posting
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/my-jobs")}>
            Back to My Jobs
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Senior React Developer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select name="category" value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ($) *</Label>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    min="10"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g., 5000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Job Type *</Label>
                  <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open Bidding</SelectItem>
                      <SelectItem value="DIRECT">Direct Hire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select name="experienceLevel" value={formData.experienceLevel} onValueChange={(value) => handleSelectChange("experienceLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline (Optional)</Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated) *</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., React, Node.js, MongoDB"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the job in detail..."
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Updating..." : "Update Job"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/my-jobs")}
                  disabled={submitting}
                >
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

export default EditJob;