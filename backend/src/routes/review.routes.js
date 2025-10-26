import { Router } from "express";
import {
    createReview,
    getUserReviews,
    getReviewByContract,
    getMyReviews,
    getReviewsAboutMe,
    updateReview,
    deleteReview
} from "../controllers/review.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Create review
router.post("/create", verifyJWT, createReview);

// Get my reviews (reviews I've written)
router.get("/my-reviews", verifyJWT, getMyReviews);

// Get reviews about me
router.get("/about-me", verifyJWT, getReviewsAboutMe);

// Get reviews for a user
router.get("/user/:userId", getUserReviews);

// Get reviews by contract
router.get("/contract/:contractId", verifyJWT, getReviewByContract);

// Update review
router.patch("/:reviewId", verifyJWT, updateReview);

// Delete review
router.delete("/:reviewId", verifyJWT, deleteReview);

export default router;
