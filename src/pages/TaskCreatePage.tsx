import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTaskMutations } from '../hooks/useTaskMutations';
import TaskForm from '../components/TaskForm';
import { useState } from 'react';
import type { TaskCreate, TaskUpdate } from '../types/task';

export default function TaskCreatePage() {
  const navigate = useNavigate();
  const { createTask } = useTaskMutations();
  const [successMessage, setSuccessMessage] = useState('');

  const handleBack = () => {
    navigate('/tasks');
  };

  const handleSubmit = (data: TaskCreate | TaskUpdate) => {
    createTask.mutate(data as TaskCreate, {
      onSuccess: (newTask) => {
        setSuccessMessage('Task created successfully!');
        // Navigate to the new task details page after a brief delay
        setTimeout(() => {
          navigate(`/tasks/${newTask.id}`);
        }, 1000);
      },
      onError: (error: any) => {
        console.error('Failed to create task:', error);
        // Error handling is managed by the form component through mutation state
      },
    });
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5">Create New Task</Typography>
        </Box>

        {/* Error Alert */}
        {createTask.isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="subtitle2">Failed to create task</Typography>
            {createTask.error?.message || 'An unexpected error occurred'}
          </Alert>
        )}

        {/* Form */}
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createTask.isPending}
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