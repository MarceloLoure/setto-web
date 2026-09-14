import { Suspense } from 'react';
import RegisterArenaClient from '../../containers/registerArena/RegisterArenaClient';
import { CircularProgress, Box } from '@mui/material';

export default function RegisterArenaPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      }
    >
      <RegisterArenaClient />
    </Suspense>
  );
}