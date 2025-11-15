import { Router } from "express"
import { postBid, acceptBid, getBidsForJob, getBidById, updateBid, deleteBid } from "../controllers/bid.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/create", verifyJWT, postBid)
router.post("/accept", verifyJWT, acceptBid)
router.get("/job/:jobId", getBidsForJob)
router.get("/:bidId", getBidById)
router.patch("/:bidId", verifyJWT, updateBid)
router.delete("/:bidId", verifyJWT, deleteBid)

export default router