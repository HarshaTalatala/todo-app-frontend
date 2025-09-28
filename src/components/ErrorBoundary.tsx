import { Component } from 'react';
import type { ReactNode } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Paper,
} from '@mui/material';
import { Refresh, Home } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log the error to console or error reporting service
    console.error('Application Error:', error);
    console.error('Error Info:', errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/tasks';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Alert severity="error" sx={{ mb: 4 }}>
              <AlertTitle>Application Error</AlertTitle>
              Something went wrong and the application crashed. We apologize for the inconvenience.
            </Alert>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                What happened?
              </Typography>
              <Typography variant="body1" paragraph>
                An unexpected error occurred while rendering the application. This could be due to:
              </Typography>
              <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
                <li>A temporary issue with the application</li>
                <li>A network connectivity problem</li>
                <li>An issue with the backend server</li>
                <li>A bug in the application code</li>
              </Typography>
            </Box>

            <Box display="flex" gap={2} mb={4}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReload}
              >
                Reload Application
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={this.handleGoHome}
              >
                Go to Home
              </Button>
            </Box>

            {/* Development error details */}
            {import.meta.env.DEV && this.state.error && (
              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  borderLeft: '4px solid',
                  borderColor: 'error.main',
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Error Details (Development Mode):
                </Typography>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: 'error.main',
                  }}
                >
                  {this.state.error.name}: {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;