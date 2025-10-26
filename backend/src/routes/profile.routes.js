import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/getProfile", verifyJWT, getProfile)
router.patch("/updateProfile", verifyJWT, updateProfile)

export default router