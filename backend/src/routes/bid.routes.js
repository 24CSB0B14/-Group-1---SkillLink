import { Router } from "express"
import { postBid, acceptBid } from "../controllers/bid.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/create", verifyJWT, postBid)
router.post("/accept", verifyJWT, acceptBid)

export default router