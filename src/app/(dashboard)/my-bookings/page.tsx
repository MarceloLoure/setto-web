'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Chip, Stack, Button, CircularProgress } from '@mui/material';
import { bookingsApi } from '@/features/bookings/api';
import type { Booking } from '@/features/bookings/types';

const STATUS_COLOR: Record<Booking['status'], 'success' | 'error' | 'default' | 'warning' | 'info'> = {
  CONFIRMED: 'success',
  CANCELLED: 'error',
  COMPLETED: 'default',
  PENDING: 'warning',
  RESERVED_LOCAL: 'info',
  NO_SHOW: 'error',
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await bookingsApi.list();
      setBookings(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Cancelar esta reserva?')) return;
    await bookingsApi.cancel(bookingId);
    await load();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Minhas Reservas
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <Typography color="text.secondary">Você ainda não tem nenhuma reserva.</Typography>
      ) : (
        <List>
          {bookings.map((booking) => (
            <ListItem
              key={booking.id}
              divider
              secondaryAction={
                booking.status === 'CONFIRMED' && (
                  <Button size="small" color="error" onClick={() => handleCancel(booking.id)}>
                    Cancelar
                  </Button>
                )
              }
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight={600}>{booking.court.name}</Typography>
                    <Chip label={booking.status} size="small" color={STATUS_COLOR[booking.status]} />
                  </Stack>
                }
                secondary={`${booking.arena.name} — ${new Date(booking.startTime).toLocaleString('pt-BR')}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
