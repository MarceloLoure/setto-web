'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Stack,
  Alert,
} from '@mui/material';
import { courtsApi } from '../api';
import type { Court } from '../types';

const SPORTS = [
  { value: 'BEACH_TENNIS', label: 'Beach Tennis' },
  { value: 'FOOTVOLLEY', label: 'Futevôlei' },
  { value: 'VOLLEYBALL', label: 'Vôlei' },
];

interface CourtFormDialogProps {
  open: boolean;
  arenaId: string;
  onClose: () => void;
  onSaved: (court: Court) => void;
}

export default function CourtFormDialog({ open, arenaId, onClose, onSaved }: CourtFormDialogProps) {
  const [name, setName] = useState('');
  const [sport, setSport] = useState('BEACH_TENNIS');
  const [hourlyRate, setHourlyRate] = useState('');
  const [isCovered, setIsCovered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('arenaId', arenaId);
      formData.append('name', name);
      formData.append('sport', sport);
      formData.append('hourlyRate', hourlyRate);
      formData.append('isCovered', String(isCovered));

      const created = await courtsApi.create(formData);
      onSaved(created);
      setName('');
      setHourlyRate('');
      setIsCovered(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar quadra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Nova Quadra</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
          <TextField select label="Esporte" value={sport} onChange={(e) => setSport(e.target.value)} fullWidth>
            {SPORTS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Valor por hora (R$)"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            fullWidth
            required
          />
          <FormControlLabel
            control={<Switch checked={isCovered} onChange={(e) => setIsCovered(e.target.checked)} />}
            label="Quadra coberta"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting || !name || !hourlyRate}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
