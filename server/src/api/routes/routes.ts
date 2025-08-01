import { Router } from "express";
import { completeTask, getTasks, getTasksByProject, getUpdates } from "../controller/taskController";
import validateInput from "../../lib/middleware/validateInput";
import { loginInput } from "../../shared/zod";
import { login, me } from "../controller/auth/authController";
import { Auth } from "../../lib/middleware/verifyAuth";
import { getProjects } from "../controller/projectController";
import { getNotesByProject } from "../controller/noteController";
import { getAuthKeyByProjectId } from "../controller/AuthKeyControllet";
const router = Router();

// auth routes.. sould be moved to a separate file.. but lazy to do it now
router.post('/auth/login', validateInput(loginInput), login);
router.get('/auth/me', Auth, me);

// task routes
router.get('/tasks', getTasks);
router.get('/tasks/updates', getUpdates);
router.get('/project/:projectId/tasks', getTasksByProject);
router.get('/task/complete/:taskId', completeTask);

// project routes
router.get('/projects', getProjects);

//notes route
router.get('/project/:projectId/notes', getNotesByProject);

// auth key route
router.get('/project/:projectId/auth/key', getAuthKeyByProjectId);

export default router;