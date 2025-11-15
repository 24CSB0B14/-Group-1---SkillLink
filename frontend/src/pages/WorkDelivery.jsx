// pages/WorkDelivery.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Link, CheckCircle, Clock } from "lucide-react";

const WorkDelivery = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    files: [],
    links: [""],
    milestone: "final"
  });

  const addLink = () => {
    try {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, ""]
      }));
    } catch (error) {
      console.error('Error adding link:', error);
      toast.error("Failed to add link");
    }
  };

  const updateLink = (index, value) => {
    try {
      const newLinks = [...formData.links];
      newLinks[index] = value;
      setFormData(prev => ({ ...prev, links: newLinks }));
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error("Failed to update link");
    }
  };

  const removeLink = (index) => {
    try {
      setFormData(prev => ({
        ...prev,
        links: prev.links.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error removing link:', error);
      toast.error("Failed to remove link");
    }
  };

  const handleFileUpload = (e) => {
    try {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }));
    } catch (error) {
      console.error('Error handling file upload:', error);
      toast.error("Failed to process file upload");
    }
  };

  const removeFile = (index) => {
    try {
      setFormData(prev => ({
        ...prev,
        files: prev.files.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error("Failed to remove file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // In a real implementation, you would submit the work data to the backend
      // For now, we'll just show a success message and navigate back
      toast.success("Work delivered successfully!");
      navigate(-1);
    } catch (error) {
      console.error('Error submitting work:', error);
      if (error.response?.data?.message) {
        toast.error(`Failed to submit work: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed to submit work: ${error.message}`);
      } else {
        toast.error("Failed to submit work. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Upload className="w-6 h-6 text-primary" />
              Deliver Work
            </CardTitle>
            <p className="text-muted-foreground">
              Submit your completed work for client review
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Info - This would be populated with real data in a full implementation */}
              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-2">Project Information</h4>
                <p className="text-sm text-muted-foreground">Project details would be loaded here</p>
              </div>

              {/* Work Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Work Description *
                </label>
                <Textarea
                  placeholder="Describe what you've delivered, include any important notes for the client..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Attach Files
                </label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag & drop files here or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    Select Files
                  </Button>
                </div>
                
                {/* File List */}
                {formData.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Project Links
                </label>
                <div className="space-y-2">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1">
                        <Link className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input
                          type="url"
                          placeholder="https://example.com"
                          className="flex-1 pl-10 pr-10 py-2 border rounded-md"
                          value={link}
                          onChange={(e) => updateLink(index, e.target.value)}
                        />
                      </div>
                      {formData.links.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeLink(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addLink}>
                    Add Another Link
                  </Button>
                </div>
              </div>

              {/* Milestone Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Delivery Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["milestone-1", "milestone-2", "milestone-3", "final"].map((type) => (
                    <div
                      key={type}
                      className={`border rounded-lg p-3 cursor-pointer transition ${
                        formData.milestone === type
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/25"
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, milestone: type }))}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border ${
                          formData.milestone === type
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        }`}>
                          {formData.milestone === type && (
                            <CheckCircle className="w-4 h-4 text-primary-foreground" />
                          )}
                        </div>
                        <span className="text-sm capitalize">
                          {type.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" size="lg" className="flex-1">
                  Deliver Work
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(-1)}
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

export default WorkDelivery;