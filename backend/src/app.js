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
    origin : process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173", //allows requests from specified urls
    credentials : true, //allows cookies, authorization headers etc
    methods : ["GET", "POST", "PUT", "PATCH", "DELETE", "DELETE", "OPTIONS"], //allows these req from frontend
    allowedHeaders: ["Content-Type", "Authorization"] //List of headers allowed in cross origin requests
}));

//importing healthCheck to test server
import healthCheckRouter from "./routes/healthcheck.routes.js";
//importing all routes to test 
import authRouter from "./routes/auth.routes.js";

//url for healthCheck
app.use("/api/v1/healthCheck", healthCheckRouter);

//url for remaining routes
app.use("/api/v1/auth", authRouter)

export default app

