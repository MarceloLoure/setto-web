'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CancelIcon from '@mui/icons-material/Cancel';
import PaidIcon from '@mui/icons-material/Paid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useParams } from 'next/navigation';
import type { ApexOptions } from 'apexcharts';
import { arenasApi } from '@/features/arenas/api';
import type { ArenaDashboardSummary, DashboardPeriod, UpcomingBooking } from '@/features/arenas/types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const PERIOD_LABELS: Record<DashboardPeriod, string> = { day: 'Dia', week: 'Semana', month: 'Mês' };

const METHOD_LABELS: Record<string, string> = {
  PIX: 'Pix',
  CREDIT_CARD: 'Cartão de crédito',
  DEBIT_CARD: 'Cartão de débito',
  CASH: 'Dinheiro',
};

const CATEGORY_LABELS: Record<string, string> = {
  BOOKING: 'Agendamentos',
  BAR_SNACKBAR: 'Lanchonete / Bar',
  EQUIPMENT_RENTAL: 'Aluguel de equipamento',
  SPONSORSHIP: 'Patrocínio',
  OTHER: 'Outros',
};

const STATUS_LABELS: Record<UpcomingBooking['status'], string> = {
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
  COMPLETED: 'Concluído',
  PENDING: 'Pendente',
  RESERVED_LOCAL: 'Reservado (balcão)',
  NO_SHOW: 'Não compareceu',
};

const STATUS_COLORS: Record<UpcomingBooking['status'], 'primary' | 'error' | 'success' | 'warning' | 'default' | 'info'> = {
  CONFIRMED: 'success',
  CANCELLED: 'error',
  COMPLETED: 'default',
  PENDING: 'warning',
  RESERVED_LOCAL: 'info',
  NO_SHOW: 'error',
};

function currencyBR(value: number | string) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function timeLabel(value: string) {
  return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  helper?: string;
  color: 'primary' | 'error' | 'success' | 'warning' | 'info';
}

