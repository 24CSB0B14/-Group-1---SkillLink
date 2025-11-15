import { Router } from "express"
import { postJob, getAllJobs, getJobById, updateJob, deleteJob, searchJobs, getJobsByClient } from "../controllers/job.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/create", verifyJWT, postJob)
router.get("/", getAllJobs)
router.get("/my-jobs", verifyJWT, getJobsByClient)
router.get("/:jobId", getJobById)
router.patch("/:jobId", verifyJWT, updateJob)
router.delete("/:jobId", verifyJWT, deleteJob)
router.get("/search", searchJobs)

export default router