import { Router } from "express";
import { sendInvitation, respondToInvitation } from "../controllers/invitation.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

//Client → send invitation
router.post("/send", verifyJWT, sendInvitation);

//Freelancer → accept/reject invitation
router.post("/respond", verifyJWT, respondToInvitation);

export default router