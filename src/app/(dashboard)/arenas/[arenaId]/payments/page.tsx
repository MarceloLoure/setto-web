'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'next/navigation';
import { paymentsApi } from '@/features/payments/api';
import type { Payment, PaymentMethod, PaymentCategory } from '@/features/payments/types';

const METHOD_LABELS: Record<PaymentMethod, string> = {
  PIX: 'Pix',
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  CASH: 'Dinheiro',
};

const CATEGORY_LABELS: Record<PaymentCategory, string> = {
  BOOKING: 'Agendamento',
  BAR_SNACKBAR: 'Lanchonete / Bar',
  EQUIPMENT_RENTAL: 'Aluguel de Equipamento',
  SPONSORSHIP: 'Patrocínio',
  OTHER: 'Outros',
};

function currencyBR(value: string | number) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const emptyForm = { description: '', amount: '', method: 'PIX' as PaymentMethod, category: 'OTHER' as PaymentCategory };

export default function ArenaPaymentsPage() {
  const { arenaId } = useParams<{ arenaId: string }>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await paymentsApi.listByArena(arenaId);
      setPayments(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arenaId]);

  const totalPeriodo = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  const handleCreate = async () => {
    setError(null);
    setIsSaving(true);
    try {
      await paymentsApi.create({
        description: form.description,
        amount: Number(form.amount),
        method: form.method,
        category: form.category,
        arenaId,
      });
      setDialogOpen(false);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao registrar recebimento.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Recebimentos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total lançado: {currencyBR(totalPeriodo)}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Novo recebimento
        </Button>
      </Stack>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : payments.length === 0 ? (
        <Typography color="text.secondary">Nenhum recebimento lançado ainda.</Typography>
      ) : (
        <Paper variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Descrição</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Forma</TableCell>
                <TableCell>Data</TableCell>
                <TableCell align="right">Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>
                    <Chip label={CATEGORY_LABELS[payment.category]} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{METHOD_LABELS[payment.method]}</TableCell>
                  <TableCell>{new Date(payment.paidAt).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell align="right">{currencyBR(payment.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Novo recebimento</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Descrição"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              fullWidth
              autoFocus
            />
            <TextField
              label="Valor (R$)"
              type="number"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              fullWidth
            />
            <TextField
              select
              label="Forma de pagamento"
              value={form.method}
              onChange={(e) => setForm((f) => ({ ...f, method: e.target.value as PaymentMethod }))}
              fullWidth
            >
              {Object.entries(METHOD_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Categoria"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as PaymentCategory }))}
              fullWidth
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate} disabled={isSaving || !form.description || !form.amount}>
            {isSaving ? 'Salvando...' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
