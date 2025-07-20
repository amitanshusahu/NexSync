import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma/client';

export async function getProjects(_req: Request, res: Response): Promise<Response> {
  try {
    const projects = await prisma.project.findMany({});

    return res.status(200).json({
      success: true,
      message: 'Projects fetched successfully',
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
}