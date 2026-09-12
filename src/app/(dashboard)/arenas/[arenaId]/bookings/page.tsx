'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateClickArg } from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import type { DatesSetArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import { useParams } from 'next/navigation';
import { bookingsApi } from '@/features/bookings/api';
import type { Booking, BookingType } from '@/features/bookings/types';
import { courtsApi } from '@/features/courts/api';
import type { Court } from '@/features/courts/types';
import { paymentsApi } from '@/features/payments/api';
import type { PaymentMethod } from '@/features/payments/types';

const BOOKING_TYPES: { value: BookingType; label: string }[] = [
  { value: 'FREE_PLAY', label: 'Jogo livre / balcão' },
  { value: 'SINGLE_LESSON', label: 'Aula individual' },
  { value: 'GROUP_LESSON', label: 'Aula em grupo' },
  { value: 'TOURNAMENT', label: 'Campeonato' },
];

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'PIX', label: 'Pix' },
  { value: 'CREDIT_CARD', label: 'Cartão de crédito' },
  { value: 'DEBIT_CARD', label: 'Cartão de débito' },
  { value: 'CASH', label: 'Dinheiro' },
];

type SelectedSlot = { court: Court; startTime: string; endTime: string; timeLabel: string };

function currencyBR(value: string | number) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function clientName(booking: Booking) {
  return booking.clientDisplayName || booking.customerName || booking.user?.name || 'Cliente não informado';
}

function datesLabel(start: Date, end: Date) {
  const lastDay = new Date(end.getTime() - 1);
  return `${start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' })} – ${lastDay.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}`;
}

