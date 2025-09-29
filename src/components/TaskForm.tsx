import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Paper,
  Typography,
  Stack,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import type { Task, TaskCreate, TaskUpdate } from '../types/task';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  completed: z.boolean().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskCreate | TaskUpdate) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export default function TaskForm({
  task,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      completed: task?.completed || false,
    },
    mode: 'onChange',
  });

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        completed: task.completed,
      });
    }
  }, [task, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    if (isEdit) {
      // For updates, only send changed fields
      const updates: TaskUpdate = {};
      if (data.title !== task?.title) updates.title = data.title;
      if (data.completed !== task?.completed) updates.completed = data.completed;
      onSubmit(updates);
    } else {
      // For creation, send all fields (except completed if false)
      const createData: TaskCreate = {
        title: data.title,
        completed: data.completed || false,
      };
      onSubmit(createData);
    }
  };

  const titleValue = watch('title');

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Task' : 'Create New Task'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={3}>
          <TextField
            label="Title"
            fullWidth
            required
            error={!!errors.title}
            helperText={errors.title?.message}
            {...register('title')}
            disabled={isLoading}
          />

          {isEdit && (
            <FormControlLabel
              control={
                <Checkbox
                  {...register('completed')}
                  disabled={isLoading}
                />
              }
              label="Mark as completed"
            />
          )}

          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isLoading}
              startIcon={<Cancel />}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !isValid}
              startIcon={<Save />}
            >
              {isLoading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
            </Button>
          </Box>

          {/* Form validation summary */}
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            <Typography variant="caption" display="block">
              Title: {titleValue?.length || 0}/200 characters
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}