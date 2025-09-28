import { useMutation, useQueryClient } from '@tanstack/react-query';
import tasksApi from '../api/tasks';
import { QUERY_KEYS } from './useTasksQuery';
import type { Task, TaskCreate, TaskUpdate } from '../types/task';

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const invalidateTaskQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task'] });
  };

  const createTaskMutation = useMutation({
    mutationFn: (data: TaskCreate) => tasksApi.create(data),
    onSuccess: (newTask) => {
      // Add the new task to all relevant queries
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (oldData) => {
        return oldData ? [newTask, ...oldData] : [newTask];
      });

      // Add to incompleted list if not completed
      if (!newTask.completed) {
        queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.incompleted, (oldData) => {
          return oldData ? [newTask, ...oldData] : [newTask];
        });
      } else {
        // Add to completed list if completed
        queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.completed, (oldData) => {
          return oldData ? [newTask, ...oldData] : [newTask];
        });
      }

      // Set individual task query
      queryClient.setQueryData(QUERY_KEYS.tasks.byId(newTask.id), newTask);
    },
    onError: () => {
      invalidateTaskQueries();
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskUpdate }) =>
      tasksApi.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks.byId(id) });
      
      // Snapshot the previous value
      const previousTask = queryClient.getQueryData<Task>(QUERY_KEYS.tasks.byId(id));
      
      // Optimistically update
      if (previousTask) {
        const optimisticTask = { ...previousTask, ...data };
        queryClient.setQueryData(QUERY_KEYS.tasks.byId(id), optimisticTask);
        
        // Update in all lists
        const updateTaskInList = (tasks: Task[] | undefined) => {
          if (!tasks) return tasks;
          return tasks.map(task => 
            task.id === id ? optimisticTask : task
          );
        };

        queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, updateTaskInList);
        queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.completed, updateTaskInList);
        queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.incompleted, updateTaskInList);
      }
      
      return { previousTask };
    },
    onError: (_, { id }, context) => {
      // Rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(QUERY_KEYS.tasks.byId(id), context.previousTask);
      }
      invalidateTaskQueries();
    },
    onSuccess: (updatedTask) => {
      // Update with the real data from server
      queryClient.setQueryData(QUERY_KEYS.tasks.byId(updatedTask.id), updatedTask);
      invalidateTaskQueries();
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => tasksApi.remove(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks.byId(id) });
      
      // Snapshot the previous value
      const previousTask = queryClient.getQueryData<Task>(QUERY_KEYS.tasks.byId(id));
      
      // Optimistically remove from all lists
      const removeTaskFromList = (tasks: Task[] | undefined) => {
        if (!tasks) return tasks;
        return tasks.filter(task => task.id !== id);
      };

      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, removeTaskFromList);
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.completed, removeTaskFromList);
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.incompleted, removeTaskFromList);
      
      // Remove individual task query
      queryClient.removeQueries({ queryKey: QUERY_KEYS.tasks.byId(id) });
      
      return { previousTask };
    },
    onError: (_err, _id, _context) => {
      // Rollback on error - this is tricky for delete, so we'll just invalidate
      invalidateTaskQueries();
    },
    onSuccess: (success, id) => {
      if (success) {
        // Ensure the task is removed
        queryClient.removeQueries({ queryKey: QUERY_KEYS.tasks.byId(id) });
      } else {
        // If delete failed, invalidate to get fresh data
        invalidateTaskQueries();
      }
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      tasksApi.update(id, { completed }),
    onMutate: async ({ id, completed }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks.byId(id) });
      
      // Snapshot the previous value
      const previousTask = queryClient.getQueryData<Task>(QUERY_KEYS.tasks.byId(id));
      
      // Optimistically update
      if (previousTask) {
        const optimisticTask = { ...previousTask, completed };
        queryClient.setQueryData(QUERY_KEYS.tasks.byId(id), optimisticTask);
        
        // Update in lists - remove from one list and add to another
        queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.all, (oldData) => {
          if (!oldData) return oldData;
          return oldData.map(task => 
            task.id === id ? optimisticTask : task
          );
        });

        if (completed) {
          // Moving to completed: remove from incompleted, add to completed
          queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.incompleted, (oldData) => {
            return oldData?.filter(task => task.id !== id) || [];
          });
          queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.completed, (oldData) => {
            return oldData ? [optimisticTask, ...oldData] : [optimisticTask];
          });
        } else {
          // Moving to incompleted: remove from completed, add to incompleted
          queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.completed, (oldData) => {
            return oldData?.filter(task => task.id !== id) || [];
          });
          queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks.incompleted, (oldData) => {
            return oldData ? [optimisticTask, ...oldData] : [optimisticTask];
          });
        }
      }
      
      return { previousTask };
    },
    onError: (_, { id }, context) => {
      // Rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(QUERY_KEYS.tasks.byId(id), context.previousTask);
      }
      invalidateTaskQueries();
    },
    onSuccess: (updatedTask) => {
      // Update with the real data from server
      queryClient.setQueryData(QUERY_KEYS.tasks.byId(updatedTask.id), updatedTask);
      invalidateTaskQueries();
    },
  });

  return {
    createTask: createTaskMutation,
    updateTask: updateTaskMutation,
    deleteTask: deleteTaskMutation,
    toggleTask: toggleTaskMutation,
  };
};