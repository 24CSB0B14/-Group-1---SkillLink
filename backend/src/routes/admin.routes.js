import { Router } from "express";
import {
    getDashboardStats,
    getAllUsers,
    getAllDisputes,
    getAllTransactions,
    updateUserStatus
} from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require admin authentication
router.use(verifyJWT);

// Get dashboard stats
router.get("/stats", getDashboardStats);

// Get all users
router.get("/users", getAllUsers);

// Get all disputes
router.get("/disputes", getAllDisputes);

// Get all transactions
router.get("/transactions", getAllTransactions);

// Update user status
router.patch("/users/:userId/status", updateUserStatus);

export default router;
