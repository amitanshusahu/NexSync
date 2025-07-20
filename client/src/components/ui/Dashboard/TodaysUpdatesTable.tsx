import { useQuery } from "@tanstack/react-query"
import api from "../../../lib/axios/axios"
import { API_ROUTES } from "../../../lib/api"
import type { Response } from "../../../types/types";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { TanstackTable } from "../../lazy/TanstackTable";
import { useState } from "react";
import { History } from "lucide-react";

interface UpdateResponse extends Response {
  data: {
    id: string;
    description: string;
    completed: boolean;
    priority: string; // P1, P2, P3, UI, UX, BUG
    projectId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    project: {
      name: string;
    } | null;
  }[]
}

export default function TodaysUpdatesTable() {
  const today = new Date();
  const startDate = today.toLocaleDateString();
  const endDate = today.toLocaleDateString();
  const todaysUpdateQuery = useQuery({
    queryKey: ['todaysUpdates'],
    queryFn: async () => {
      const res = await api.get<UpdateResponse>(API_ROUTES.TASKS.GET_UPDATES(startDate, endDate));
      return res.data;
    }
  })

  const columns: ColumnDef<UpdateResponse['data'][number]>[] = [
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
    data: todaysUpdateQuery.data?.data ?? [],
    columns,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
  });

  return (
    <div className="flex flex-col w-full mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <History className="text-primary" size={20} />
          <h2 className="text-sm font-semibold text-primary">Today's Updates</h2>
        </div>
      </div>
      <TanstackTable
        table={table}
        paginatedRows={table.getPaginationRowModel().rows}
        pageIndex={table.getState().pagination.pageIndex}
        pageSize={table.getState().pagination.pageSize}
        onPageChange={(pageIndex) => setPagination(prev => ({ ...prev, pageIndex }))}
        onPageSizeChange={(pageSize) => setPagination(prev => ({ ...prev, pageSize }))}
        height="calc(100vh - 300px)"
        isLoading={todaysUpdateQuery.isLoading}
        isError={todaysUpdateQuery.isError}
        isEmpty={!todaysUpdateQuery.isLoading && todaysUpdateQuery.data?.data.length === 0}
      />
    </div>
  )
}