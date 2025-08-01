import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import api from "../../../lib/axios/axios";
import { API_ROUTES } from "../../../lib/api";
import type { Response } from "../../../types/types";
import { useState, useMemo } from "react";
import { ListFilter, Search, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AuthKeyResponse extends Response {
  data: {
    project: {
      id: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      createdBy: string;
      updatedBy: string;
      name: string;
    } | null;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    projectId: string | null;
    content: string;
  }[];
}

export default function AuthKeyTable() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || '';
  const [search, setSearch] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'active'>('all');

  const authKeyQuery = useQuery({
    queryKey: ['authKeys', projectId],
    queryFn: async () => {
      const res = await api.get<AuthKeyResponse>(API_ROUTES.AUTH_KEY.GET_AUTH_KEY_BY_PROJECT(projectId));
      return res.data;
    }
  });

  const projectName = useMemo(() => {
    const project = authKeyQuery.data?.data.find(key => key.project?.id === projectId);
    return project ? project.project?.name : "All Auth Keys";
  }, [authKeyQuery.data, projectId]);

  const filteredKeys = useMemo(() => {
    let keys = authKeyQuery.data?.data || [];
    // Apply search filter
    if (search) {
      keys = keys.filter(key =>
        key.content.toLowerCase().includes(search.toLowerCase()) ||
        key.createdBy.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Apply active filter
    if (activeFilter === 'active') {
      keys = keys.filter(key => key.isActive);
    }
    // Sort by most recent first
    return keys.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [authKeyQuery.data, search, activeFilter]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <ListFilter className="text-primary" size={20} />
            <h2 className="text-lg font-semibold text-primary">{projectName}</h2>
          </div>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors">
            <Plus size={16} />
            New Auth Key
          </button>
        </div>
        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search auth keys..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-sm rounded-md ${activeFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('active')}
              className={`px-3 py-1 text-sm rounded-md ${activeFilter === 'active' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Active Only
            </button>
          </div>
        </div>
      </div>
      {/* Auth Keys List */}
      {authKeyQuery.isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : authKeyQuery.isError ? (
        <div className="flex-1 flex items-center justify-center text-red-500">
          Failed to load auth keys
        </div>
      ) : filteredKeys.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-2">
          <p>No auth keys found</p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-primary text-sm hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 pb-4">
          {filteredKeys.map(key => (
            <div
              key={key.id}
              className={`border rounded-lg p-4 flex flex-col h-full ${key.isActive ? 'border-primary/30 bg-white' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex-1">
                <p className="break-all font-mono text-gray-800 mb-4">{key.content}</p>
              </div>
              <div className="mt-auto pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{key.createdBy}</span>
                  <span>{formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}</span>
                </div>
                {key.project && (
                  <div className="mt-1">
                    <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {key.project.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}