//For ApiErrors to have a definite structure
class ApiError extends Error {
    constructor (
        statusCode,
        message = "Something went Wrong!",
        errors = [],
        stack = "" //useful for debugging ex: shows path where the error has occured
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
        if (stack) {
            this.stack = stack //defines custom stacktrace
        }
        else {
            Error.captureStackTrace(this, this.constructor) //makes its own stacktrace
        }
    }
}

export { ApiError }