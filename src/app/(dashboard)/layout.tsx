'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import RequireAuth from '@/features/auth/components/RequireAuth';

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RequireAuth>
      <Header />
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </RequireAuth>
  );
}
