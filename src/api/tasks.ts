import http from './http';
import type { Task, TaskCreate, TaskUpdate } from '../types/task';

export const tasksApi = {
  // GET /api/tasks - Get all tasks
  listAll: async (): Promise<Task[]> => {
    const response = await http.get<Task[]>('/');
    return response.data;
  },

  // GET /api/tasks/completed - Get completed tasks
  listCompleted: async (): Promise<Task[]> => {
    const response = await http.get<Task[]>('/completed');
    return response.data;
  },

  // GET /api/tasks/incompleted - Get incomplete tasks
  listIncompleted: async (): Promise<Task[]> => {
    const response = await http.get<Task[]>('/incompleted');
    return response.data;
  },

  // GET /api/tasks/{id} - Get task by ID
  getById: async (id: number): Promise<Task | null> => {
    try {
      const response = await http.get<Task>(`/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // POST /api/tasks - Create new task
  create: async (payload: TaskCreate): Promise<Task> => {
    const response = await http.post<Task>('/', payload);
    return response.data;
  },

  // PUT /api/tasks/{id} - Update task
  update: async (id: number, payload: TaskUpdate): Promise<Task> => {
    const response = await http.put<Task>(`/${id}`, payload);
    return response.data;
  },

  // DELETE /api/tasks/{id} - Delete task
  remove: async (id: number): Promise<boolean> => {
    try {
      await http.delete(`/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      return false;
    }
  },

  // GET /api/tasks/test - Connectivity test
  ping: async (): Promise<string> => {
    const response = await http.get<string>('/test');
    return response.data;
  },
};

export default tasksApi;