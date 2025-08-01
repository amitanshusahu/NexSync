import { Request, Response } from "express";
import { prisma } from "../../lib/prisma/client";

export async function getAuthKeyByProjectId(req: Request, res: Response): Promise<Response> {
  try {
    const projectId = req.params.projectId;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const authKey = await prisma.authKey.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        project: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Auth key fetched successfully',
      data: authKey,
    });
  } catch (error) {
    console.error('Error fetching auth key:', error);
    return res.status(500).json({ error: 'Failed to fetch auth key' });
  }
}