import { CircularProgress, Box } from '@mui/material';

interface LoaderProps {
  size?: number;
  message?: string;
}

export default function Loader({ size = 40, message }: LoaderProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      gap={2}
    >
      <CircularProgress size={size} />
      {message && (
        <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          {message}
        </Box>
      )}
    </Box>
  );
}