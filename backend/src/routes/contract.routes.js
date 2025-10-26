import { Router } from "express";
import {
    createContract,
    getContractById,
    getContractByJobId,
    getUserContracts,
    updateContractStatus,
    addMilestone,
    completeMilestone
} from "../controllers/contract.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Create contract
router.post("/create", verifyJWT, createContract);

// Get user's contracts
router.get("/my-contracts", verifyJWT, getUserContracts);

// Get contract by ID
router.get("/:contractId", verifyJWT, getContractById);

// Get contract by job ID
router.get("/job/:jobId", verifyJWT, getContractByJobId);

// Update contract status
router.patch("/:contractId/status", verifyJWT, updateContractStatus);

// Add milestone
router.post("/:contractId/milestones", verifyJWT, addMilestone);

// Complete milestone
router.patch("/:contractId/milestones/:milestoneIndex/complete", verifyJWT, completeMilestone);

export default router;
