import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
  Box,
  Chip,
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card
        sx={{
          mb: 2,
          cursor: 'pointer',
          transition: 'elevation 0.2s',
          '&:hover': {
            elevation: 2,
          },
          opacity: task.completed ? 0.7 : 1,
        }}
        onClick={() => navigate(`/tasks/${task.id}`)}
      >
        <CardContent>
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Checkbox
              checked={task.completed}
              onChange={handleToggleComplete}
              onClick={(e) => e.stopPropagation()}
              disabled={toggleTask.isPending}
            />
            
            <Box flex={1} minWidth={0}>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  wordBreak: 'break-word',
                }}
              >
                {task.title}
              </Typography>
              
              {task.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {task.description}
                </Typography>
              )}
              
              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <Chip
                  label={task.completed ? 'Completed' : 'In Progress'}
                  color={task.completed ? 'success' : 'default'}
                  size="small"
                />
                
                {task.createdAt && (
                  <Typography variant="caption" color="text.disabled">
                    Created {formatDate(task.createdAt)}
                  </Typography>
                )}
                
                {task.updatedAt && task.updatedAt !== task.createdAt && (
                  <Typography variant="caption" color="text.disabled">
                    • Updated {formatDate(task.updatedAt)}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              disabled={deleteTask.isPending}
            >
              <MoreVert />
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