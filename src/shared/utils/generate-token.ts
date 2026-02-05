import jwt, { SignOptions } from "jsonwebtoken";
import type { UserType } from "@prisma/client";
import { envData } from "@src/config/env";

export const generateTokens = (userId: string, userType: UserType) => {
  const payload = { userId, userType };

  const accessOptions: SignOptions = {
    expiresIn: envData.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  const refreshOptions: SignOptions = {
    expiresIn: envData.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };

  const accessToken = jwt.sign(payload, envData.JWT_SECRET, accessOptions);
  const refreshToken = jwt.sign(payload, envData.JWT_REFRESH_SECRET, refreshOptions);

  return { accessToken, refreshToken };
};
