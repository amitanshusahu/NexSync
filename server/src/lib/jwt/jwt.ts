import jwt from "jsonwebtoken";
import { UserJwtPayload } from "../middleware/verifyAuth";
import { env } from "../middleware/validateEnv";

export const generateJwt = (payload: UserJwtPayload): string => {
  const options: jwt.SignOptions = { expiresIn: '200h' };
  return jwt.sign(payload, env.JWT_SECRET, options);
};

// just too lazy to add add another argment for options
// so I just created another function
// TODO: refactor this later
export const generateRefreshJwt = (payload: UserJwtPayload): string => {
  const options: jwt.SignOptions = { expiresIn: '30d' };
  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const generateTrueJwt = (payload: { id: string }): string => {
  const options: jwt.SignOptions = { expiresIn: '200h' };
  return jwt.sign(payload, env.JWT_SECRET);
};

// just too lazy to add add another argment for options
// so I just created another function
// TODO: refactor this later
export const generateTrueRefreshJwt = (payload: { id: string }): string => {
  const options: jwt.SignOptions = { expiresIn: '30d' };
  return jwt.sign(payload, env.JWT_SECRET, options);
};