'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Switch,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import type { DatesSetArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import { arenasApi } from '@/features/arenas/api';
import type { OperatingHourSchedule, Holiday } from '@/features/arenas/types';

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DAY_LABELS_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function buildDefaultSchedules(existing: OperatingHourSchedule[]): OperatingHourSchedule[] {
  return DAY_LABELS.map((_, dayOfWeek) => {
    const found = existing.find((s) => s.dayOfWeek === dayOfWeek);
    return found ?? { dayOfWeek, openTime: '06:00', closeTime: '23:00', isOpen: true };
  });
}

export default function ArenaSchedulePage() {
  const { arenaId } = useParams<{ arenaId: string }>();
  const [schedules, setSchedules] = useState<OperatingHourSchedule[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingHours, setIsSavingHours] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [monthLabel, setMonthLabel] = useState('');

  const [dialog, setDialog] = useState<{ mode: 'create' | 'view'; date: string; holiday?: Holiday } | null>(null);
  const [description, setDescription] = useState('');
  const calendarRef = useRef<FullCalendar>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const [hoursRes, holidaysRes] = await Promise.all([
        arenasApi.getOperatingHours(arenaId),
        arenasApi.getHolidays(arenaId),
      ]);
      setSchedules(buildDefaultSchedules(hoursRes.schedules));
      setHolidays(holidaysRes.holidays);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arenaId]);

  const calendarEvents = useMemo(
    () =>
      holidays.map((holiday) => ({
        id: holiday.id,
        title: holiday.description || 'Fechado',
        start: holiday.date.slice(0, 10),
        allDay: true,
        extendedProps: { holiday },
      })),
    [holidays],
  );

  const updateDay = (dayOfWeek: number, patch: Partial<OperatingHourSchedule>) => {
    setSchedules((prev) => prev.map((s) => (s.dayOfWeek === dayOfWeek ? { ...s, ...patch } : s)));
  };

  const handleSaveSchedules = async () => {
    setFeedback(null);
    setIsSavingHours(true);
    try {
      const payload = schedules.map((s) => ({
        ...s,
        openTime: s.isOpen ? s.openTime : '00:00',
        closeTime: s.isOpen ? s.closeTime : '00:00',
      }));
      const result = await arenasApi.updateOperatingHours(arenaId, payload);
      setSchedules(buildDefaultSchedules(result.schedules));
      setFeedback({ type: 'success', message: 'Horário de funcionamento atualizado.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Falha ao salvar.' });
    } finally {
      setIsSavingHours(false);
    }
  };

  const handleDateClick = (dateStr: string) => {
    const existing = holidays.find((h) => h.date.slice(0, 10) === dateStr);
    if (existing) {
      setDialog({ mode: 'view', date: dateStr, holiday: existing });
    } else {
      setDescription('');
      setDialog({ mode: 'create', date: dateStr });
    }
  };

  const handleEventClick = (arg: EventClickArg) => {
    const holiday = arg.event.extendedProps.holiday as Holiday;
    setDialog({ mode: 'view', date: holiday.date.slice(0, 10), holiday });
  };

  const handleCreateHoliday = async () => {
    if (!dialog) return;
    setFeedback(null);
    try {
      const created = await arenasApi.createHoliday(arenaId, dialog.date, description || undefined);
      setHolidays((prev) => [...prev, created]);
      setDialog(null);
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Falha ao adicionar fechamento.' });
    }
  };

  const handleRemoveHoliday = async () => {
    if (!dialog?.holiday) return;
    await arenasApi.removeHoliday(arenaId, dialog.holiday.id);
    setHolidays((prev) => prev.filter((h) => h.id !== dialog.holiday!.id));
    setDialog(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Horário de Funcionamento
      </Typography>

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 2 }} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      {/* Grade semanal — tira de dias coloridos, aberto (verde) / fechado (vermelho) */}
      <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2.5 }, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Grade semanal
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(7, 1fr)' },
            gap: 1.5,
          }}
        >
          {schedules.map((schedule) => (
            <Paper
              key={schedule.dayOfWeek}
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: 3,
                borderColor: schedule.isOpen ? 'success.main' : 'divider',
                bgcolor: schedule.isOpen ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 77, 109, 0.06)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" fontWeight={700}>
                  {DAY_LABELS_FULL[schedule.dayOfWeek]}
                </Typography>
                <Switch
                  size="small"
                  checked={schedule.isOpen}
                  onChange={(e) => updateDay(schedule.dayOfWeek, { isOpen: e.target.checked })}
                />
              </Stack>

              {schedule.isOpen ? (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <TextField
                    label="Abre"
                    type="time"
                    size="small"
                    value={schedule.openTime}
                    onChange={(e) => updateDay(schedule.dayOfWeek, { openTime: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Fecha"
                    type="time"
                    size="small"
                    value={schedule.closeTime}
                    onChange={(e) => updateDay(schedule.dayOfWeek, { closeTime: e.target.value })}
                    fullWidth
                  />
                </Stack>
              ) : (
                <Chip label="Fechado" size="small" color="error" variant="outlined" sx={{ mt: 1.5 }} />
              )}
            </Paper>
          ))}
        </Box>
        <Button variant="contained" sx={{ mt: 2.5 }} onClick={handleSaveSchedules} disabled={isSavingHours}>
          {isSavingHours ? 'Salvando...' : 'Salvar grade semanal'}
        </Button>
      </Paper>

      {/* Calendário mensal — fechamentos específicos (feriados, manutenção, eventos) */}
      <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Fechamentos específicos
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton size="small" onClick={() => calendarRef.current?.getApi().prev()}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="body2" fontWeight={600} sx={{ minWidth: 140, textAlign: 'center', textTransform: 'capitalize' }}>
              {monthLabel}
            </Typography>
            <IconButton size="small" onClick={() => calendarRef.current?.getApi().next()}>
              <ChevronRightIcon />
            </IconButton>
            <Button
              size="small"
              variant="outlined"
              onClick={() => calendarRef.current?.getApi().today()}
              sx={{ ml: 1 }}
            >
              Hoje
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleDateClick(new Date().toISOString().slice(0, 10))}
            >
              Novo fechamento
            </Button>
          </Stack>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Clique em um dia pra fechar a arena naquela data, ou em um fechamento já existente pra removê-lo.
        </Typography>

        <Box
          sx={{
            '& .fc': { '--fc-border-color': 'rgba(255,255,255,0.08)' },
            '& .fc-theme-standard td, & .fc-theme-standard th': { borderColor: 'rgba(255,255,255,0.08)' },
            '& .fc-col-header-cell-cushion': {
              color: 'text.secondary',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
            },
            '& .fc-daygrid-day-number': { color: 'text.primary', fontSize: '0.85rem', p: '6px' },
            '& .fc-day-today': { bgcolor: 'rgba(0, 216, 167, 0.08) !important' },
            '& .fc-daygrid-day': { cursor: 'pointer', transition: 'background-color .15s' },
            '& .fc-daygrid-day:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
            '& .fc-day-other .fc-daygrid-day-number': { color: 'text.disabled' },
            '& .fc-event': { border: 'none', borderRadius: '6px', cursor: 'pointer' },
            '& .fc-scrollgrid': { borderColor: 'rgba(255,255,255,0.08)' },
          }}
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            height="auto"
            locales={[ptBrLocale]}
            locale="pt-br"
            firstDay={0}
            events={calendarEvents}
            dateClick={(arg) => handleDateClick(arg.dateStr)}
            eventClick={handleEventClick}
            datesSet={(arg: DatesSetArg) => {
              const mid = new Date((arg.start.getTime() + arg.end.getTime()) / 2);
              setMonthLabel(mid.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' }));
            }}
            eventContent={(arg: EventContentArg) => (
              <Box
                sx={{
                  bgcolor: 'error.main',
                  color: 'error.contrastText',
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {arg.event.title}
              </Box>
            )}
          />
        </Box>
      </Paper>

      <Dialog open={!!dialog} onClose={() => setDialog(null)} fullWidth maxWidth="xs">
        <DialogTitle>
          {dialog?.mode === 'create' ? 'Fechar a arena nesta data' : 'Fechamento cadastrado'}
        </DialogTitle>
        <DialogContent>
          {dialog && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {new Date(`${dialog.date}T00:00:00`).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Typography>
              {dialog.mode === 'create' ? (
                <TextField
                  label="Motivo (opcional)"
                  placeholder="Ex: Feriado, manutenção, evento privado..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  autoFocus
                />
              ) : (
                <Chip
                  label={dialog.holiday?.description || 'Fechado'}
                  color="error"
                  sx={{ alignSelf: 'flex-start' }}
                />
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)}>Cancelar</Button>
          {dialog?.mode === 'create' ? (
            <Button variant="contained" onClick={handleCreateHoliday}>
              Fechar arena nesta data
            </Button>
          ) : (
            <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleRemoveHoliday}>
              Remover fechamento
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
