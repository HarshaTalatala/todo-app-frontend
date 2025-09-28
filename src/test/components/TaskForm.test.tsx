import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../../components/TaskForm';
import type { Task } from '../../types/task';

const mockOnSubmit = vi.fn();
const mockOnCancel = vi.fn();

describe('TaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    isLoading: false,
  };

  it('should render create form correctly', () => {
    render(<TaskForm {...defaultProps} />);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should render edit form correctly', () => {
    const task: Task = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
    };

    render(<TaskForm {...defaultProps} task={task} isEdit />);

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByLabelText(/mark as completed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
  });

  it('should validate required title field', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });

    // Try to submit without title
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should validate title length', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/title/i);
    const longTitle = 'a'.repeat(201); // Exceeds 200 character limit

    await user.type(titleInput, longTitle);

    await waitFor(() => {
      expect(screen.getByText('Title is too long')).toBeInTheDocument();
    });
  });

  it('should validate description length', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...defaultProps} />);

    const descriptionInput = screen.getByLabelText(/description/i);
    const longDescription = 'a'.repeat(1001); // Exceeds 1000 character limit

    await user.type(descriptionInput, longDescription);

    await waitFor(() => {
      expect(screen.getByText('Description is too long')).toBeInTheDocument();
    });
  });

  it('should submit form with valid data for creation', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'New Description');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
        completed: false,
      });
    });
  });

  it('should submit form with valid data for update', async () => {
    const user = userEvent.setup();
    const task: Task = {
      id: 1,
      title: 'Original Task',
      description: 'Original Description',
      completed: false,
    };

    render(<TaskForm {...defaultProps} task={task} isEdit />);

    const titleInput = screen.getByDisplayValue('Original Task');
    const completedCheckbox = screen.getByLabelText(/mark as completed/i);
    const submitButton = screen.getByRole('button', { name: /update task/i });

    // Clear and type new title
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Task');
    await user.click(completedCheckbox);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Updated Task',
        completed: true,
      });
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should disable form when loading', () => {
    render(<TaskForm {...defaultProps} isLoading />);

    expect(screen.getByLabelText(/title/i)).toBeDisabled();
    expect(screen.getByLabelText(/description/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });

  it('should show character count', () => {
    render(<TaskForm {...defaultProps} />);

    expect(screen.getByText('Title: 0/200 characters')).toBeInTheDocument();
  });

  it('should update character count as user types', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'Hello');

    expect(screen.getByText('Title: 5/200 characters')).toBeInTheDocument();
  });
});