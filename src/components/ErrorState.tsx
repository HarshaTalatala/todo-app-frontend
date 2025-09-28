import { Alert, AlertTitle, Button, Box } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface ErrorStateProps {
  error: any;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorState({ 
  error, 
  onRetry, 
  title = 'Something went wrong' 
}: ErrorStateProps) {
  const message = error?.message || 'An unexpected error occurred';

  return (
    <Box sx={{ minHeight: '200px', p: 2 }}>
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
        {message}
        {onRetry && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Refresh />}
              onClick={onRetry}
            >
              Try Again
            </Button>
          </Box>
        )}
      </Alert>
    </Box>
  );
}