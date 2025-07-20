import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma/client';
import { endOfDay, startOfDay } from 'date-fns';

export async function getTasks(req: Request, res: Response): Promise<Response> {
  try {
    const queryParams = req.query;
    const startDate = queryParams.startDate ? queryParams.startDate : null;
    const endDate = queryParams.endDate ? queryParams.endDate : null;

    if (startDate && isNaN(new Date(startDate as string).getTime())) {
      return res.status(400).json({ message: "Invalid start date format" });
    }
    if (endDate && isNaN(new Date(endDate as string).getTime())) {
      return res.status(400).json({ message: "Invalid end date format" });
    }

    const todaysDate = new Date();
    const dayStart = startOfDay(typeof startDate == 'string' ? startDate : todaysDate);
    const dayEnd = endOfDay(typeof endDate == 'string' ? endDate : todaysDate);


    const tasks = await prisma.task.findMany({
      where: {
        updatedAt: {
          gte: dayStart,
          lte: dayEnd,
        },
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Tasks fetched successfully',
      data: tasks,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

export async function getUpdates(req: Request, res: Response): Promise<Response> {
  try {
    const queryParams = req.query;
    const startDate = queryParams.startDate ? queryParams.startDate : null;
    const endDate = queryParams.endDate ? queryParams.endDate : null;

    if (startDate && isNaN(new Date(startDate as string).getTime())) {
      return res.status(400).json({ message: "Invalid start date format" });
    }
    if (endDate && isNaN(new Date(endDate as string).getTime())) {
      return res.status(400).json({ message: "Invalid end date format" });
    }

    const todaysDate = new Date();
    const dayStart = startOfDay(typeof startDate == 'string' ? startDate : todaysDate);
    const dayEnd = endOfDay(typeof endDate == 'string' ? endDate : todaysDate);

    const updates = await prisma.task.findMany({
      where: {
        completed: true,
        updatedAt: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      include: {
        project: {
          select: {
            name: true,
          },
        }
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Update successful',
      data: updates,
    });
  } catch (error) {
    console.error('Error updating data:', error);
    return res.status(500).json({ error: 'Failed to update data' });
  }
}

export async function getTasksByProject(req: Request, res: Response): Promise<Response> {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      },
      include: {
        project: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Tasks fetched successfully',
      data: tasks,
    });
  } catch (error) {
    console.error('Error fetching tasks by project:', error);
    return res.status(500).json({ error: 'Failed to fetch tasks by project' });
  }
}

export async function completeTask(req: Request, res: Response): Promise<Response> {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { completed: true },
    });

    return res.status(200).json({
      success: true,
      message: 'Task completed successfully',
      data: updatedTask,
    });
  } catch (error) {
    console.error('Error completing task:', error);
    return res.status(500).json({ error: 'Failed to complete task' });
  }
}