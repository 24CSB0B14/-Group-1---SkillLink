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
        console.log("../backend/src/middlewares/auth.middleware.js")
        throw new ApiError(401, "Unauthorised request")
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
            console.log("../backend/src/middlewares/auth.middleware.js")
            throw new ApiError(401, "Invalid Access Token")
        }

        //Attach the user object to req so that downstream controllers can access it
        req.user = user

        //Pass control to the next middleware/controller
        next()
    } 
    catch (error) {
        console.log("../backend/src/middlewares/auth.middleware.js")
        throw new ApiError(401, "Invalid Access Token")
    }
})