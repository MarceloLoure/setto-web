'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Stack, Chip, Grid, Card, CardContent, CardMedia, Button, CircularProgress, Alert } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { arenasApi } from '@/features/arenas/api';
import type { ArenaDetail } from '@/features/arenas/types';

// Página 100% client-side (busca dados após montar) — não faz sentido tentar
// pré-renderizar estaticamente uma rota dinâmica que depende de fetch em runtime.
export const dynamic = 'force-dynamic';


export default function ArenaDetailPage() {
  const { arenaId } = useParams<{ arenaId: string }>();
  const [arena, setArena] = useState<ArenaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    arenasApi
      .getById(arenaId)
      .then(setArena)
      .catch((err) => setError(err instanceof Error ? err.message : 'Falha ao carregar arena.'))
      .finally(() => setIsLoading(false));
  }, [arenaId]);

  const handleToggleFollow = async () => {
    if (!arena) return;
    setArena({ ...arena, isFollowing: !arena.isFollowing, totalFollowers: arena.totalFollowers + (arena.isFollowing ? -1 : 1) });
    try {
      await arenasApi.toggleFollow(arenaId);
    } catch {
      arenasApi.getById(arenaId).then(setArena);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!arena) return null;

  return (
    <Box>
      {/* CardMedia com component="img" vira uma tag <img> real — evita o bug do
          plugin @pigment-css/nextjs-plugin ao tentar extrair estaticamente um
          `backgroundImage` com URL dinâmica dentro de `sx` (ver nota no fim do arquivo) */}
      <CardMedia
        component="img"
        image={arena.cover?.path || arena.photos?.[0]?.path || '/arena-placeholder.png'}
        alt={arena.name}
        sx={{ height: 220, borderRadius: 3, mb: 3, objectFit: 'cover', bgcolor: 'background.paper' }}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {arena.name}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
            <PlaceIcon fontSize="small" />
            <Typography variant="body2">
              {arena.address}, {arena.number} - {arena.neighborhood}, {arena.city}/{arena.state}
            </Typography>
          </Stack>
        </Box>
        <Button
          variant={arena.isFollowing ? 'outlined' : 'contained'}
          startIcon={arena.isFollowing ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={handleToggleFollow}
        >
          {arena.isFollowing ? 'Seguindo' : 'Seguir'}
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Chip label={`${arena.totalActiveCourts} quadras`} size="small" />
        <Chip label={`${arena.totalFollowers} seguidores`} size="small" variant="outlined" />
      </Stack>

      <Typography variant="h6" fontWeight={600} gutterBottom>
        Quadras
      </Typography>
      <Grid container spacing={2}>
        {arena.courts.map((court) => (
          <Grid key={court.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography fontWeight={600}>{court.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {court.sport} {court.isCovered ? '· Coberta' : '· Descoberta'}
                </Typography>
                <Typography variant="body1" fontWeight={700} sx={{ mt: 1 }}>
                  R$ {Number(court.hourlyRate).toFixed(2)}/h
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
