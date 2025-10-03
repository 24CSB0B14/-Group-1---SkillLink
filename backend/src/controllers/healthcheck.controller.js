import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js"

//healthCheck is a controller that responds when someone hits your health check endpoint (usually /api/v1/healthcheck).
//It’s wrapped in asyncHandler, so if anything throws inside, it won’t crash—it’ll go to your error middleware.
const healthCheck = asyncHandler(async (req, res) => {
    res.status(200)
        .json(
        new ApiResponse (
            200,
            {message: "Server is running!"}
        ))
})
//A health check endpoint is super common in production. 
//Tools like Docker, Kubernetes, or uptime monitors (Pingdom, AWS ALB, etc.) hit this endpoint to verify that your server is alive and responding.

export { healthCheck }