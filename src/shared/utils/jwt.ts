import { envData } from "@src/config/env";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IPayload {
  userId: string;
  userType: string;
}

export default {
  sign: (payload: IPayload) =>
    jwt.sign(payload, envData.JWT_SECRET, {
      expiresIn: "7d",
      algorithm: "HS256",
    }),

  verify: (token: string, secret: string) =>
    jwt.verify(token, secret) as IPayload,
};

// Password Hashing
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
