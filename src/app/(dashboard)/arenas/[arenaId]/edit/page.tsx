'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Alert,
  Stack,
  CardMedia,
  IconButton,
  CircularProgress,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from 'next/navigation';
import { arenasApi } from '@/features/arenas/api';
import type { ArenaDetail, UpdateArenaPayload } from '@/features/arenas/types';

// Como o campo `photos` (galeria) é um array de arquivos no formato do
// OpenAPI/Swagger, o Swagger UI não consegue renderizar um seletor de
// múltiplos arquivos de verdade — mas aqui, num input HTML normal, funciona
// sem problema (é a mesma API, só um cliente melhor pra ela).

export default function EditArenaPage() {
  const { arenaId } = useParams<{ arenaId: string }>();
  const [arena, setArena] = useState<ArenaDetail | null>(null);
  const [form, setForm] = useState<UpdateArenaPayload>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await arenasApi.getById(arenaId);
      setArena(data);
      setForm({
        name: data.name,
        cnpj: data.cnpj ?? '',
        address: data.address,
        number: data.number,
        complement: data.complement ?? '',
        neighborhood: data.neighborhood,
        zipCode: data.zipCode,
        city: data.city,
        state: data.state,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arenaId]);

  const handleChange = (field: keyof UpdateArenaPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setFeedback(null);
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });
      if (logoFile) formData.append('logo', logoFile);
      if (coverFile) formData.append('cover', coverFile);
      newPhotos.forEach((file) => formData.append('photos', file));

      const updated = await arenasApi.update(arenaId, formData);
      setArena(updated);
      setLogoFile(null);
      setCoverFile(null);
      setNewPhotos([]);
      setFeedback({ type: 'success', message: 'Arena atualizada com sucesso.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Falha ao salvar.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePhoto = async (photoUrl: string) => {
    if (!arena) return;
    await arenasApi.removePhoto(arenaId, photoUrl);
    setArena({ ...arena, photos: arena.photos.filter((p) => p.path !== photoUrl) });
  };

  if (isLoading || !arena) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Dados da Arena
      </Typography>

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 2 }} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Imagens
        </Typography>
        <Grid container spacing={3} sx={{ mb: 1 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary">Logo</Typography>
            <CardMedia
              component="img"
              image={logoFile ? URL.createObjectURL(logoFile) : arena.logo?.path || '/arena-placeholder.png'}
              alt="Logo"
              onClick={() => logoInputRef.current?.click()}
              sx={{ height: 120, borderRadius: 2, mt: 0.5, cursor: 'pointer', objectFit: 'cover', bgcolor: 'background.default' }}
            />
            <input ref={logoInputRef} type="file" accept="image/*" hidden onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} />
            <Button size="small" onClick={() => logoInputRef.current?.click()} sx={{ mt: 0.5 }}>
              Trocar logo
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Typography variant="caption" color="text.secondary">Foto de capa</Typography>
            <CardMedia
              component="img"
              image={coverFile ? URL.createObjectURL(coverFile) : arena.cover?.path || '/arena-placeholder.png'}
              alt="Capa"
              onClick={() => coverInputRef.current?.click()}
              sx={{ height: 120, borderRadius: 2, mt: 0.5, cursor: 'pointer', objectFit: 'cover', bgcolor: 'background.default' }}
            />
            <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
            <Button size="small" onClick={() => coverInputRef.current?.click()} sx={{ mt: 0.5 }}>
              Trocar capa
            </Button>
          </Grid>
        </Grid>

        <Typography variant="caption" color="text.secondary">Galeria (até 3 fotos)</Typography>
        <Stack direction="row" spacing={1.5} sx={{ mt: 1, flexWrap: 'wrap', gap: 1.5 }}>
          {arena.photos.map((photo) => (
            <Box key={photo.id} sx={{ position: 'relative', width: 96, height: 96 }}>
              <CardMedia
                component="img"
                image={photo.path}
                alt={photo.name}
                sx={{ width: 96, height: 96, borderRadius: 2, objectFit: 'cover' }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemovePhoto(photo.path)}
                sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'background.paper' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          {newPhotos.map((file, index) => (
            <CardMedia
              key={index}
              component="img"
              image={URL.createObjectURL(file)}
              sx={{ width: 96, height: 96, borderRadius: 2, objectFit: 'cover', opacity: 0.7 }}
            />
          ))}
          {arena.photos.length + newPhotos.length < 3 && (
            <Box
              onClick={() => photosInputRef.current?.click()}
              sx={{
                width: 96,
                height: 96,
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <AddPhotoAlternateIcon color="disabled" />
            </Box>
          )}
        </Stack>
        <input
          ref={photosInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => setNewPhotos(Array.from(e.target.files ?? []).slice(0, 3 - arena.photos.length))}
        />
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Dados cadastrais
        </Typography>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField label="Nome da arena" value={form.name ?? ''} onChange={handleChange('name')} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="CNPJ" value={form.cnpj ?? ''} onChange={handleChange('cnpj')} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="CEP" value={form.zipCode ?? ''} onChange={handleChange('zipCode')} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField label="Endereço" value={form.address ?? ''} onChange={handleChange('address')} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Número" value={form.number ?? ''} onChange={handleChange('number')} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Complemento" value={form.complement ?? ''} onChange={handleChange('complement')} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Bairro" value={form.neighborhood ?? ''} onChange={handleChange('neighborhood')} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField label="Cidade" value={form.city ?? ''} onChange={handleChange('city')} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Estado (UF)" value={form.state ?? ''} onChange={handleChange('state')} fullWidth slotProps={{ htmlInput: { maxLength: 2 } }} />
          </Grid>
        </Grid>

        <Button variant="contained" size="large" sx={{ mt: 3 }} onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </Paper>
    </Box>
  );
}
