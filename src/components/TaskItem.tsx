import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTaskMutations } from '../hooks/useTaskMutations';
import ConfirmDialog from './ConfirmDialog';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const navigate = useNavigate();
  const { toggleTask, deleteTask } = useTaskMutations();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleComplete = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    toggleTask.mutate({
      id: task.id,
      completed: event.target.checked,
    });
  };

  const handleView = () => {
    handleMenuClose();
    navigate(`/tasks/${task.id}`);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/tasks/${task.id}/edit`);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteTask.mutate(task.id);
    setDeleteDialogOpen(false);
  };

  // Fallback for weird API response
  const normalizedTask = {
    id: task.id,
    title: (typeof task.task === 'string' && task.task) ? task.task : (task.title ? task.title : 'Untitled Task'),
    description: '',
    completed: typeof task.completed === 'boolean' ? task.completed : false,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };

  return (
    <>
      <Card
        elevation={1}
        sx={{
          mb: 1,
          cursor: 'pointer',
          transition: 'elevation 0.2s, box-shadow 0.2s',
          '&:hover': {
            elevation: 3,
            boxShadow: 3,
          },
          opacity: task.completed ? 0.8 : 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Checkbox
              checked={normalizedTask.completed}
              onChange={handleToggleComplete}
              onClick={(e) => e.stopPropagation()}
              disabled={toggleTask.isPending}
              size="small"
            />
            <Box flex={1} minWidth={0} sx={{ width: '100%' }}>
              <Typography
                variant="subtitle1"
                sx={{
                  textDecoration: normalizedTask.completed ? 'line-through' : 'none',
                  wordBreak: 'break-word',
                  mb: 0,
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
              >
                {normalizedTask.title}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              disabled={deleteTask.isPending}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

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