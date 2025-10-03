import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

//Middleware to validate request inputs using express-validator
export const validate = (req, res, next) => {
    //Collect validation errors from the request
    const errors = validationResult(req)

    //If there are no validation errors, continue to next middleware/controller
    if (errors.isEmpty()) {
        return next()
    }

    //If there are errors, format them into a consistent structure
    //Example: [{ email: "Email is invalid" }, { password: "Password is too short" }]
    const extractedErrors = []
    errors.array().map((err) => extractedErrors.push({[err.path]: err.msg}))

    //The controller calling this middleware can catch this and return a proper response
    console.log("../backend/src/middlewares/validator.middleware.js")
    throw new ApiError(422, "Received data is not valid", extractedErrors)
}