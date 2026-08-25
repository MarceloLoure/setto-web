'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { courtsApi } from '@/features/courts/api';
import type { Court } from '@/features/courts/types';
import CourtFormDialog from '@/features/courts/components/CourtFormDialog';

const SPORTS: Record<string, string> = {
  BEACH_TENNIS: 'Beach Tennis',
  FOOTVOLLEY: 'Futevôlei',
  VOLLEYBALL: 'Vôlei',
};

export default function ArenaCourtsPage() {
  const { arenaId } = useParams<{ arenaId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOnboarding = searchParams.get('onboarding') === '1';

  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadCourts = async () => {
    setIsLoading(true);
    try {
      const data = await courtsApi.listByArena(arenaId);
      setCourts(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arenaId]);

  const handleDelete = async (courtId: string) => {
    if (!confirm('Remover esta quadra?')) return;
    await courtsApi.remove(courtId);
    await loadCourts();
  };

  return (
    <Box>
      {isOnboarding && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          action={
            courts.length > 0 && (
              <Button
                color="inherit"
                size="small"
                endIcon={<ScheduleIcon fontSize="small" />}
                onClick={() => router.push(`/arenas/${arenaId}/schedule`)}
              >
                Definir horário
              </Button>
            )
          }
        >
          Arena cadastrada! Agora cadastre pelo menos uma quadra pra começar a receber reservas.
        </Alert>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Quadras
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Nova quadra
        </Button>
      </Stack>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : courts.length === 0 ? (
        <Typography color="text.secondary">Nenhuma quadra cadastrada ainda.</Typography>
      ) : (
        <Grid container spacing={2}>
          {courts.map((court) => (
            <Grid key={court.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="subtitle1" fontWeight={600}>
                      {court.name}
                    </Typography>
                    <IconButton size="small" onClick={() => handleDelete(court.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                    <Chip label={SPORTS[court.sport] ?? court.sport} size="small" />
                    <Chip label={court.isCovered ? 'Coberta' : 'Descoberta'} size="small" variant="outlined" />
                    <Chip label={court.isActive ? 'Ativa' : 'Inativa'} size="small" color={court.isActive ? 'success' : 'default'} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    R$ {Number(court.hourlyRate).toFixed(2)}/hora
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <CourtFormDialog
        open={dialogOpen}
        arenaId={arenaId}
        onClose={() => setDialogOpen(false)}
        onSaved={() => loadCourts()}
      />
    </Box>
  );
}
