import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

//Middleware to validate request inputs using express-validator
export const validate = (req, res, next) => {
    //Collect validation errors from the request
    const errors = validationResult(req)

    console.log("Validation middleware called");
    console.log("Request body:", req.body);
    console.log("Validation result:", errors);

    //If there are no validation errors, continue to next middleware/controller
    if (errors.isEmpty()) {
        console.log("No validation errors, proceeding to next middleware");
        return next()
    }

    //If there are errors, format them into a consistent structure
    //Example: [{ email: "Email is invalid" }, { password: "Password is too short" }]
    const extractedErrors = []
    errors.array().map((err) => extractedErrors.push({[err.path]: err.msg}))

    // Log validation errors for debugging
    console.log("Validation errors found:", errors.array());
    console.log("../backend/src/middlewares/validator.middleware.js")
    
    //The controller calling this middleware can catch this and return a proper response
    throw new ApiError(422, "Received data is not valid", extractedErrors)
}