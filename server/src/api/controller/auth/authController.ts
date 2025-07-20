import { Request, Response } from "express";
import { generateJwt } from "../../../lib/jwt/jwt";
import { errorHandler } from "../../../lib/error/errorHandler";
import { prisma } from "../../../lib/prisma/client";

export async function login(req: Request, res: Response): Promise<Response> {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username, password }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Invalid username or password"
      });
    }

    const token = generateJwt({ id: username });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: token
      }
    });
  } catch (error) {
    return errorHandler(error, "Login", res);
  }
}


export async function me(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Request User not found",
        success: false,
      });
    }

    const userId = req.user.id;

    const me = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!me) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found",
      data: me
    });
  } catch (error) {
    return errorHandler(error, "Me", res);
  }
}