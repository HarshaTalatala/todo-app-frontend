import { describe, it, expect, vi, beforeEach } from 'vitest';
import tasksApi from '../../api/tasks';
import type { Task, TaskCreate, TaskUpdate } from '../../types/task';

// Mock http instance
const mockHttp = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

vi.mock('../../api/http', () => ({
  default: mockHttp,
}));

describe('tasksApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  describe('listAll', () => {
    it('should fetch all tasks', async () => {
      const mockTasks = [mockTask];
      mockHttp.get.mockResolvedValue({ data: mockTasks });

      const result = await tasksApi.listAll();

      expect(mockHttp.get).toHaveBeenCalledWith('/');
      expect(result).toEqual(mockTasks);
    });
  });

  describe('listCompleted', () => {
    it('should fetch completed tasks', async () => {
      const completedTask = { ...mockTask, completed: true };
      mockHttp.get.mockResolvedValue({ data: [completedTask] });

      const result = await tasksApi.listCompleted();

      expect(mockHttp.get).toHaveBeenCalledWith('/completed');
      expect(result).toEqual([completedTask]);
    });
  });

  describe('listIncompleted', () => {
    it('should fetch incomplete tasks', async () => {
      mockHttp.get.mockResolvedValue({ data: [mockTask] });

      const result = await tasksApi.listIncompleted();

      expect(mockHttp.get).toHaveBeenCalledWith('/incompleted');
      expect(result).toEqual([mockTask]);
    });
  });

  describe('getById', () => {
    it('should fetch task by id', async () => {
      mockHttp.get.mockResolvedValue({ data: mockTask });

      const result = await tasksApi.getById(1);

      expect(mockHttp.get).toHaveBeenCalledWith('/1');
      expect(result).toEqual(mockTask);
    });

    it('should return null for 404 error', async () => {
      mockHttp.get.mockRejectedValue({ status: 404 });

      const result = await tasksApi.getById(999);

      expect(result).toBeNull();
    });

    it('should rethrow non-404 errors', async () => {
      const error = { status: 500, message: 'Server error' };
      mockHttp.get.mockRejectedValue(error);

      await expect(tasksApi.getById(1)).rejects.toEqual(error);
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskCreate: TaskCreate = {
        title: 'New Task',
        description: 'New Description',
        completed: false,
      };
      mockHttp.post.mockResolvedValue({ data: mockTask });

      const result = await tasksApi.create(taskCreate);

      expect(mockHttp.post).toHaveBeenCalledWith('/', taskCreate);
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskUpdate: TaskUpdate = {
        title: 'Updated Task',
        completed: true,
      };
      const updatedTask = { ...mockTask, ...taskUpdate };
      mockHttp.put.mockResolvedValue({ data: updatedTask });

      const result = await tasksApi.update(1, taskUpdate);

      expect(mockHttp.put).toHaveBeenCalledWith('/1', taskUpdate);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      mockHttp.delete.mockResolvedValue({});

      const result = await tasksApi.remove(1);

      expect(mockHttp.delete).toHaveBeenCalledWith('/1');
      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      mockHttp.delete.mockRejectedValue(new Error('Delete failed'));

      const result = await tasksApi.remove(1);

      expect(result).toBe(false);
    });
  });

  describe('ping', () => {
    it('should ping the server', async () => {
      const response = 'pong';
      mockHttp.get.mockResolvedValue({ data: response });

      const result = await tasksApi.ping();

      expect(mockHttp.get).toHaveBeenCalledWith('/test');
      expect(result).toBe(response);
    });
  });
});