'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Stack,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { bookingsApi } from '@/features/bookings/api';
import type { ArenaAvailability, AvailabilitySlot, CourtAvailability, BookingType } from '@/features/bookings/types';

const BOOKING_TYPES: { value: BookingType; label: string }[] = [
  { value: 'FREE_PLAY', label: 'Jogo livre / balcão' },
  { value: 'SINGLE_LESSON', label: 'Aula individual' },
  { value: 'GROUP_LESSON', label: 'Aula em grupo' },
  { value: 'TOURNAMENT', label: 'Campeonato' },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function ArenaBookingsPage() {
  const { arenaId } = useParams<{ arenaId: string }>();
  const [date, setDate] = useState(todayISO());
  const [availability, setAvailability] = useState<ArenaAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<{ court: CourtAvailability; slot: AvailabilitySlot } | null>(null);
  const [bookingType, setBookingType] = useState<BookingType>('FREE_PLAY');
  const [customerName, setCustomerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await bookingsApi.getAvailability(arenaId, date);
      setAvailability(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar disponibilidade.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arenaId, date]);

  const handleCreateBooking = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      await bookingsApi.createManaged({
        type: bookingType,
        courtId: selected.court.courtId,
        startTime: selected.slot.startTime,
        endTime: selected.slot.endTime,
        customerName: customerName || undefined,
      });
      setSelected(null);
      setCustomerName('');
      setBookingType('FREE_PLAY');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar reserva.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Agenda da Arena
        </Typography>
        <TextField type="date" size="small" value={date} onChange={(e) => setDate(e.target.value)} />
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : availability?.isClosed ? (
        <Alert severity="info">{availability.reason ?? 'Arena fechada nesta data.'}</Alert>
      ) : (
        <Stack spacing={3}>
          {availability?.courts.map((court) => (
            <Paper key={court.courtId} variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {court.courtName}
                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({court.availableSlotsCount} horários livres)
                </Typography>
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {court.slots.map((slot) => (
                  <Chip
                    key={slot.startTime}
                    label={slot.timeLabel}
                    color={slot.isAvailable ? 'default' : 'default'}
                    variant={slot.isAvailable ? 'outlined' : 'filled'}
                    disabled={!slot.isAvailable}
                    onClick={slot.isAvailable ? () => setSelected({ court, slot }) : undefined}
                    sx={{ cursor: slot.isAvailable ? 'pointer' : 'default' }}
                  />
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="xs">
        <DialogTitle>Nova reserva</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {selected?.court.courtName} — {selected?.slot.timeLabel} — R$ {selected?.slot.price.toFixed(2)}
            </Typography>
            <TextField
              select
              label="Tipo"
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value as BookingType)}
              fullWidth
            >
              {BOOKING_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Nome do cliente (reserva de balcão)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              fullWidth
              helperText="Deixe em branco se a reserva for do próprio atleta logado"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateBooking} disabled={isSaving}>
            {isSaving ? 'Criando...' : 'Confirmar reserva'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
