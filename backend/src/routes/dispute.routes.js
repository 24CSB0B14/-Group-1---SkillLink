import express from "express";
import {
    createDispute,
    getAllDisputes,
    getDisputeById,
    resolveDispute,
    getDisputesByUser
} from "../controllers/dispute.controllers.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create dispute (client or freelancer)
router.post("/create", verifyJWT, createDispute);

// Get all disputes (admin only)
router.get("/", verifyJWT, isAdmin, getAllDisputes);

// Get dispute by ID (admin or parties involved)
router.get("/:disputeId", verifyJWT, getDisputeById);

// Resolve dispute (admin only)
router.put("/:disputeId/resolve", verifyJWT, isAdmin, resolveDispute);

// Get disputes by user (client or freelancer)
router.get("/user/:userId", verifyJWT, getDisputesByUser);

export default router;