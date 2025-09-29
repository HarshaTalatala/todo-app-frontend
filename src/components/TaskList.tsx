import { useState, useMemo } from 'react';
import { Box, TextField, InputAdornment, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';
import type { Task } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  onAddTask?: () => void;
  emptyTitle?: string;
  emptyMessage?: string;
}

export default function TaskList({ 
  tasks, 
  onAddTask,
  emptyTitle,
  emptyMessage,
}: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter((task) => {
      const title = (typeof task.task === 'string' && task.task) || task.title || '';
      const description = task.description || '';
      return title.toLowerCase().includes(query) || description.toLowerCase().includes(query);
    });
  }, [tasks, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (tasks.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        onAction={onAddTask}
      />
    );
  }

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {filteredTasks.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Try adjusting your search query
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {filteredTasks.length} of {tasks.length} tasks
          </Typography>
          
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </Box>
      )}
    </Box>
  );
}