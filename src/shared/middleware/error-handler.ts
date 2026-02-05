import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError } from "zod";
import { BadRequestException } from "../exceptions/bad-request";
import { InternalException } from "../exceptions/internal-exception";
import { ErrorCode, ErrorMessages, HttpException } from "../exceptions/root";

export const errorHandler = (method: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: unknown) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else if (error instanceof ZodError) {
        exception = new BadRequestException(
          ErrorMessages.UN_PROCESSABLE_ENTITY,
          ErrorCode.UN_PROCESSABLE_ENTITY,
          error.issues,
        );
      } else {
        console.log("error", error);
        exception = new InternalException(
          ErrorMessages.SOMETHING_WENT_WRONG,
          error,
          ErrorCode.INTERNAL_EXCEPTION,
        );
      }
      next(exception);
    }
  };
};

// 404 Not Found Middleware
export const errorNotFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
    errorCode: "ODSC-404",
    path: req.originalUrl,
  });
};

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(error.statusCode).json({
    status: false,
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors,
  });
};
