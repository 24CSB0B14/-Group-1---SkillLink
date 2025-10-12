import { Router } from "express"
import { postJob } from "../controllers/job.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/create", verifyJWT, postJob)

export default router