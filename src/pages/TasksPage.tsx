import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Paper,
  Alert,
  Collapse,
} from '@mui/material';
import { Add, Refresh, Close } from '@mui/icons-material';
import { useTasksQuery, usePingQuery } from '../hooks/useTasksQuery';
import TaskList from '../components/TaskList';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';

type TabValue = 'all' | 'completed' | 'incompleted';

interface TabPanelProps {
  children?: React.ReactNode;
  index: TabValue;
  value: TabValue;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tasks-tabpanel-${index}`}
      aria-labelledby={`tasks-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TasksPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [showConnectivityWarning, setShowConnectivityWarning] = useState(true);

  const tasksQuery = useTasksQuery(activeTab);
  const pingQuery = usePingQuery();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  const handleAddTask = () => {
    navigate('/tasks/new');
  };

  const handleRefresh = () => {
    tasksQuery.refetch();
    pingQuery.refetch();
  };

  const isConnected = !pingQuery.isError;
  const showWarning = !isConnected && showConnectivityWarning;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Connectivity Warning */}
      <Collapse in={showWarning}>
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowConnectivityWarning(false)}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          <Typography variant="subtitle2">Backend Connection Issue</Typography>
          Unable to connect to the backend server. Please make sure the Spring
          backend is running on http://localhost:8080.
        </Alert>
      </Collapse>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          My Tasks
        </Typography>
        
        <Box display="flex" gap={1}>
          <IconButton
            onClick={handleRefresh}
            disabled={tasksQuery.isFetching}
            title="Refresh"
          >
            <Refresh />
          </IconButton>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddTask}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="task filter tabs"
          variant="fullWidth"
        >
          <Tab label="All Tasks" value="all" id="tasks-tab-all" />
          <Tab label="In Progress" value="incompleted" id="tasks-tab-incompleted" />
          <Tab label="Completed" value="completed" id="tasks-tab-completed" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index="all">
        {tasksQuery.isLoading ? (
          <Loader message="Loading all tasks..." />
        ) : tasksQuery.isError ? (
          <ErrorState
            error={tasksQuery.error}
            onRetry={() => tasksQuery.refetch()}
            title="Failed to load tasks"
          />
        ) : (
          <TaskList
            tasks={tasksQuery.data || []}
            onAddTask={handleAddTask}
            emptyTitle="No tasks yet"
            emptyMessage="Get started by creating your first task"
          />
        )}
      </TabPanel>

      <TabPanel value={activeTab} index="incompleted">
        {tasksQuery.isLoading ? (
          <Loader message="Loading incomplete tasks..." />
        ) : tasksQuery.isError ? (
          <ErrorState
            error={tasksQuery.error}
            onRetry={() => tasksQuery.refetch()}
            title="Failed to load incomplete tasks"
          />
        ) : (
          <TaskList
            tasks={tasksQuery.data || []}
            onAddTask={handleAddTask}
            emptyTitle="All caught up!"
            emptyMessage="You have no incomplete tasks. Great job!"
          />
        )}
      </TabPanel>

      <TabPanel value={activeTab} index="completed">
        {tasksQuery.isLoading ? (
          <Loader message="Loading completed tasks..." />
        ) : tasksQuery.isError ? (
          <ErrorState
            error={tasksQuery.error}
            onRetry={() => tasksQuery.refetch()}
            title="Failed to load completed tasks"
          />
        ) : (
          <TaskList
            tasks={tasksQuery.data || []}
            onAddTask={handleAddTask}
            emptyTitle="No completed tasks"
            emptyMessage="Complete some tasks to see them here"
          />
        )}
      </TabPanel>
    </Container>
  );
}