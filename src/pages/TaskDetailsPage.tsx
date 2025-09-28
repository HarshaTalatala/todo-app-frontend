import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { useTaskQuery } from '../hooks/useTasksQuery';
import { useTaskMutations } from '../hooks/useTaskMutations';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import ConfirmDialog from '../components/ConfirmDialog';

export default function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const taskId = parseInt(id || '0', 10);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { data: task, isLoading, isError, error, refetch } = useTaskQuery(taskId);
  const { toggleTask, deleteTask } = useTaskMutations();

  const handleBack = () => {
    navigate('/tasks');
  };

  const handleEdit = () => {
    navigate(`/tasks/${taskId}/edit`);
  };

  const handleToggleComplete = () => {
    if (task) {
      toggleTask.mutate({
        id: task.id,
        completed: !task.completed,
      });
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteTask.mutate(taskId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        navigate('/tasks');
      },
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Loader message="Loading task details..." />
      </Container>
    );
  }

  if (isError || !task) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5">Task Details</Typography>
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
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Box display="flex" alignItems="center">
            <IconButton onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5">Task Details</Typography>
          </Box>
          
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEdit}
              disabled={deleteTask.isPending}
            >
              Edit
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDeleteClick}
              disabled={deleteTask.isPending}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {/* Task Content */}
        <Paper elevation={1} sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Title and Status */}
            <Box>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <IconButton
                  onClick={handleToggleComplete}
                  disabled={toggleTask.isPending}
                  color={task.completed ? 'success' : 'default'}
                >
                  {task.completed ? <CheckCircle /> : <RadioButtonUnchecked />}
                </IconButton>
                
                <Typography
                  variant="h4"
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.7 : 1,
                    wordBreak: 'break-word',
                  }}
                >
                  {task.title}
                </Typography>
              </Box>
              
              <Chip
                label={task.completed ? 'Completed' : 'In Progress'}
                color={task.completed ? 'success' : 'default'}
                size="medium"
              />
            </Box>

            <Divider />

            {/* Description */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  minHeight: '60px',
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                {task.description || 'No description provided'}
              </Typography>
            </Box>

            <Divider />

            {/* Metadata */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Task ID:
                  </Typography>
                  <Typography variant="body2">#{task.id}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Created:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(task.createdAt)}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Last Updated:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(task.updatedAt)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        danger
      />
    </>
  );
}