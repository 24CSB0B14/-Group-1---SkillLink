// pages/ReviewRating.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import reviewService from "@/services/review.service";
import contractService from "@/services/contract.service";

const ReviewRating = () => {
  const { id: contractId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContract();
  }, [contractId]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const response = await contractService.getContractById(contractId);
      const data = response.data || response;
      setContract(data);
      
      if (data.status !== 'completed') {
        toast.error("Can only review completed contracts");
        navigate('/');
      }
    } catch (error) {
      toast.error("Failed to load contract");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (!review.trim() || review.trim().length < 10) {
      toast.error("Please write at least 10 characters in your review");
      return;
    }
    
    setSubmitting(true);
    try {
      await reviewService.createReview({
        contractId,
        rating,
        comment: review
      });
      toast.success("Review submitted successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  if (!contract) return <div className="min-h-screen bg-background flex items-center justify-center">Contract not found</div>;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Leave a Review</CardTitle>
            <p className="text-muted-foreground">
              Share your experience working on this project
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary/20 text-primary text-lg">
                    {contract.job?.title?.charAt(0) || 'J'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{contract.job?.title || 'Contract'}</h3>
                  <p className="text-muted-foreground">Contract #{contract._id.slice(-8)}</p>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Project Completed</h4>
                <p className="text-muted-foreground">
                  {contract.job?.description || 'Contract completed successfully'}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-success">
                  <CheckCircle className="w-4 h-4" />
                  <span>Successfully delivered on {new Date(contract.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Overall Rating *
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Your Review *
                </label>
                <Textarea
                  placeholder="Share details about your experience. What did you like? What could be improved?"
                  rows={6}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                />
              </div>

              {/* Recommendation */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Would you recommend this freelancer?
                </label>
                <div className="flex gap-4">
                  {[
                    { value: "yes", label: "Yes, definitely" },
                    { value: "maybe", label: "Maybe" },
                    { value: "no", label: "No" }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="recommendation"
                        value={option.value}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skills Rating */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Rate specific skills (optional)
                </label>
                <div className="space-y-3">
                  {[
                    "Communication",
                    "Quality of Work",
                    "Professionalism",
                    "Meeting Deadlines"
                  ].map((skill) => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-sm">{skill}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="p-0.5"
                          >
                            <Star className="w-4 h-4 text-muted-foreground hover:text-yellow-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={rating === 0 || !review.trim() || submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/client-dashboard")}
                >
                  Skip Review
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewRating;