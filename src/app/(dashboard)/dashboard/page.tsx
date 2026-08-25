'use client';

import React from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, Stack } from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import StorefrontIcon from '@mui/icons-material/Storefront';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PaidIcon from '@mui/icons-material/Paid';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';

export default function DashboardHomePage() {
  const { user, activeArena, activeArenaId } = useAuth();
  const router = useRouter();

  const isArenaManager = user?.role === 'ARENA_ADMIN' || user?.role === 'RECEPTIONIST' || user?.role === 'SUPERADMIN';

  const shortcuts = isArenaManager
    ? [
        { title: 'Dashboard da Arena', description: 'Agendamentos, faturamento e ocupação por quadra', icon: QueryStatsIcon, href: `/arenas/${activeArenaId}/dashboard` },
        { title: 'Quadras', description: 'Cadastre e edite as quadras da arena', icon: SportsTennisIcon, href: `/arenas/${activeArenaId}/courts` },
        { title: 'Horário de Funcionamento', description: 'Configure horários e feriados', icon: ScheduleIcon, href: `/arenas/${activeArenaId}/schedule` },
        { title: 'Agenda', description: 'Veja e crie reservas da arena', icon: EventAvailableIcon, href: `/arenas/${activeArenaId}/bookings` },
        { title: 'Recebimentos', description: 'Lance e acompanhe os recebimentos da arena', icon: PaidIcon, href: `/arenas/${activeArenaId}/payments` },
      ]
    : [
        { title: 'Explorar Arenas', description: 'Encontre quadras pra jogar perto de você', icon: StorefrontIcon, href: '/arenas' },
        { title: 'Minhas Reservas', description: 'Veja seus agendamentos', icon: EventAvailableIcon, href: '/my-bookings' },
      ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Olá, {user?.name?.split(' ')[0]}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {isArenaManager && activeArena
          ? `Gerenciando ${activeArena.name}`
          : 'O que você quer fazer hoje?'}
      </Typography>

      {isArenaManager && !activeArenaId && (
        <Typography color="warning.main" sx={{ mb: 3 }}>
          Você ainda não administra ou trabalha em nenhuma arena.
        </Typography>
      )}

      <Grid container spacing={2}>
        {shortcuts.map((item) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined">
              <CardActionArea onClick={() => router.push(item.href)} disabled={item.href.includes('undefined')}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <item.icon color="primary" fontSize="large" />
                    <Box>
                      <Typography fontWeight={600}>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
