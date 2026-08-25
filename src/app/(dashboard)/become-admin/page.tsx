'use client';

import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, Alert, Stack } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useRouter } from 'next/navigation';
import { arenasApi } from '@/features/arenas/api';
import { useAuth } from '@/features/auth/AuthContext';
import type { CreateArenaPayload } from '@/features/arenas/types';

const emptyForm: CreateArenaPayload = {
  name: '',
  cnpj: '',
  address: '',
  number: '',
  complement: '',
  neighborhood: '',
  zipCode: '',
  city: '',
  state: '',
};

export default function BecomeAdminPage() {
  const [form, setForm] = useState<CreateArenaPayload>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshUser, setActiveArenaId } = useAuth();
  const router = useRouter();

  const handleChange = (field: keyof CreateArenaPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const arena = await arenasApi.becomeAdmin(form);
      // O papel do usuário mudou no backend (ATHLETE -> ARENA_ADMIN) — sincroniza
      // o contexto local antes de navegar, senão o menu/sidebar continuam
      // mostrando as opções antigas até o próximo refresh manual da página.
      await refreshUser();
      setActiveArenaId(arena.id);
      router.push(`/arenas/${arena.id}/courts?onboarding=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao cadastrar arena.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <StorefrontIcon color="primary" fontSize="large" />
        <Typography variant="h5" fontWeight={700}>
          Cadastrar minha arena
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Ao cadastrar, sua conta passa a administrar esta arena — você poderá criar quadras,
        definir horário de funcionamento e receber reservas.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField label="Nome da arena" value={form.name} onChange={handleChange('name')} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="CNPJ (opcional)" value={form.cnpj} onChange={handleChange('cnpj')} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="CEP" value={form.zipCode} onChange={handleChange('zipCode')} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField label="Endereço" value={form.address} onChange={handleChange('address')} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Número" value={form.number} onChange={handleChange('number')} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Complemento" value={form.complement} onChange={handleChange('complement')} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Bairro" value={form.neighborhood} onChange={handleChange('neighborhood')} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField label="Cidade" value={form.city} onChange={handleChange('city')} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Estado (UF)" value={form.state} onChange={handleChange('state')} required fullWidth slotProps={{ htmlInput: { maxLength: 2 } }} />
            </Grid>
          </Grid>

          <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={isSubmitting} fullWidth>
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar arena e continuar'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
