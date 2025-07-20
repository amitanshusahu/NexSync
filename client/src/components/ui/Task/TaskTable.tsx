import { useMutation, useQuery } from "@tanstack/react-query"
import api from "../../../lib/axios/axios";
import { API_ROUTES } from "../../../lib/api";
import type { Response } from "../../../types/types";
import { useSearchParams } from "react-router-dom";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { TanstackTable } from "../../lazy/TanstackTable";
import { useState, useMemo } from "react";
import { ListFilter } from "lucide-react";

interface TaskResponse extends Response {
  data: {
    id: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    completed: boolean;
    priority: string;
    projectId: string | null;
    remarks: string | null;
    project: {
      id: string;
      name: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      createdBy: string;
      updatedBy: string;
    } | null;
  }[]
}

export default function TaskTable() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || '';
  const [completedFilter, setCompletedFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const taskQuery = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const res = await api.get<TaskResponse>(API_ROUTES.TASKS.GET_TASKS_BY_PROJECT(projectId));
      return res.data;
    }
  });

  const taskCompletedMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await api.post(API_ROUTES.TASKS.COMPLETE_TASK(taskId));
      return res.data;
    },
    onSuccess: () => {
      taskQuery.refetch();
    },
    onError: (error) => {
      console.error('Error completing task:', error);
    }
  })

  const porjectName = useMemo(() => {
    const project = taskQuery.data?.data.find(task => task.project?.id === projectId);
    return project ? project.project?.name : "Unknown";
  }, [taskQuery.data, projectId]);

  // Filter tasks based on completed and search
  const filteredTasks = useMemo(() => {
    let tasks = taskQuery.data?.data ?? [];
    if (completedFilter === "completed") {
      tasks = tasks.filter(task => task.completed === true);
    } else if (completedFilter === "notcompleted") {
      tasks = tasks.filter(task => task.completed === false);
    }
    if (search.trim()) {
      const lower = search.toLowerCase();
      tasks = tasks.filter(task =>
        task.description.toLowerCase().includes(lower) ||
        (task.project?.name?.toLowerCase().includes(lower) ?? false)
      );
    }
    return tasks;
  }, [taskQuery.data, completedFilter, search]);

  const columns: ColumnDef<TaskResponse['data'][number]>[] = [
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
    },
    {
      accessorKey: 'project.name',
      header: 'Project',
      cell: info => info.row.original.project?.name ?? "—",
    },
    {
      accessorKey: 'completed',
      header: 'Completed',
      cell: info => info.getValue() ? "Yes" : "No",
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: info => new Date(info.getValue() as string).toLocaleString(),
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
    },
  ];

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 30,
  });

  const table = useReactTable({
    data: filteredTasks,
    columns,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
  });

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 items-center">
          <ListFilter className="text-primary" size={20} />
          <h2 className="text-sm font-semibold text-primary">{porjectName} Tasks</h2>
        </div>
        <div className="flex gap-2 items-center">
          {/* Completed Status Select */}
          <select
            value={completedFilter}
            onChange={e => setCompletedFilter(e.target.value)}
            className="min-w-[150px] border border-gray-300 rounded px-2 py-1 text-xs"
          >
            <option value="all" className="text-xs">All Tasks</option>
            <option value="completed" className="text-xs">Completed</option>
            <option value="notcompleted" className="text-xs">Not Completed</option>
          </select>
          {/* Search Bar */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="min-w-[200px] border border-gray-300 rounded px-2 py-1 text-xs"
          />
        </div>
      </div>
      <TanstackTable
        table={table}
        paginatedRows={table.getPaginationRowModel().rows}
        pageIndex={table.getState().pagination.pageIndex}
        pageSize={table.getState().pagination.pageSize}
        onPageChange={pageIndex => setPagination(prev => ({ ...prev, pageIndex }))}
        onPageSizeChange={pageSize => setPagination(prev => ({ ...prev, pageSize }))}
        height="calc(100vh - 300px)"
        isLoading={taskQuery.isLoading}
        isError={taskQuery.isError}
        isEmpty={!taskQuery.isLoading && filteredTasks.length === 0}
      />
    </div>
  );
}