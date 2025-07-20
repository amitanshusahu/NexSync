import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "./validateEnv";

export interface UserJwtPayload {
  id: string;
}

const validateJWT = (token: string) => {
  if (!token) {
    return { success: false, message: 'Auth Token Not Provided' };
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as UserJwtPayload;
    return { success: true, payload };
  } catch (ex) {
    return { success: false, message: 'Invalid or expired token' };
  }
}

export function Auth(req: Request, res: Response, next: NextFunction) {
  let token = req.cookies.token;
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  const payloadObj = validateJWT(token);
  if (!payloadObj.success) {
    return res.status(401).json({ success: false, message: payloadObj.message });
  }
  if (!payloadObj.payload) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  req.user = payloadObj.payload;

  return next();
}
