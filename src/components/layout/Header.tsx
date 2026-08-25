'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Stack, Avatar, Menu, MenuItem, Chip } from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Link from 'next/link';
import { useAuth } from '@/features/auth/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        <Stack component={Link} href="/" direction="row" spacing={1} alignItems="center" sx={{ textDecoration: 'none' }}>
          <SportsTennisIcon color="primary" sx={{ fontSize: 30 }} />
          <Typography variant="h6" fontWeight={700} color="primary.main">
            Beach Social Club
          </Typography>
        </Stack>

        {!isAuthenticated ? (
          <Stack direction="row" spacing={2}>
            <Button component={Link} href="/login" color="inherit">
              Entrar
            </Button>
            <Button component={Link} href="/register" variant="contained">
              Cadastrar
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip label={user?.role} size="small" color="primary" variant="outlined" />
            <Avatar
              src={user?.avatar?.path}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ cursor: 'pointer', width: 36, height: 36 }}
            >
              {user?.name?.[0]}
            </Avatar>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled sx={{ opacity: '1 !important' }}>
                <Stack>
                  <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                </Stack>
              </MenuItem>
              <MenuItem component={Link} href="/profile" onClick={() => setAnchorEl(null)}>
                <PersonOutlineIcon fontSize="small" sx={{ mr: 1 }} /> Editar perfil
              </MenuItem>
              <MenuItem onClick={() => logout()}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Sair
              </MenuItem>
            </Menu>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
