export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TaskCreate = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export type TaskUpdate = Partial<Pick<Task, 'title' | 'description'>> & {
  completed?: boolean;
};

export interface ApiError {
  message: string;
  status?: number;
  field?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  success: boolean;
}