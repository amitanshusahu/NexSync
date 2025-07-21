const BASE_URL = `${import.meta.env.VITE_API_URL}`;

// Define the API routes in a structured way
export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    ME: `${BASE_URL}/api/auth/me`,
  },
  TASKS: {
    GET_TASKS: (startDate: string, endDate: string) => `${BASE_URL}/api/tasks?startDate=${startDate}&endDate=${endDate}`,
    GET_UPDATES: (startDate: string, endDate: string) => `${BASE_URL}/api/tasks/updates?startDate=${startDate}&endDate=${endDate}`,
    GET_TASKS_BY_PROJECT: (projectId: string) =>
      `${BASE_URL}/api/project/${projectId}/tasks`,
    COMPLETE_TASK: (taskId: string) => `${BASE_URL}/api/task/complete/${taskId}`,
  },
  PROJECTS: {
    GET_PROJECTS: `${BASE_URL}/api/projects`,
  },
  NOTES: {
    GET_NOTES_BY_PROJECT: (projectId: string) =>
      `${BASE_URL}/api/project/${projectId}/notes`,
  },
  AUTH_KEY: {
    GET_AUTH_KEY_BY_PROJECT: (projectId: string) =>
      `${BASE_URL}/api/project/${projectId}/auth-key`,
  },
} as const;

export const localKey = {
  token: `nexsync_token`,
}