'use client';

import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import RequireAuth from '@/features/auth/components/RequireAuth';

export default function SuperAdminPage() {
  return (
    <RequireAuth allowedRoles={['SUPERADMIN']}>
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Painel SuperAdmin
        </Typography>
        <Alert severity="info">
          Ainda não implementado — próximo passo é consumir os endpoints de
          `super-admin.controller.ts` da API (gestão global de usuários e arenas).
        </Alert>
      </Box>
    </RequireAuth>
  );
}
