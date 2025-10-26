import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken"

//Middleware to verify JWT access tokens for protected routes
export const verifyJWT = asyncHandler(async (req, res, next) => {
    //Try to get the access token either from cookies or the Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    //If no token is provided, throw unauthorized error
    if (!token) {
        throw new ApiError(401, "Unauthorized request - No token provided")
    }

    try {
        //Verify the token using the ACCESS_TOKEN_SECRET
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        //Find the user in the database using the decoded _id
        //Exclude sensitive fields from the query result
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
        );

        if (!user) {
            throw new ApiError(401, "Invalid Access Token - User not found")
        }

        //Attach the user object to req so that downstream controllers can access it
        req.user = user

        //Pass control to the next middleware/controller
        next()
    } 
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Token expired - Please log in again")
        } else if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid token format - Please log in again")
        } else {
            throw new ApiError(401, "Invalid Access Token - Please log in again")
        }
    }
})

// Middleware to check if user is admin
export const isAdmin = asyncHandler(async (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
        throw new ApiError(401, "User not authenticated")
    }

    // Check if user role is admin
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin rights required.")
    }

    // Pass control to the next middleware/controller
    next()
})