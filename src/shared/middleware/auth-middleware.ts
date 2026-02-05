import { envData } from "@src/config/env";
import jwt from "@utils/jwt";
import type { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { ErrorCode, ErrorMessages } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    userType: "CITIZEN" | "OFFICER";
  };
}
//Allow all Role
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new UnauthorizedException(ErrorMessages.MISSING_TOKEN, ErrorCode.MISSING_TOKEN));
  }
  try {
    const data = jwt.verify(token, envData.JWT_SECRET) as {
      userId: string;
      userType: "CITIZEN" | "OFFICER";
    };

    req.user = data;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new UnauthorizedException(ErrorMessages.TOKEN_EXPIRED, ErrorCode.TOKEN_EXPIRED));
    }
    next(new UnauthorizedException(ErrorMessages.UNAUTHORIZED, ErrorCode.UNAUTHORIZED));
  }
};

export const checkOfficer = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
    }

    // Check if user is an officer (assuming officers are admins)
    if (req.user.userType !== "OFFICER") {
      throw new UnauthorizedException(
        ErrorMessages.INSUFFICIENT_PERMISSIONS,
        ErrorCode.INSUFFICIENT_PERMISSIONS,
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
