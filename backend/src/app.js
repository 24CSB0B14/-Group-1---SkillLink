import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

//converts data to objects from json, url
app.use(express.json({ limit:"16kb" }));
app.use(express.urlencoded({extended: true, limit: "16kb"}));

//makes everything available in public folder directly via url 
app.use(express.static("public"));

//enables cookies
app.use(cookieParser());

//basic setup of cors
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ["http://localhost:8082", "http://localhost:8080", "http://localhost:8081"],
    credentials: true, //allows cookies, authorization headers etc
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], //allows these req from frontend
    allowedHeaders: ["Content-Type", "Authorization"], //List of headers allowed in cross origin requests
    exposedHeaders: ["Authorization"]
}));

//importing healthCheck to test server
import healthCheckRouter from "./routes/healthcheck.routes.js";
//importing all routes to test 
import authRouter from "./routes/auth.routes.js";
//importing profile routes
import profileRoutes from "./routes/profile.routes.js"
//importing jobs posting routes
import jobRoutes from "./routes/job.routes.js"
//importing bid routes
import bidRoutes from "./routes/bid.routes.js";
//importing invitation routes
import invitationRoutes from "./routes/invitation.routes.js"
//importing escrow routes
import escrowRoutes from "./routes/escrow.routes.js"
//importing dispute routes
import disputeRoutes from "./routes/dispute.routes.js"
//importing contract routes
import contractRoutes from "./routes/contract.routes.js"
//importing review routes
import reviewRoutes from "./routes/review.routes.js"
//importing notification routes
import notificationRoutes from "./routes/notification.routes.js"
//importing admin routes
import adminRoutes from "./routes/admin.routes.js"

//url for healthCheck
app.use("/api/v1/healthCheck", healthCheckRouter);

//url for remaining routes
app.use("/api/v1/auth", authRouter)

//url for profile
app.use("/api/v1/profile", profileRoutes)

//url for jobs
app.use("/api/v1/jobs", jobRoutes)

//url for bids
app.use("/api/v1/bids", bidRoutes)

//url for invitations
app.use("/api/v1/invitations", invitationRoutes)

//url for escrow
app.use("/api/v1/escrow", escrowRoutes)

//url for disputes
app.use("/api/v1/disputes", disputeRoutes)

//url for contracts
app.use("/api/v1/contracts", contractRoutes)

//url for reviews
app.use("/api/v1/reviews", reviewRoutes)

//url for notifications
app.use("/api/v1/notifications", notificationRoutes)

//url for admin
app.use("/api/v1/admin", adminRoutes)

// Global error handler
app.use((err, req, res, next) => {
  // If it's an ApiError, use its properties
  if (err.statusCode && err.message) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || []
    });
  }
  
  // For other errors, return a generic 500 error
  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: []
  });
});

export default app