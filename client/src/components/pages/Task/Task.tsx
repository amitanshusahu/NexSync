import { useQuery } from "@tanstack/react-query"
import api from "../../../lib/axios/axios";
import type { Response } from "../../../types/types";
import { API_ROUTES } from "../../../lib/api";
import { ListTodo } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectResponse extends Response {
  data: {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  }[]
}

export default function Task() {

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get<ProjectResponse>(API_ROUTES.PROJECTS.GET_PROJECTS);
      return res.data;
    }
  })

  const navigate = useNavigate();

  if (projectsQuery.isLoading) return (
    <div>loading..</div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-12">
        <div className="flex gap-2">
          <ListTodo className="text-primary" size={20} />
          <h2 className="text-sm font-semibold text-primary">Tasks</h2>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 items-start justify-start">
        {
          projectsQuery.data?.data.map(project => (
            <button
              key={project.id}
              className="flex flex-col items-center justify-center"
              onDoubleClick={() => { navigate(`/project/tasks?projectId=${project.id}`) }}
            >
              <img src="/folder.png" className="w-[100px]" />
              <span className="text-sm text-gray-700">{project.name}</span>
            </button>
          ))
        }
      </div>
    </div>
  )
}