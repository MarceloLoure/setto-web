'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Alert, Avatar, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { authApi } from '@/features/auth/api';
import { useAuth } from '@/features/auth/AuthContext';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setPhone(user.phone ?? '');
    setCity(user.city ?? '');
    setState(user.state ?? '');
    setBio(user.bio ?? '');
  }, [user]);

  if (!user) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>;

  const handleSave = async () => {
    setFeedback(null);
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('city', city);
      formData.append('state', state);
      formData.append('bio', bio);
      if (avatarFile) formData.append('avatar', avatarFile);
      await authApi.updateProfile(formData);
      await refreshUser();
      setAvatarFile(null);
      setFeedback({ type: 'success', message: 'Perfil atualizado com sucesso.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Falha ao atualizar perfil.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Meu perfil</Typography>
      {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={avatarFile ? URL.createObjectURL(avatarFile) : user.avatar?.path} sx={{ width: 88, height: 88, fontSize: '2rem' }}>{user.name[0]?.toUpperCase()}</Avatar>
            <Box><Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={() => inputRef.current?.click()}>Alterar foto</Button><Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>PNG, JPG ou WebP</Typography></Box>
            <input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)} />
          </Stack>
          <TextField label="Nome" value={name} onChange={(event) => setName(event.target.value)} required fullWidth />
          <TextField label="E-mail" value={user.email} fullWidth disabled helperText="O e-mail não pode ser alterado nesta tela." />
          <TextField label="Telefone" value={phone} onChange={(event) => setPhone(event.target.value)} fullWidth />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><TextField label="Cidade" value={city} onChange={(event) => setCity(event.target.value)} fullWidth /><TextField label="Estado (UF)" value={state} onChange={(event) => setState(event.target.value)} inputProps={{ maxLength: 2 }} fullWidth /></Stack>
          <TextField label="Bio" value={bio} onChange={(event) => setBio(event.target.value)} multiline minRows={3} fullWidth />
          <Button variant="contained" size="large" onClick={handleSave} disabled={isSaving || !name}>{isSaving ? 'Salvando...' : 'Salvar alterações'}</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
