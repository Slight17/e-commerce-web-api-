import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (req, res, next) => {
    const error = new Error('Not Found');
    error.status = StatusCodes.NOT_FOUND;
    next(error);
}

const errorMiddleware = (error, req, res, next) => {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        error: {
            message: error.message
        }
    })
}

export  { errorHandlerMiddleware, errorMiddleware }