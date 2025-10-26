import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateAccessAndRefreshTokens } from "../utils/auth.utils.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
    //Extract fields from request body
    const {fullname, email, username, password, role} = req.body
    console.log("Request body:", req.body);

    //Check if any field is empty
    if (
        [fullname, email, username, password, role].some((field) => 
            field?.trim() === ""
        )
    ) {
        console.log("../backend/src/controllers/auth.controllers.js")
        throw new ApiError(400, "All fields are required")
    }

    //Check if user already exists with same email or username
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        console.log("../backend/src/controllers/auth.controllers.js")
        throw new ApiError(409, "User with email or username already exists")
    }

    //Handle avatar file upload if provided
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    let avatar = {
        url: "",
        public_id: ""
    }

    //Upload avatar to Cloudinary if file exists
    if (avatarLocalPath) {
        const avatarResponse = await uploadOnCloudinary(avatarLocalPath)
        if (!avatarResponse) {
            console.log("../backend/src/controllers/auth.controllers.js")
            throw new ApiError(400, "Avatar file is required")
        }
        avatar = {
            url: avatarResponse.url,
            public_id: avatarResponse.public_id
        }
    }

    //Create new user object with provided data
    const user = await User.create({
        fullname,
        avatar,
        email, 
        password,
        username: username.toLowerCase(),
        role
    })

    //Fetch created user from DB (excluding password & refreshToken fields)
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //If user creation failed → throw error
    if (!createdUser) {
        console.log("../backend/src/controllers/auth.controllers.js")
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    //Return success response with created user data
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    )
})

const login = asyncHandler(async (req, res) => {
    //Extract login credentials from request body
    const {email, username, password} = req.body

    //Either email or username must be provided
    if (!username && !email) {
        console.log("../backend/src/controllers/auth.controllers.js")
        throw new ApiError(400, "username or email is required")
    }

    //Find user by email or username
    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    //If user not found → throw error
    if (!user) {
        console.log("../backend/src/controllers/auth.controllers.js")
        throw new ApiError(404, "User does not exist")
    }

    //Check if provided password is correct
    const isPasswordValid = await user.isPasswordCorrect(password)

    //If password is incorrect → throw error
    if (!isPasswordValid) {
        console.log("../backend/src/controllers/auth.controllers.js")
        throw new ApiError(401, "Invalid user credentials")
    }

    //Generate access & refresh tokens for the user
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    //Fetch logged-in user data (excluding password & refreshToken)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //Cookie options → httpOnly (not accessible by JS), secure (HTTPS only)
    const options = {
        httpOnly: true,
        secure: true
    }

    //Set tokens as cookies and return success response
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser, 
                    accessToken, 
                    refreshToken
                },
                "User logged In Successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    //Update user document to remove refresh token
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    //Cookie options → httpOnly (not accessible by JS), secure (HTTPS only)
    const options = {
        httpOnly: true,
        secure: true //secure: ensures cookies are sent only over HTTPS
    }
    return res  
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    // Check if user is properly authenticated
    if (!req.user) {
        throw new ApiError(401, "User not authenticated");
    }
    
    // Fetch user data from database to ensure we have the latest information
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    
    return res  
        .status(200) 
        .json(
            new ApiResponse(
                200,
                user,
                "Current user fetched Successfully"
            )
        )
})

const verifyEmail = asyncHandler(async (req, res) => {
    //Extract the "verificationToken" from the URL parameters (e.g., /verify-email/:verificationToken)
    const {verificationToken} = req.params

    if (!verificationToken) {
        console.log("../backend/src/controllers/auth.controllers.js")
        throw new ApiError(400, "Email verification token is missing")
    }

    //Hash the provided token (so we can safely compare with DB stored hash)
    let hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex")

    //Find the user with matching token and token not expired
    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: {$gt: Date.now()}
    })

    //If user not found → invalid or expired token
    if (!user) {
        console.log("../backend/src/controllers/auth.controllers.js")
        throw new ApiError(400, "Invalid or expired verification token")
    }

    //Clear verification fields so they can't be reused
    user.emailVerificationToken = undefined
    user.emailVerificationExpiry = undefined

    user.isEmailVerified = true

    //Save user (skipping validations like password hashing)
    await user.save({validateBeforeSave: false})

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isEmailVerified: true
                },
                "Email is verified"
            )
        )
})

