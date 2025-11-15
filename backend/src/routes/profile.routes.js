import { Router } from "express";
import { getProfile, updateProfile, getAllFreelancers, getPublicProfile } from "../controllers/profile.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected routes
router.get("/getProfile", verifyJWT, getProfile)
router.patch("/updateProfile", verifyJWT, updateProfile)

// Public routes
router.get("/freelancers", getAllFreelancers)
router.get("/public/:userId", getPublicProfile)

export default router