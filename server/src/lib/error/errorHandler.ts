import { Response } from "express";

export function errorHandler(err: unknown, log: string, res: Response): Response {
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}

export function userErrorHandler(res: Response): Response {
  return res.status(401).json({ message: "Unauthorized User Id not found" });
}