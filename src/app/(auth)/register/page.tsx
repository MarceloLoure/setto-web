'use client';

import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert, Stack, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/features/auth/api';
import { useAuth } from '@/features/auth/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshUser } = useAuth();
  const router = useRouter();

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await authApi.register(form);
      await refreshUser();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao realizar cadastro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', px: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }} elevation={0}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Criar conta
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Cadastre-se como atleta — você pode transformar sua conta em administradora de arena depois.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Nome" value={form.name} onChange={handleChange('name')} required fullWidth />
            <TextField label="E-mail" type="email" value={form.email} onChange={handleChange('email')} required fullWidth />
            <TextField label="Telefone" value={form.phone} onChange={handleChange('phone')} fullWidth />
            <TextField
              label="Senha"
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" size="large" disabled={isSubmitting} fullWidth>
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Já tem conta?{' '}
          <MuiLink component={Link} href="/login">
            Entrar
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}