function KpiCard({ icon: Icon, label, value, helper, color }: KpiCardProps) {
  const theme = useTheme();
  // O plugin @pigment-css/nextjs-plugin tenta extrair `sx` estaticamente em
  // build-time e quebra com valores dinâmicos (ex: `${color}.main`) — por
  // isso resolvemos a cor via useTheme() e aplicamos com `style`, fora do sx,
  // em vez de deixar o Pigment tentar (e falhar) processar isso.
  const palette = theme.palette[color] ?? theme.palette.primary;
  const bgColor = palette.main;
  const textColor = palette.contrastText;

  return (
    <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{ width: 44, height: 44, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          <Icon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" noWrap>
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={700} noWrap>
            {value}
          </Typography>
          {helper && (
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {helper}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

function ChartCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2.5 }, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        {action}
      </Stack>
      {children}
    </Paper>
  );
}

export default function ArenaDashboardPage() {
  const theme = useTheme();
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

  const rangeLabel = summary
    ? summary.rangeStart === summary.rangeEnd
      ? new Date(`${summary.rangeStart}T00:00:00`).toLocaleDateString('pt-BR')
      : `${new Date(`${summary.rangeStart}T00:00:00`).toLocaleDateString('pt-BR')} — ${new Date(`${summary.rangeEnd}T00:00:00`).toLocaleDateString('pt-BR')}`
    : '';

  // Paleta dos gráficos derivada do tema da marca (Setto), pra manter a identidade
  // visual em vez de importar as cores roxo/azul do Berry.
  const chartPalette = useMemo(
    () => [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.success.main,
    ],
    [theme],
  );

  const occupancyChart = useMemo(() => {
    if (!summary) return null;
    const categories = summary.courts.map((c) => c.courtName);
    const options: ApexOptions = {
      chart: { type: 'radialBar', toolbar: { show: false }, background: 'transparent' },
      colors: chartPalette,
      labels: categories,
      plotOptions: {
        radialBar: {
          hollow: { size: '35%' },
          dataLabels: {
            name: { fontSize: '12px', color: theme.palette.text.secondary },
            value: { fontSize: '14px', color: theme.palette.text.primary, formatter: (v) => `${v}%` },
          },
        },
      },
      legend: { show: true, position: 'bottom', labels: { colors: theme.palette.text.secondary }, fontSize: '12px' },
      stroke: { lineCap: 'round' },
    };
    const series = summary.courts.map((c) => c.occupancyRate);
    return { options, series };
  }, [summary, chartPalette, theme]);

  const bookingsPerCourtChart = useMemo(() => {
    if (!summary) return null;
    const options: ApexOptions = {
      chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
      plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '55%' } },
      colors: [theme.palette.primary.main],
      dataLabels: { enabled: false },
      xaxis: {
        categories: summary.courts.map((c) => c.courtName),
        labels: { style: { colors: theme.palette.text.secondary } },
      },
      yaxis: { labels: { style: { colors: theme.palette.text.secondary } } },
      grid: { borderColor: theme.palette.divider },
      tooltip: { theme: 'dark' },
    };
    const series = [{ name: 'Agendamentos', data: summary.courts.map((c) => c.bookingsCount) }];
    return { options, series };
  }, [summary, theme]);

  const revenueByMethodChart = useMemo(() => {
    if (!summary) return null;
    const entries = Object.entries(summary.revenue.byMethod).filter(([, v]) => v > 0);
    const options: ApexOptions = {
      chart: { type: 'donut', background: 'transparent' },
      colors: chartPalette,
      labels: entries.map(([k]) => METHOD_LABELS[k] || k),
      legend: { position: 'bottom', labels: { colors: theme.palette.text.secondary }, fontSize: '12px' },
      dataLabels: { enabled: true, formatter: (v: number) => `${v.toFixed(0)}%` },
      stroke: { colors: [theme.palette.background.paper] },
      tooltip: { theme: 'dark', y: { formatter: (v: number) => currencyBR(v) } },
    };
    const series = entries.map(([, v]) => v);
    return { options, series, isEmpty: entries.length === 0 };
  }, [summary, chartPalette, theme]);

  const revenueByCategoryChart = useMemo(() => {
    if (!summary) return null;
    const entries = Object.entries(summary.revenue.byCategory).filter(([, v]) => v > 0);
    const options: ApexOptions = {
      chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
      plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '55%', distributed: true } },
      colors: chartPalette,
      dataLabels: { enabled: false },
      legend: { show: false },
      xaxis: {
        categories: entries.map(([k]) => CATEGORY_LABELS[k] || k),
        labels: { style: { colors: theme.palette.text.secondary }, formatter: (v: string) => currencyBR(Number(v)) },
      },
      yaxis: { labels: { style: { colors: theme.palette.text.secondary } } },
      grid: { borderColor: theme.palette.divider },
      tooltip: { theme: 'dark', y: { formatter: (v: number) => currencyBR(v) } },
    };
    const series = [{ name: 'Receita', data: entries.map(([, v]) => v) }];
    return { options, series, isEmpty: entries.length === 0 };
  }, [summary, chartPalette, theme]);

  const liveGaugeChart = useMemo(() => {
    if (!summary) return null;
    const { totalCourts, courtsInUseCount } = summary.live;
    const pct = totalCourts > 0 ? Math.round((courtsInUseCount / totalCourts) * 100) : 0;
    const options: ApexOptions = {
      chart: { type: 'radialBar', background: 'transparent', sparkline: { enabled: true } },
      colors: [theme.palette.primary.main],
      plotOptions: {
        radialBar: {
          hollow: { size: '60%' },
          dataLabels: {
            name: { show: false },
            value: {
              fontSize: '20px',
              fontWeight: 700,
              color: theme.palette.text.primary,
              formatter: () => `${courtsInUseCount}/${totalCourts}`,
            },
          },
        },
      },
      stroke: { lineCap: 'round' },
    };
    return { options, series: [pct] };
  }, [summary, theme]);

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
          {/* KPIs principais */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard icon={EventAvailableIcon} label="Agendamentos" value={String(summary.bookings.total)} color="primary" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard icon={CheckCircleIcon} label="Confirmados" value={String(summary.bookings.confirmed)} color="success" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                icon={CancelIcon}
                label="Cancelamentos"
                value={String(summary.bookings.cancelled)}
                helper={`${summary.kpis.cancellationRate}% do total`}
                color="error"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard icon={PaidIcon} label="Faturamento" value={currencyBR(summary.revenue.total)} color="warning" />
            </Grid>
          </Grid>

          {/* KPIs secundários */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard icon={TrendingUpIcon} label="Ticket médio" value={currencyBR(summary.kpis.averageTicket)} color="info" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard icon={PaidIcon} label="Receita média / dia" value={currencyBR(summary.kpis.dailyAverageRevenue)} color="info" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard icon={HourglassEmptyIcon} label="A receber (reservado)" value={currencyBR(summary.kpis.pendingRevenueToReceive)} color="warning" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard icon={PaidIcon} label="Valor total reservado" value={currencyBR(summary.kpis.totalBookedValue)} color="primary" />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            {/* Status ao vivo */}
            <Grid size={{ xs: 12, md: 4 }}>
              <ChartCard title="Ao vivo agora">
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  {liveGaugeChart && (
                    <Box sx={{ width: 110, flexShrink: 0 }}>
                      <ReactApexChart options={liveGaugeChart.options} series={liveGaugeChart.series} type="radialBar" height={110} />
                    </Box>
                  )}
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Quadras em uso
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {summary.live.courtsInUseCount} de {summary.live.totalCourts}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {summary.live.courtsFreeCount} livre(s) agora
                    </Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 1.5 }} />
                {summary.live.currentMatches.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma partida em andamento neste momento.
                  </Typography>
                ) : (
                  <Stack spacing={1.25}>
                    {summary.live.currentMatches.map((m) => (
                      <Stack key={m.bookingId} direction="row" spacing={1} alignItems="center">
                        <FiberManualRecordIcon sx={{ fontSize: 10, color: 'success.main' }} />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {m.client}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {timeLabel(m.startTime)} — {timeLabel(m.endTime)}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </ChartCard>
            </Grid>

            {/* Ocupação por quadra (radial) */}
            <Grid size={{ xs: 12, md: 8 }}>
              <ChartCard title="Ocupação por quadra">
                {summary.courts.length === 0 || !occupancyChart ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma quadra ativa cadastrada.
                  </Typography>
                ) : (
                  <ReactApexChart options={occupancyChart.options} series={occupancyChart.series} type="radialBar" height={280} />
                )}
              </ChartCard>
            </Grid>

            {/* Agendamentos por quadra */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ChartCard title="Agendamentos por quadra">
                {summary.courts.length === 0 || !bookingsPerCourtChart ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma quadra ativa cadastrada.
                  </Typography>
                ) : (
                  <ReactApexChart
                    options={bookingsPerCourtChart.options}
                    series={bookingsPerCourtChart.series}
                    type="bar"
                    height={Math.max(220, summary.courts.length * 50)}
                  />
                )}
              </ChartCard>
            </Grid>

            {/* Receita por método */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ChartCard title="Receita por método de pagamento">
                {!revenueByMethodChart || revenueByMethodChart.isEmpty ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum pagamento recebido no período.
                  </Typography>
                ) : (
                  <ReactApexChart options={revenueByMethodChart.options} series={revenueByMethodChart.series} type="donut" height={280} />
                )}
              </ChartCard>
            </Grid>

            {/* Receita por categoria */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ChartCard title="Receita por categoria">
                {!revenueByCategoryChart || revenueByCategoryChart.isEmpty ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum pagamento recebido no período.
                  </Typography>
                ) : (
                  <ReactApexChart
                    options={revenueByCategoryChart.options}
                    series={revenueByCategoryChart.series}
                    type="bar"
                    height={Math.max(220, Object.keys(summary.revenue.byCategory).length * 50)}
                  />
                )}
              </ChartCard>
            </Grid>

            {/* Próximos horários de hoje */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ChartCard title="Próximos horários">
                {summary.upcomingToday.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum horário futuro agendado.
                  </Typography>
                ) : (
                  <Stack spacing={1.5} divider={<Divider flexItem />}>
                    {summary.upcomingToday.map((b) => (
                      <Stack key={b.id} direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                          <SportsTennisIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {b.clientName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {b.courtName} · {timeLabel(b.startTime)} — {timeLabel(b.endTime)}
                          </Typography>
                        </Box>
                        <Stack alignItems="flex-end" spacing={0.5}>
                          <Typography variant="body2" fontWeight={600}>
                            {currencyBR(b.totalAmount)}
                          </Typography>
                          <Chip label={STATUS_LABELS[b.status]} size="small" color={STATUS_COLORS[b.status]} variant="outlined" />
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </ChartCard>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
