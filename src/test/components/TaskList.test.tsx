import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TaskList from '../../components/TaskList';
import type { Task } from '../../types/task';

// Mock the hooks
vi.mock('../../hooks/useTaskMutations', () => ({
  useTaskMutations: () => ({
    toggleTask: { mutate: vi.fn(), isPending: false },
    deleteTask: { mutate: vi.fn(), isPending: false },
  }),
}));

const mockOnAddTask = vi.fn();

// Test wrapper with providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const theme = createTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'First Task',
      description: 'First Description',
      completed: false,
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Second Task',
      description: 'Second Description',
      completed: true,
      createdAt: '2023-01-02T00:00:00Z',
    },
    {
      id: 3,
      title: 'Third Task',
      completed: false,
      createdAt: '2023-01-03T00:00:00Z',
    },
  ];

  it('should render empty state when no tasks', () => {
    render(
      <TestWrapper>
        <TaskList tasks={[]} onAddTask={mockOnAddTask} />
      </TestWrapper>
    );

    expect(screen.getByText('No tasks found')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating your first task')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('should render custom empty state message', () => {
    render(
      <TestWrapper>
        <TaskList 
          tasks={[]} 
          onAddTask={mockOnAddTask}
          emptyTitle="Custom Empty Title"
          emptyMessage="Custom empty message"
        />
      </TestWrapper>
    );

    expect(screen.getByText('Custom Empty Title')).toBeInTheDocument();
    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  it('should render task list with search functionality', () => {
    render(
      <TestWrapper>
        <TaskList tasks={mockTasks} onAddTask={mockOnAddTask} />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
    expect(screen.getByText('3 of 3 tasks')).toBeInTheDocument();
    expect(screen.getByText('First Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
    expect(screen.getByText('Third Task')).toBeInTheDocument();
  });

  it('should filter tasks by search query', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TaskList tasks={mockTasks} onAddTask={mockOnAddTask} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    await user.type(searchInput, 'First');

    expect(screen.getByText('1 of 3 tasks')).toBeInTheDocument();
    expect(screen.getByText('First Task')).toBeInTheDocument();
    expect(screen.queryByText('Second Task')).not.toBeInTheDocument();
    expect(screen.queryByText('Third Task')).not.toBeInTheDocument();
  });

  it('should search in both title and description', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TaskList tasks={mockTasks} onAddTask={mockOnAddTask} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    await user.type(searchInput, 'Description');

    expect(screen.getByText('2 of 3 tasks')).toBeInTheDocument();
    expect(screen.getByText('First Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
    expect(screen.queryByText('Third Task')).not.toBeInTheDocument();
  });

  it('should show no results message when search yields no matches', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TaskList tasks={mockTasks} onAddTask={mockOnAddTask} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    await user.type(searchInput, 'nonexistent');

    expect(screen.getByText('No tasks found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search query')).toBeInTheDocument();
  });

  it('should call onAddTask when empty state button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TaskList tasks={[]} onAddTask={mockOnAddTask} />
      </TestWrapper>
    );

    const addButton = screen.getByRole('button', { name: /add task/i });
    await user.click(addButton);

    expect(mockOnAddTask).toHaveBeenCalled();
  });

  it('should be case-insensitive when searching', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TaskList tasks={mockTasks} onAddTask={mockOnAddTask} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    await user.type(searchInput, 'FIRST');

    expect(screen.getByText('1 of 3 tasks')).toBeInTheDocument();
    expect(screen.getByText('First Task')).toBeInTheDocument();
  });

  it('should clear search results when search input is cleared', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TaskList tasks={mockTasks} onAddTask={mockOnAddTask} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    
    // Search for something
    await user.type(searchInput, 'First');
    expect(screen.getByText('1 of 3 tasks')).toBeInTheDocument();

    // Clear search
    await user.clear(searchInput);
    expect(screen.getByText('3 of 3 tasks')).toBeInTheDocument();
  });
});