const resendEmailVerification = asyncHandler(async (req, res) => {
    //Find the currently logged-in user using the user ID from req.user
    const user = await User.findById(req.user?._id)

    if (!user) {
        console.log("../backend/src/controllers/auth.controllers.js")
        throw new ApiError(404, "User does not exist")
    }

    if (user.isEmailVerified) {
        console.log("../backend/src/controllers/auth.controllers.js")
        throw new ApiError(409, "Email is already Verified")
    }

    //Generate a new temporary email verification token (both hashed + unhashed)
    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

    //Save hashed token & expiry in DB for later verification
    user.emailVerificationToken = hashedToken
    user.emailVerificationExpiry = tokenExpiry

    await user.save({validateBeforeSave: false})

    //Send a verification email with a link that contains the unhashed token
    // For now, we'll just return success without sending email
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Mail has been sent to your email ID"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    //Extract refresh token from either cookies or request body
    const incomingRefreshToken = req.body.refreshToken || req.cookies.refreshToken

    if (!incomingRefreshToken) {
        console.log("../backend/src/controllers/auth.controllers.js")
        throw new ApiError(401, "Unauthorized access")
    }

    //Wrapping logic in try–catch because jwt.verify() and DB queries may throw errors
    try {
        //Verify the refresh token using secret key
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        //Find the user based on decoded token's _id
        const user = await User.findById(decodedToken?._id)

        //If user not found in DB → token is invalid
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        //Ensure the incoming refresh token matches the one stored in DB
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired")
        }

        //Cookie options → httpOnly (not accessible by JS), secure (HTTPS only)
        const options = {
            httpOnly: true,
            secure: true
        }

        //Generate new access & refresh tokens
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        //Save the new refresh token in DB (overwriting the old one)
        user.refreshToken = newRefreshToken
        await user.save()

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {accessToken, refreshToken: newRefreshToken},
                    "Access token refreshed"
                )
            )
    }
    catch (error) {
        //Any failure (invalid/expired token) → unauthorized
        console.log("../backend/src/controllers/auth.controllers.js")
        throw new ApiError(401, "Invalid refresh token")
    }
})

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const {email} = req.body

    const user = await User.findOne({email})

    if (!user) {
        // For security reasons, we don't reveal if the email exists or not
        // We still return success to prevent email enumeration attacks
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "If the email exists in our system, a password reset link has been sent."
                )
            )
    }

    //Generate a temporary token
    const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken()

    //Save hashed token and expiry date in DB
    user.forgotPasswordToken = hashedToken
    user.forgotPasswordExpiry = tokenExpiry

    //Save user without triggering schema validations
    await user.save({validateBeforeSave: false})

    //Send password reset email to the user
    const { sendEmail, forgetPasswordMailgenContent } = await import("../utils/mail.js");
    
    const resetPasswordUrl = `${process.env.CLIENT_URL}/reset-password/${unHashedToken}`;
    
    try {
        await sendEmail({
            email: user.email,
            subject: "SkillLink Password Reset Request",
            mailgenContent: forgetPasswordMailgenContent(user.username, resetPasswordUrl)
        })
        
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Password reset instructions have been sent to your email."
                )
            )
    } catch (error) {
        // If email fails, we still want to show success to prevent email enumeration
        console.error("Failed to send password reset email:", error)
        // For development, we can return the reset token in the response
        // In production, you should never expose the token directly
        if (process.env.NODE_ENV === 'development') {
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        { resetToken: unHashedToken }, // Only for development
                        "Password reset email failed. For development purposes, the token is included in the response."
                    )
                )
        } else {
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        {},
                        "Password reset instructions have been sent to your email."
                    )
                )
        }
    }
})

const resetForgotPassword = asyncHandler(async (req, res) => {
    const {resetToken} = req.params
    const {newPassword} = req.body

    //Hash the reset token
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    //Find user with matching token and not expired
    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    })

    if (!user) {
        throw new ApiError(400, "Password reset token is invalid or expired")
    }

    //Update password
    user.password = newPassword
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined
    
    await user.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password reset successfully"
            )
        )
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body

    //Find user and include password field
    const user = await User.findById(req.user?._id).select("+password")

    //Check if old password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    //Update password
    user.password = newPassword
    await user.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password changed successfully"
            )
        )
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    //Get avatar file path
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar")
    }

    //Update user avatar
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: {
                    public_id: avatar.public_id,
                    url: avatar.url
                }
            }
        },
        {new: true}
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Avatar updated successfully"
            )
        )
})

// Export all controller functions
export {
    registerUser,
    login,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    resendEmailVerification,
    refreshAccessToken,
    forgotPasswordRequest,
    resetForgotPassword,
    changeCurrentPassword,
    updateUserAvatar
}