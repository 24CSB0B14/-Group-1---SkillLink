import { Router } from "express";
import { 
    registerUser,
    login,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    resendEmailVerification,
    refreshAccessToken,
    forgotPasswordRequest,
    resetForgotPassword,
    changeCurrentPassword 
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { userRegisterValidator, userLoginValidator, userChangeCurrentPasswordValidator, userForgotPasswordValidator, userResetForgotPasswordValidator } from "../validators/index.js";

const router = Router()

//Unsecured Routes (Public)

//User registration route
//Validates request body first, then registers the user
router.route("/register").post(userRegisterValidator(), validate, registerUser)

//User login route
//Validates request body first, then logs in the user
router.route("/login").post(userLoginValidator(), validate, login)

//Email verification route
//User clicks the link sent to their email
router.route("/verify-email/:verificationToken").get(verifyEmail)

//Refresh access token using refresh token (no login needed)
router.route("/refresh-token").post(refreshAccessToken)

//Forgot password request route
//Validates request body first, then sends password reset email
router.route("/forget-password").post(userForgotPasswordValidator(), validate, forgotPasswordRequest)

//Reset password route
//Validates request body and resets password using reset token
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(), validate, resetForgotPassword)


//Secured Routes (Require Authentication)

//Logout route
//Clears refresh and access tokens from DB and cookies
router.route("/logout").post(verifyJWT, logoutUser)

//Get current logged-in user details
router.route("/current-user").post(verifyJWT, getCurrentUser)

//Change current password route
//Validates request body and changes password
router.route("/change-password").post(verifyJWT, userChangeCurrentPasswordValidator(), validate, changeCurrentPassword)

//Resend email verification route
//Sends verification email again
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification)

export default router



