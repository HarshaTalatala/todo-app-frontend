import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTaskQuery } from '../hooks/useTasksQuery';
import { useTaskMutations } from '../hooks/useTaskMutations';
import TaskForm from '../components/TaskForm';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import type { TaskCreate, TaskUpdate } from '../types/task';

export default function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const taskId = parseInt(id || '0', 10);
  
  const [successMessage, setSuccessMessage] = useState('');

  const { data: task, isLoading, isError, error, refetch } = useTaskQuery(taskId);
  const { updateTask } = useTaskMutations();

  const handleBack = () => {
    navigate(`/tasks/${taskId}`);
  };

  const handleSubmit = (data: TaskCreate | TaskUpdate) => {
    updateTask.mutate(
      { id: taskId, data: data as TaskUpdate },
      {
        onSuccess: (updatedTask) => {
          setSuccessMessage('Task updated successfully!');
          // Navigate back to task details after a brief delay
          setTimeout(() => {
            navigate(`/tasks/${updatedTask.id}`);
          }, 1000);
        },
        onError: (error: any) => {
          console.error('Failed to update task:', error);
        },
      }
    );
  };

  const handleCancel = () => {
    navigate(`/tasks/${taskId}`);
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Loader message="Loading task..." />
      </Container>
    );
  }

  if (isError || !task) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/tasks')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5">Edit Task</Typography>
        </Box>
        
        <ErrorState
          error={error || new Error('Task not found')}
          onRetry={refetch}
          title={task === null ? 'Task not found' : 'Failed to load task'}
        />
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5">Edit Task</Typography>
        </Box>

        {/* Error Alert */}
        {updateTask.isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="subtitle2">Failed to update task</Typography>
            {updateTask.error?.message || 'An unexpected error occurred'}
          </Alert>
        )}

        {/* Form */}
        <TaskForm
          task={task}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={updateTask.isPending}
          isEdit
        />
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}