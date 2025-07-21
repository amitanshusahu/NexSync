import { Request, Response } from "express";
import { prisma } from "../../lib/prisma/client";

export async function getNotesByProject(req: Request, res: Response): Promise<Response> {
  try {
    const projectId = req.params.projectId;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const notes = await prisma.note.findMany({
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
      message: 'Notes fetched successfully',
      data: notes,
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return res.status(500).json({ error: 'Failed to fetch notes' });
  }
}

export async function createNote(req: Request, res: Response): Promise<Response> {
  try {
    const { content, projectId } = req.body;

    if (!content || !projectId) {
      return res.status(400).json({ message: "Content and Project ID are required" });
    }

    const newNote = await prisma.note.create({
      data: {
        content,
        projectId,
        createdBy: req.user?.id, // Assuming user ID is available in request
      },
      include: {
        project: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: newNote,
    });
  } catch (error) {
    console.error('Error creating note:', error);
    return res.status(500).json({ error: 'Failed to create note' });
  }
}

export async function updateNote(req: Request, res: Response): Promise<Response> {
  try {
    const { noteId } = req.params;
    const { content } = req.body;

    if (!noteId || !content) {
      return res.status(400).json({ message: "Note ID and content are required" });
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { content },
      include: {
        project: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote,
    });
  } catch (error) {
    console.error('Error updating note:', error);
    return res.status(500).json({ error: 'Failed to update note' });
  }
}