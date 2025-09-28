import { useQuery } from '@tanstack/react-query';
import tasksApi from '../api/tasks';

export const QUERY_KEYS = {
  tasks: {
    all: ['tasks', 'all'] as const,
    completed: ['tasks', 'completed'] as const,
    incompleted: ['tasks', 'incompleted'] as const,
    byId: (id: number) => ['task', id] as const,
  },
  ping: ['ping'] as const,
};

export const useTasksQuery = (filter: 'all' | 'completed' | 'incompleted' = 'all') => {
  const queryKey = QUERY_KEYS.tasks[filter];
  
  const queryFn = () => {
    switch (filter) {
      case 'completed':
        return tasksApi.listCompleted();
      case 'incompleted':
        return tasksApi.listIncompleted();
      default:
        return tasksApi.listAll();
    }
  };

  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useTaskQuery = (id: number, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.tasks.byId(id),
    queryFn: () => tasksApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry for 404 errors
      if (error?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const usePingQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ping,
    queryFn: tasksApi.ping,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60, // 1 minute
    retry: 1,
  });
};