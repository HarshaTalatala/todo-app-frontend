# Task Management React App

A modern, full-featured React TypeScript application for managing tasks, built with Vite and designed to integrate seamlessly with a Spring Boot TaskController backend.

## 🚀 Features

- **Complete CRUD Operations**: Create, read, update, and delete tasks
- **Smart Filtering**: View all tasks, completed tasks, or incomplete tasks
- **Real-time Search**: Client-side search across task titles and descriptions
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors
- **Form Validation**: Comprehensive validation using Zod schemas
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Error Handling**: Robust error handling with user-friendly messages
- **Connectivity Check**: Automatic backend connectivity verification
- **Type Safety**: Full TypeScript coverage for enhanced developer experience

## 🛠 Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Server state management with caching and optimistic updates
- **Material-UI (MUI)** - Beautiful, accessible UI components
- **Axios** - HTTP client with interceptors
- **Zod** - Schema validation
- **React Hook Form** - Form handling with validation
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Spring Boot backend** running on `http://localhost:8080` with TaskController

## 🚦 Getting Started

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd task-app

# Install dependencies
npm install
```

### 2. Configure Environment

The application comes with default environment variables in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_TASKS_BASE_PATH=/api/tasks
```

**Important**: Adjust `VITE_TASKS_BASE_PATH` based on your Spring Boot controller setup:

- If your `TaskController` has `@RequestMapping("/tasks")` at class level: set to `/tasks`
- If your `TaskController` has `@RequestMapping("/api/tasks")` at class level: set to `/api/tasks`
- If no class-level mapping exists: set to `/api/tasks` (default)

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Backend Integration

Ensure your Spring Boot application is running with the TaskController exposing these endpoints:

- `GET /api/tasks/` - Get all tasks
- `GET /api/tasks/completed` - Get completed tasks
- `GET /api/tasks/incompleted` - Get incomplete tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks/` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/test` - Connectivity check

## 📁 Project Structure

```
src/
├── api/                    # API layer
│   ├── http.ts            # Axios instance with interceptors
│   └── tasks.ts           # Task API functions
├── components/            # Reusable UI components
│   ├── ConfirmDialog.tsx  # Confirmation dialog
│   ├── EmptyState.tsx     # Empty state display
│   ├── ErrorBoundary.tsx  # Global error boundary  
│   ├── ErrorState.tsx     # Error state display
│   ├── Loader.tsx         # Loading indicator
│   ├── TaskForm.tsx       # Task create/edit form
│   ├── TaskItem.tsx       # Individual task item
│   └── TaskList.tsx       # Task list with search
├── hooks/                 # Custom React hooks
│   ├── useTaskMutations.ts # Task mutations (create/update/delete)
│   └── useTasksQuery.ts   # Task queries with caching
├── pages/                 # Page components
│   ├── NotFoundPage.tsx   # 404 page
│   ├── TaskCreatePage.tsx # Create task page
│   ├── TaskDetailsPage.tsx # Task details page
│   ├── TaskEditPage.tsx   # Edit task page
│   └── TasksPage.tsx      # Main tasks page
├── routes/                # Routing configuration
│   └── AppRoutes.tsx      # Route definitions
├── test/                  # Test files
│   ├── api/              # API tests
│   └── components/       # Component tests
├── types/                 # TypeScript type definitions
│   └── task.ts           # Task-related types
├── App.tsx               # Main app component
└── main.tsx              # Application entry point
```

## 🧭 Available Routes

- `/` - Redirects to `/tasks`
- `/tasks` - Main tasks page with tabs (All/In Progress/Completed)
- `/tasks/new` - Create new task
- `/tasks/:id` - View task details
- `/tasks/:id/edit` - Edit existing task
- `*` - 404 page for undefined routes

## 🎛 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run preview      # Preview production build locally
```

### Building
```bash
npm run build        # Build for production
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Testing
```bash
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
```

## 🔧 Configuration

### Changing Backend URL

To point to a different backend server, update the `.env` file:

```env
VITE_API_BASE_URL=http://your-backend-server:port
VITE_TASKS_BASE_PATH=/your/api/path
```

### CORS Configuration

If you encounter CORS issues, you have two options:

1. **Use Vite Proxy** (Recommended for development):
   The app is configured to proxy `/api` requests to `http://localhost:8080`

2. **Backend CORS Configuration**:
   Add `@CrossOrigin` annotation to your Spring Boot controller:
   ```java
   @CrossOrigin(origins = "http://localhost:5173")
   @RestController
   @RequestMapping("/api/tasks")
   public class TaskController {
       // ... your methods
   }
   ```

### Task Model Compatibility

The frontend expects this Task model structure:

```typescript
interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string; // ISO 8601 format
  updatedAt?: string; // ISO 8601 format
}
```

Ensure your Spring Boot Task entity matches this structure or adjust the TypeScript types in `src/types/task.ts`.

## 🐛 Troubleshooting

### Backend Connection Issues

If you see a connectivity warning:

1. Verify your Spring Boot application is running on `http://localhost:8080`
2. Check that the TaskController endpoints are accessible
3. Verify the `VITE_TASKS_BASE_PATH` matches your controller's `@RequestMapping` path
4. Test the connectivity endpoint: `GET http://localhost:8080/api/tasks/test`

### Build Issues

If you encounter build errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run dev -- --force
```

### Port Conflicts

If port 5173 is in use:

```bash
# Run on a different port
npm run dev -- --port 3000
```

## 🧪 Testing

The application includes comprehensive tests for:

- API client functions
- Form validation logic
- Component rendering and interactions
- Search and filtering functionality

Run tests with:

```bash
npm run test:run  # Single run
npm run test      # Watch mode
npm run test:ui   # Interactive UI
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Environment Variables for Production

Create a `.env.production` file:

```env
VITE_API_BASE_URL=https://your-production-api.com
VITE_TASKS_BASE_PATH=/api/tasks
```

## 📝 API Endpoint Reference

Your Spring Boot TaskController should implement these endpoints:

| Method | Endpoint | Description | Expected Response |
|--------|----------|-------------|-------------------|
| GET | `/api/tasks/` | Get all tasks | `Task[]` |
| GET | `/api/tasks/completed` | Get completed tasks | `Task[]` |
| GET | `/api/tasks/incompleted` | Get incomplete tasks | `Task[]` |
| GET | `/api/tasks/{id}` | Get task by ID | `Task` or `Optional<Task>` |
| POST | `/api/tasks/` | Create new task | `Task` |
| PUT | `/api/tasks/{id}` | Update task | `Task` |
| DELETE | `/api/tasks/{id}` | Delete task | `ResponseEntity` |
| GET | `/api/tasks/test` | Connectivity check | `String` (e.g., "OK") |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run `npm run lint` and `npm run test:run`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Verify your backend is running and accessible
3. Check the browser console for error messages
4. Ensure your Task model matches the expected structure

---

**Happy Task Management!** 🎉
