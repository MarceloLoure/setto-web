'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
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
  court?: Court | null;
  onClose: () => void;
  onSaved: (court: Court) => void;
}

export default function CourtFormDialog({ open, arenaId, court, onClose, onSaved }: CourtFormDialogProps) {
  const [name, setName] = useState('');
  const [sport, setSport] = useState('BEACH_TENNIS');
  const [hourlyRate, setHourlyRate] = useState('');
  const [isCovered, setIsCovered] = useState(false);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!court;
  const remainingPhotos = Math.max(0, 3 - (court?.photos?.length ?? 0) - newPhotos.length);

  useEffect(() => {
    if (!open) return;
    setName(court?.name ?? '');
    setSport(court?.sport ?? 'BEACH_TENNIS');
    setHourlyRate(court?.hourlyRate ?? '');
    setIsCovered(court?.isCovered ?? false);
    setNewPhotos([]);
    setError(null);
  }, [court, open]);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (!isEditing) formData.append('arenaId', arenaId);
      formData.append('name', name);
      formData.append('sport', sport);
      formData.append('hourlyRate', hourlyRate);
      formData.append('isCovered', String(isCovered));
      newPhotos.forEach((photo) => formData.append('photos', photo));

      const saved = court ? await courtsApi.update(court.id, formData) : await courtsApi.create(formData);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Falha ao ${isEditing ? 'atualizar' : 'criar'} quadra.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? 'Editar quadra' : 'Nova quadra'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Nome" value={name} onChange={(event) => setName(event.target.value)} fullWidth required />
          <TextField select label="Esporte" value={sport} onChange={(event) => setSport(event.target.value)} fullWidth>
            {SPORTS.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
          </TextField>
          <TextField label="Valor por hora (R$)" type="number" value={hourlyRate} onChange={(event) => setHourlyRate(event.target.value)} fullWidth required />
          <FormControlLabel control={<Switch checked={isCovered} onChange={(event) => setIsCovered(event.target.checked)} />} label="Quadra coberta" />

          <Box>
            <Typography variant="subtitle2" gutterBottom>Fotos da quadra</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {court?.photos?.map((photo) => <CardMedia key={photo.id} component="img" image={photo.path} alt={photo.name} sx={{ width: 88, height: 88, borderRadius: 2, objectFit: 'cover' }} />)}
              {newPhotos.map((photo, index) => (
                <Box key={`${photo.name}-${index}`} sx={{ position: 'relative' }}>
                  <CardMedia component="img" image={URL.createObjectURL(photo)} alt={photo.name} sx={{ width: 88, height: 88, borderRadius: 2, objectFit: 'cover' }} />
                  <IconButton size="small" onClick={() => setNewPhotos((items) => items.filter((_, itemIndex) => itemIndex !== index))} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'background.paper' }}><CloseIcon fontSize="small" /></IconButton>
                </Box>
              ))}
              {remainingPhotos > 0 && <Button variant="outlined" startIcon={<AddPhotoAlternateIcon />} onClick={() => photosInputRef.current?.click()} sx={{ minHeight: 48 }}>Adicionar fotos</Button>}
            </Stack>
            <input
              ref={photosInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []).slice(0, remainingPhotos);
                setNewPhotos((items) => [...items, ...files]);
                event.target.value = '';
              }}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting || !name || !hourlyRate}>{isSubmitting ? 'Salvando...' : 'Salvar alterações'}</Button>
      </DialogActions>
    </Dialog>
  );
}