export default function ArenaBookingsPage() {
  const { arenaId } = useParams<{ arenaId: string }>();
  const calendarRef = useRef<FullCalendar>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [range, setRange] = useState<{ start: Date; end: Date } | null>(null);
  const [weekLabel, setWeekLabel] = useState('');
  const [selectedCourtId, setSelectedCourtId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedSlot | null>(null);
  const [bookingType, setBookingType] = useState<BookingType>('FREE_PLAY');
  const [customerName, setCustomerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  const displayCourts = useMemo(() => {
    if (courts.length) return courts;
    const uniqueCourts = new Map<string, Court>();
    bookings.forEach((booking) => {
      uniqueCourts.set(booking.courtId, {
        id: booking.court.id,
        name: booking.court.name,
        sport: booking.court.sport as Court['sport'],
        hourlyRate: booking.court.hourlyRate ?? booking.totalAmount,
        isCovered: booking.court.isCovered ?? false,
        isActive: true,
        arenaId: booking.arenaId,
      });
    });
    return [...uniqueCourts.values()];
  }, [bookings, courts]);

  const activeCourtId = displayCourts.some((court) => court.id === selectedCourtId)
    ? selectedCourtId
    : (displayCourts[0]?.id ?? '');
  const activeCourt = displayCourts.find((court) => court.id === activeCourtId);

  const load = async (visibleRange = range) => {
    if (!visibleRange) return;
    setIsLoading(true);
    setError(null);
    try {
      const [managedBookings, arenaCourts] = await Promise.all([
        bookingsApi.listManaged({
          arenaId,
          startDate: visibleRange.start.toISOString(),
          endDate: new Date(visibleRange.end.getTime() - 1).toISOString(),
        }),
        courtsApi.listByArena(arenaId).catch(() => []),
      ]);
      setBookings(managedBookings);
      setCourts(arenaCourts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar agenda.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // O carregamento atualiza o estado após a resposta da API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arenaId, range]);

  const calendarEvents = useMemo(() => {
    const courtBookings = bookings.filter((booking) => booking.courtId === activeCourtId && booking.status !== 'CANCELLED');
    const bookedEvents = courtBookings.map((booking) => {
      const isPaid = booking.isPaid || booking.payment?.status === 'CONFIRMED' || booking.payment?.status === 'RECEIVED';

      return {
        id: booking.id,
        start: booking.startTime,
        end: booking.endTime,
        title: clientName(booking),
        // Verde para pago, Tom avermelhado/alaranjado para pendente
        backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.25)' : 'rgba(230, 75, 93, 0.25)',
        borderColor: isPaid ? '#10B981' : '#E64B5D',
        extendedProps: { booking, isPaid },
      };
    });

    if (!range || !activeCourt) return bookedEvents;

    const freeEvents = [];
    for (let day = new Date(range.start); day < range.end; day.setUTCDate(day.getUTCDate() + 1)) {
      for (let hour = 6; hour < 23; hour += 1) {
        const start = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour));
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        const isBooked = courtBookings.some((booking) => start < new Date(booking.endTime) && end > new Date(booking.startTime));
        if (!isBooked) {
          freeEvents.push({
            id: `free-${activeCourtId}-${start.toISOString()}`,
            start: start.toISOString(),
            end: end.toISOString(),
            title: 'Livre',
            backgroundColor: 'rgba(16, 185, 129, 0.13)',
            borderColor: 'rgba(52, 211, 153, 0.42)',
            extendedProps: { isFree: true, startTime: start.toISOString(), endTime: end.toISOString() },
          });
        }
      }
    }
    return [...freeEvents, ...bookedEvents];
  }, [bookings, activeCourtId, activeCourt, range]);

  const handleDateClick = (arg: DateClickArg) => {
    if (!activeCourt) return;
    const end = new Date(arg.date.getTime() + 60 * 60 * 1000);
    setSelected({
      court: activeCourt,
      startTime: arg.date.toISOString(),
      endTime: end.toISOString(),
      timeLabel: arg.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
    });
  };

  const handleCreateBooking = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      await bookingsApi.createManaged({ type: bookingType, courtId: selected.court.id, startTime: selected.startTime, endTime: selected.endTime, customerName: customerName || undefined });
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

  const handleRegisterPayment = async () => {
    if (!paymentBooking) return;
    setIsSavingPayment(true);
    try {
      await paymentsApi.create({
        description: `Agendamento — ${clientName(paymentBooking)}`,
        amount: Number(paymentBooking.totalAmount),
        method: paymentMethod,
        category: 'BOOKING',
        arenaId,
        bookingId: paymentBooking.id,
        userId: paymentBooking.userId ?? undefined,
      });
      setPaymentBooking(null);
      await load(); // 👈 Recarrega os agendamentos para refletir o status de Pago
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao registrar pagamento.');
    } finally {
      setIsSavingPayment(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5" fontWeight={700}>Agenda da Arena</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField select size="small" label="Quadra" value={activeCourtId} onChange={(event) => setSelectedCourtId(event.target.value)} sx={{ minWidth: 160 }} disabled={!displayCourts.length}>
            {displayCourts.map((court) => <MenuItem key={court.id} value={court.id}>{court.name}</MenuItem>)}
          </TextField>
          <Button size="small" variant="outlined" onClick={() => calendarRef.current?.getApi().today()}>Hoje</Button>
          <Button size="small" onClick={() => calendarRef.current?.getApi().prev()} aria-label="Semana anterior"><ChevronLeftIcon /></Button>
          <Typography variant="body2" fontWeight={600} sx={{ minWidth: 180, textAlign: 'center', textTransform: 'capitalize' }}>{weekLabel}</Typography>
          <Button size="small" onClick={() => calendarRef.current?.getApi().next()} aria-label="Próxima semana"><ChevronRightIcon /></Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      <Paper variant="outlined" sx={{ p: { xs: 1, sm: 2 }, opacity: isLoading ? 0.6 : 1 }}>
        {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}><CircularProgress size={20} /></Box>}
        <Box
          sx={{
            // Permite que o container tenha rolagem vertical suave
            height: 'calc(70vh - 220px)',
            overflowY: 'auto',

            // 1. Aumenta a altura de cada slot de hora
            '& .fc-timegrid-slot': {
              height: '65px !important', // 👈 Aumente para 70px ou 80px se quiser ainda maior
              cursor: 'pointer',
            },
            '& .fc-timegrid-slot-lane': {
              height: '65px !important',
            },

            // 2. Alinhamento e estilo do rótulo da hora (06, 07, 08...)
            '& .fc-timegrid-slot-label': {
              verticalAlign: 'top',
            },
            '& .fc-timegrid-slot-label-cushion': {
              color: '#8BA6AB',
              fontSize: '0.8rem',
              fontWeight: 700,
              paddingTop: '6px',
            },

            // 3. Estilização dos Cards/Eventos de agendamento dentro da linha
            // Não usar `inset` aqui: o FullCalendar controla top/bottom para
            // posicionar cada evento exatamente no horário correspondente.
            '& .fc-timegrid-event-harness': {
              marginLeft: '4px',
              marginRight: '4px',
            },
            '& .fc-timegrid-event': {
              borderRadius: '10px',
              border: '1px solid rgba(0, 216, 167, 0.3) !important',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
            },

            // 4. Cabeçalho dos dias da semana fixo e escuro
            '& .fc-col-header-cell': {
              backgroundColor: '#112327',
              padding: '8px 0',
            },
            '& .fc-col-header-cell-cushion': {
              color: '#FFFFFF !important',
              textDecoration: 'none !important',
              fontSize: '0.82rem',
              fontWeight: 700,
            },

            // 5. Bordas e grid geral
            '& .fc-theme-standard td, & .fc-theme-standard th': {
              borderColor: 'rgba(31, 62, 69, 0.6) !important',
            },
            '& .fc-scrollgrid': {
              borderColor: 'rgba(31, 62, 69, 0.8) !important',
              borderRadius: '12px',
              overflow: 'hidden',
            },
            '& .fc-day-today': {
              backgroundColor: 'rgba(0, 216, 167, 0.04) !important',
            },
          }}
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={false}
            height="100%"
            locales={[ptBrLocale]}
            locale="pt-br"
            timeZone="UTC"
            firstDay={0}
            allDaySlot={false}
            displayEventTime={false}
            slotDuration="01:00:00"
            slotLabelInterval="01:00"
            slotMinTime="06:00:00"
            slotMaxTime="23:00:00"
            nowIndicator
            events={calendarEvents}
            dateClick={handleDateClick}
            eventClick={(arg: EventClickArg) => {
              if (arg.event.extendedProps.isFree && activeCourt) {
                const startTime = arg.event.extendedProps.startTime as string;
                setSelected({
                  court: activeCourt,
                  startTime,
                  endTime: arg.event.extendedProps.endTime as string,
                  timeLabel: new Date(startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
                });
                return;
              }
              setPaymentBooking(arg.event.extendedProps.booking as Booking);
            }}
            eventContent={(arg: EventContentArg) => {
              if (arg.event.extendedProps.isFree) {
                return null;
              }
              
              const booking = arg.event.extendedProps.booking as Booking;
              const isPaid = arg.event.extendedProps.isPaid;
              const name = clientName(booking);
              const phone = booking.clientPhone || booking.user?.phone;

              return (
                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  sx={{
                    height: '100%',
                    p: 0.75,
                    overflow: 'hidden',
                    borderLeft: '4px solid',
                    borderLeftColor: isPaid ? '#10B981' : '#FF4D6D',
                  }}
                >
                  <Avatar
                    src={booking.user?.avatar?.path}
                    sx={{ width: 28, height: 28, fontSize: '0.72rem', bgcolor: 'rgba(255,255,255,0.22)' }}
                  >
                    {name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0.5}>
                      <Typography component="div" sx={{ fontSize: '0.73rem', lineHeight: 1.2, fontWeight: 800 }} noWrap>
                        {name}
                      </Typography>
                      <Box
                        sx={{
                          px: 0.6,
                          py: 0.1,
                          borderRadius: '4px',
                          fontSize: '0.58rem',
                          fontWeight: 800,
                          bgcolor: isPaid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 77, 109, 0.2)',
                          color: isPaid ? '#10B981' : '#FF4D6D',
                          textTransform: 'uppercase',
                          flexShrink: 0,
                        }}
                      >
                        {isPaid ? 'Pago' : 'Pendente'}
                      </Box>
                    </Stack>
                    <Typography component="div" sx={{ fontSize: '0.64rem', lineHeight: 1.25, opacity: 0.85 }} noWrap>
                      {phone || 'Sem telefone'}
                    </Typography>
                    <Typography component="div" sx={{ fontSize: '0.67rem', lineHeight: 1.2, fontWeight: 700 }} noWrap>
                      {currencyBR(booking.totalAmount)}
                    </Typography>
                  </Box>
                </Stack>
              );
            }}
            datesSet={(arg: DatesSetArg) => {
              setRange((currentRange) => {
                if (currentRange && currentRange.start.getTime() === arg.start.getTime() && currentRange.end.getTime() === arg.end.getTime()) return currentRange;
                return { start: arg.start, end: arg.end };
              });
              setWeekLabel(datesLabel(arg.start, arg.end));
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>Clique em um espaço livre para criar a reserva. Clique em uma reserva para registrar seu pagamento.</Typography>
      </Paper>

      <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="xs">
        <DialogTitle>Nova reserva</DialogTitle>
        <DialogContent><Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">{selected?.court.name} — {selected?.timeLabel} — {selected && currencyBR(selected.court.hourlyRate)}</Typography>
          <TextField select label="Tipo" value={bookingType} onChange={(event) => setBookingType(event.target.value as BookingType)} fullWidth>{BOOKING_TYPES.map((type) => <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)}</TextField>
          <TextField label="Nome do cliente (reserva de balcão)" value={customerName} onChange={(event) => setCustomerName(event.target.value)} fullWidth helperText="Deixe em branco se a reserva for do próprio atleta logado" />
        </Stack></DialogContent>
        <DialogActions><Button onClick={() => setSelected(null)}>Cancelar</Button><Button variant="contained" onClick={handleCreateBooking} disabled={isSaving}>{isSaving ? 'Criando...' : 'Confirmar reserva'}</Button></DialogActions>
      </Dialog>

      <Dialog open={!!paymentBooking} onClose={() => setPaymentBooking(null)} fullWidth maxWidth="xs">
        <DialogTitle>Receber agendamento</DialogTitle>
        <DialogContent><Stack spacing={2} sx={{ mt: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center"><Avatar src={paymentBooking?.user?.avatar?.path}>{paymentBooking && clientName(paymentBooking).charAt(0).toUpperCase()}</Avatar><Box><Typography fontWeight={600}>{paymentBooking && clientName(paymentBooking)}</Typography><Typography variant="body2" color="text.secondary">{paymentBooking?.clientPhone || paymentBooking?.user?.phone || 'Sem telefone'}</Typography></Box></Stack>
          <Typography variant="h6">{paymentBooking && currencyBR(paymentBooking.totalAmount)}</Typography>
          <TextField select label="Forma de pagamento" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)} fullWidth>{PAYMENT_METHODS.map((method) => <MenuItem key={method.value} value={method.value}>{method.label}</MenuItem>)}</TextField>
        </Stack></DialogContent>
        <DialogActions><Button onClick={() => setPaymentBooking(null)}>Cancelar</Button><Button variant="contained" onClick={handleRegisterPayment} disabled={isSavingPayment}>{isSavingPayment ? 'Registrando...' : 'Confirmar pagamento'}</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
