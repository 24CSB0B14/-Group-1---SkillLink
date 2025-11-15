import { Review } from "../models/review.models.js";
import { Contract } from "../models/contract.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

// Create a review
const createReview = asyncHandler(async (req, res) => {
    const { contractId, rating, comment, categories } = req.body;

    // Verify contract exists
    const contract = await Contract.findById(contractId);
    if (!contract) {
        throw new ApiError(404, "Contract not found");
    }

    // Check if contract is completed
    if (contract.status !== "completed") {
        throw new ApiError(400, "Can only review completed contracts");
    }

    // Check if user is part of the contract
    if (
        contract.client.toString() !== req.user._id.toString() &&
        contract.freelancer.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(403, "Not authorized to review this contract");
    }

    // Determine who is being reviewed
    const reviewee = contract.client.toString() === req.user._id.toString()
        ? contract.freelancer
        : contract.client;

    // Check if review already exists
    const existingReview = await Review.findOne({
        contract: contractId,
        reviewer: req.user._id
    });

    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this contract");
    }

    // Create review
    const review = await Review.create({
        contract: contractId,
        job: contract.job,
        reviewer: req.user._id,
        reviewee,
        rating,
        comment,
        categories: categories || {}
    });

    // Update user's average rating
    await updateUserRating(reviewee);

    const populatedReview = await Review.findById(review._id)
        .populate("reviewer", "username email")
        .populate("reviewee", "username email")
        .populate("job", "title");

    return res.status(201).json(
        new ApiResponse(201, populatedReview, "Review created successfully")
    );
});

// Helper function to update user's average rating
async function updateUserRating(userId) {
    const reviews = await Review.find({ reviewee: userId });
    
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        // Update user's rating (you may need to add a rating field to User model)
        // For now, this is just a placeholder
        // await User.findByIdAndUpdate(userId, { rating: averageRating });
    }
}

// Get reviews for a user
const getUserReviews = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewee: userId, isPublic: true })
        .populate("reviewer", "username email")
        .populate("job", "title")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, reviews, "Reviews fetched successfully")
    );
});

// Get review by contract
const getReviewByContract = asyncHandler(async (req, res) => {
    const { contractId } = req.params;

    const reviews = await Review.find({ contract: contractId })
        .populate("reviewer", "username email")
        .populate("reviewee", "username email")
        .populate("job", "title");

    return res.status(200).json(
        new ApiResponse(200, reviews, "Reviews fetched successfully")
    );
});

// Get my reviews (reviews I've written)
const getMyReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ reviewer: req.user._id })
        .populate("reviewee", "username email")
        .populate("job", "title")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, reviews, "Your reviews fetched successfully")
    );
});

// Get reviews about me
const getReviewsAboutMe = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ reviewee: req.user._id, isPublic: true })
        .populate("reviewer", "username email")
        .populate("job", "title")
        .sort({ createdAt: -1 });

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    return res.status(200).json(
        new ApiResponse(200, {
            reviews,
            averageRating: averageRating.toFixed(1),
            totalReviews: reviews.length
        }, "Reviews fetched successfully")
    );
});

// Update review
const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment, categories } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Check if user is the reviewer
    if (review.reviewer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to update this review");
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (categories) review.categories = categories;

    await review.save();

    // Update user's average rating
    await updateUserRating(review.reviewee);

    const updatedReview = await Review.findById(reviewId)
        .populate("reviewer", "username email")
        .populate("reviewee", "username email")
        .populate("job", "title");

    return res.status(200).json(
        new ApiResponse(200, updatedReview, "Review updated successfully")
    );
});

// Delete review
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Check if user is the reviewer
    if (review.reviewer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to delete this review");
    }

    const revieweeId = review.reviewee;
    await Review.findByIdAndDelete(reviewId);

    // Update user's average rating
    await updateUserRating(revieweeId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Review deleted successfully")
    );
});

export {
    createReview,
    getUserReviews,
    getReviewByContract,
    getMyReviews,
    getReviewsAboutMe,
    updateReview,
    deleteReview
};
