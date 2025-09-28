import { Routes, Route, Navigate } from 'react-router-dom';
import TasksPage from '../pages/TasksPage';
import TaskDetailsPage from '../pages/TaskDetailsPage';
import TaskCreatePage from '../pages/TaskCreatePage';
import TaskEditPage from '../pages/TaskEditPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to tasks */}
      <Route path="/" element={<Navigate to="/tasks" replace />} />
      
      {/* Tasks routes */}
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/tasks/new" element={<TaskCreatePage />} />
      <Route path="/tasks/:id" element={<TaskDetailsPage />} />
      <Route path="/tasks/:id/edit" element={<TaskEditPage />} />
      
      {/* 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}