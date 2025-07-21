import { useQuery } from "@tanstack/react-query"
import api from "../../../lib/axios/axios";
import { API_ROUTES } from "../../../lib/api";
import type { Response } from "../../../types/types";
import { useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { ListFilter, Search, Plus } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface NoteResponse extends Response {
  data: {
    projectId: string | null;
    id: string;
    content: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
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

export default function NoteList() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || '';
  const [search, setSearch] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'active'>('all');

  const noteQuery = useQuery({
    queryKey: ['notes', projectId],
    queryFn: async () => {
      const res = await api.get<NoteResponse>(API_ROUTES.NOTES.GET_NOTES_BY_PROJECT(projectId));
      return res.data;
    }
  });

  const projectName = useMemo(() => {
    const project = noteQuery.data?.data.find(task => task.project?.id === projectId);
    return project ? project.project?.name : "All Notes";
  }, [noteQuery.data, projectId]);

  const filteredNotes = useMemo(() => {
    let notes = noteQuery.data?.data || [];
    
    // Apply search filter
    if (search) {
      notes = notes.filter(note => 
        note.content.toLowerCase().includes(search.toLowerCase()) ||
        note.createdBy.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply active filter
    if (activeFilter === 'active') {
      notes = notes.filter(note => note.isActive);
    }
    
    // Sort by most recent first
    return notes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [noteQuery.data, search, activeFilter]);

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
            New Note
          </button>
        </div>
        
        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notes..."
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
      
      {/* Notes List */}
      {noteQuery.isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : noteQuery.isError ? (
        <div className="flex-1 flex items-center justify-center text-red-500">
          Failed to load notes
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-2">
          <p>No notes found</p>
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
          {filteredNotes.map(note => (
            <div 
              key={note.id} 
              className={`border rounded-lg p-4 flex flex-col h-full ${note.isActive ? 'border-primary/30 bg-white' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex-1">
                <p className="whitespace-pre-wrap text-gray-800 mb-4">{note.content}</p>
              </div>
              <div className="mt-auto pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{note.createdBy}</span>
                  <span>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
                </div>
                {note.project && (
                  <div className="mt-1">
                    <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {note.project.name}
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