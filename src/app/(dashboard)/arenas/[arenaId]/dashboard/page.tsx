'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Grid,
  LinearProgress,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CancelIcon from '@mui/icons-material/Cancel';
import PaidIcon from '@mui/icons-material/Paid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useParams } from 'next/navigation';
import { arenasApi } from '@/features/arenas/api';
import type { ArenaDashboardSummary, DashboardPeriod } from '@/features/arenas/types';

const PERIOD_LABELS: Record<DashboardPeriod, string> = { day: 'Dia', week: 'Semana', month: 'Mês' };

function currencyBR(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'primary' | 'error' | 'success' | 'warning';
}

function KpiCard({ icon: Icon, label, value, color }: KpiCardProps) {
  const theme = useTheme();
  // O plugin @pigment-css/nextjs-plugin tenta extrair `sx` estaticamente em
  // build-time e quebra com valores dinâmicos (ex: `${color}.main`) — por
  // isso resolvemos a cor via useTheme() e aplicamos com `style`, fora do sx,
  // em vez de deixar o Pigment tentar (e falhar) processar isso.
  const bgColor = theme.palette[color].main;
  const textColor = theme.palette[color].contrastText;

  return (
    <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{ width: 44, height: 44, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9 }}
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          <Icon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function ArenaDashboardPage() {
  const { arenaId } = useParams<{ arenaId: string }>();
  const [period, setPeriod] = useState<DashboardPeriod>('week');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState<ArenaDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await arenasApi.getDashboardSummary(arenaId, period, date);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar o dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arenaId, period, date]);

  const rangeLabel =
    summary?.rangeStart === summary?.rangeEnd
      ? new Date(`${summary?.rangeStart}T00:00:00`).toLocaleDateString('pt-BR')
      : `${new Date(`${summary?.rangeStart}T00:00:00`).toLocaleDateString('pt-BR')} — ${new Date(`${summary?.rangeEnd}T00:00:00`).toLocaleDateString('pt-BR')}`;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Dashboard
          </Typography>
          {summary && (
            <Typography variant="body2" color="text.secondary">
              {rangeLabel}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
          <ToggleButtonGroup
            size="small"
            value={period}
            exclusive
            onChange={(_, value) => value && setPeriod(value)}
          >
            {(['day', 'week', 'month'] as DashboardPeriod[]).map((p) => (
              <ToggleButton key={p} value={p}>
                {PERIOD_LABELS[p]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <TextField type="date" size="small" value={date} onChange={(e) => setDate(e.target.value)} />
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {isLoading || !summary ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard icon={EventAvailableIcon} label="Agendamentos" value={String(summary.bookings.total)} color="primary" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard icon={CheckCircleIcon} label="Confirmados" value={String(summary.bookings.confirmed)} color="success" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard icon={CancelIcon} label="Cancelamentos" value={String(summary.bookings.cancelled)} color="error" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard icon={PaidIcon} label="Faturamento" value={currencyBR(summary.revenue.total)} color="warning" />
            </Grid>
          </Grid>

          <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2.5 } }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Ocupação por quadra
            </Typography>
            <Stack spacing={2}>
              {summary.courts.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma quadra ativa cadastrada.
                </Typography>
              ) : (
                summary.courts.map((court) => (
                  <Box key={court.courtId}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {court.courtName}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label={`${court.bookedSlots} ocupados`} size="small" color="primary" variant="outlined" />
                        <Chip label={`${court.freeSlots} livres`} size="small" color="success" variant="outlined" />
                        <Typography variant="caption" color="text.secondary">
                          {court.occupancyRate}%
                        </Typography>
                      </Stack>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={court.occupancyRate}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </>
      )}
    </Box>
  );
}
