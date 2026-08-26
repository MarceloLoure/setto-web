'use client';

import React, { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Typography, Stack } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';

/**
 * Todas as telas de gestão vivem sob /arenas/{arenaId}/algumaCoisa e buscam
 * dados usando o arenaId que vem da URL (useParams), não direto do contexto.
 * Por isso, ao trocar a arena ativa aqui, se o usuário já estiver dentro de
 * uma dessas telas, a gente reescreve a URL trocando só o id — isso dispara
 * o useEffect de cada página (que depende de arenaId) e recarrega os dados
 * da arena recém-selecionada automaticamente.
 */
function buildUrlForNewArena(pathname: string, newArenaId: string): string | null {
  const match = pathname.match(/^\/arenas\/([^/]+)(\/.*)?$/);
  if (!match) return null;
  const [, , rest] = match;
  return `/arenas/${newArenaId}${rest ?? ''}`;
}

export default function ArenaSwitcher() {
  const { activeArenaId, activeArena, managedArenas, setActiveArenaId } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (managedArenas.length === 0) return null;

  const handleSelect = (arenaId: string) => {
    setAnchorEl(null);
    if (arenaId === activeArenaId) return;
    setActiveArenaId(arenaId);

    // Só reescreve a URL se a rota atual pertencer a uma arena que o usuário
    // de fato administra — evita "sequestrar" a navegação caso ele esteja
    // vendo o perfil público de uma arena de terceiros (/arenas/:id).
    const currentArenaIdInUrl = pathname.match(/^\/arenas\/([^/]+)/)?.[1];
    const isOnManagedArenaRoute = currentArenaIdInUrl && managedArenas.some((a) => a.id === currentArenaIdInUrl);
    if (isOnManagedArenaRoute) {
      const nextUrl = buildUrlForNewArena(pathname, arenaId);
      if (nextUrl) router.push(nextUrl);
    }
  };

  // Só uma arena: mostra o nome fixo, sem dropdown (nada pra trocar).
  if (managedArenas.length === 1) {
    return (
      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        sx={{ px: 1.5, py: 0.75, borderRadius: 2, bgcolor: 'action.hover', maxWidth: 220 }}
      >
        <StorefrontIcon fontSize="small" color="primary" />
        <Typography variant="body2" fontWeight={600} noWrap>
          {activeArena?.name}
        </Typography>
      </Stack>
    );
  }

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        color="inherit"
        startIcon={<StorefrontIcon fontSize="small" />}
        endIcon={<ExpandMoreIcon fontSize="small" />}
        sx={{ textTransform: 'none', maxWidth: 240 }}
      >
        <Typography variant="body2" fontWeight={600} noWrap>
          {activeArena?.name ?? 'Selecionar arena'}
        </Typography>
      </Button>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 0.5, display: 'block' }}>
          Suas arenas
        </Typography>
        <Divider />
        {managedArenas.map((arena) => (
          <MenuItem key={arena.id} selected={arena.id === activeArenaId} onClick={() => handleSelect(arena.id)}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {arena.id === activeArenaId ? <CheckIcon fontSize="small" color="primary" /> : null}
            </ListItemIcon>
            <ListItemText primary={arena.name} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
