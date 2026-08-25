'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Grid, TextField, InputAdornment, CircularProgress, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { arenasApi } from '@/features/arenas/api';
import type { ArenaListItem } from '@/features/arenas/types';
import ArenaCard from '@/features/arenas/components/ArenaCard';

export default function ArenasListPage() {
  const [arenas, setArenas] = useState<ArenaListItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const load = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await arenasApi.list({ search: searchTerm || undefined, limit: 20 });
      setArenas(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar arenas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => load(search), 300); // debounce simples de busca
    return () => clearTimeout(timeout);
  }, [search, load]);

  const handleToggleFollow = async (arenaId: string) => {
    // Atualização otimista — reverte se a chamada falhar
    setArenas((prev) =>
      prev.map((a) =>
        a.id === arenaId
          ? { ...a, isFollowing: !a.isFollowing, totalFollowers: a.totalFollowers + (a.isFollowing ? -1 : 1) }
          : a,
      ),
    );
    try {
      await arenasApi.toggleFollow(arenaId);
    } catch {
      load(search);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Arenas
      </Typography>

      <TextField
        placeholder="Buscar por nome, cidade ou bairro..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 3, maxWidth: 480 }}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {isLoading ? (
        <CircularProgress />
      ) : arenas.length === 0 ? (
        <Typography color="text.secondary">Nenhuma arena encontrada.</Typography>
      ) : (
        <Grid container spacing={2}>
          {arenas.map((arena) => (
            <Grid key={arena.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ArenaCard
                arena={arena}
                onClick={() => router.push(`/arenas/${arena.id}`)}
                onToggleFollow={() => handleToggleFollow(arena.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
