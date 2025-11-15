import { Router } from "express";
import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount
} from "../controllers/notification.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Get user's notifications
router.get("/", verifyJWT, getUserNotifications);

// Get unread count
router.get("/unread-count", verifyJWT, getUnreadCount);

// Mark notification as read
router.patch("/:notificationId/read", verifyJWT, markAsRead);

// Mark all as read
router.patch("/read-all", verifyJWT, markAllAsRead);

// Delete notification
router.delete("/:notificationId", verifyJWT, deleteNotification);

export default router;
