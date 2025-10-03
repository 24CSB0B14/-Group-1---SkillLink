//replacement of try-catch repetitively
const asyncHandler = (requestHandler) => { //It takes your requestHandler (controller function), and wraps it in a Promise chain.
    return (req, res, next) => { 
        Promise.resolve(requestHandler(req, res, next)).catch(next); //If the requestHandler succeeds → all good.
    }; //If it throws or rejects → .catch(next) automatically passes the error to Express’s error-handling middleware.
};

export { asyncHandler }