'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Grid,
  Box,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { publicApi } from '../api';
import type { PublicPlan, CheckoutArenaResult } from '../types';

interface CheckoutDialogProps {
  plan: PublicPlan | null;
  onClose: () => void;
}

const BILLING_CYCLE_LABEL: Record<PublicPlan['billingCycle'], string> = {
  MONTHLY: 'mês',
  QUARTERLY: 'trimestre',
  SEMIANNUALLY: 'semestre',
  ANNUALLY: 'ano',
};

function currencyBR(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function CheckoutDialog({ plan, onClose }: CheckoutDialogProps) {
  const [billingType, setBillingType] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
  const [arenaName, setArenaName] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const [holderName, setHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [ccv, setCcv] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CheckoutArenaResult | null>(null);
  const [copied, setCopied] = useState(false);

  if (!plan) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const data = await publicApi.checkoutArena({
        platformPlanId: plan.id,
        arenaName,
        email,
        cpfCnpj,
        phone: phone || undefined,
        city: city || undefined,
        state: state || undefined,
        zipCode: zipCode || undefined,
        billingType,
        ...(billingType === 'CREDIT_CARD'
          ? {
              creditCard: { holderName, number: cardNumber, expiryMonth, expiryYear, ccv },
              creditCardHolderInfo: { name: holderName, postalCode: zipCode || undefined },
            }
          : {}),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível processar a contratação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPixCode = () => {
    if (!result?.pix?.payload) return;
    navigator.clipboard.writeText(result.pix.payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={!!plan} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {result ? 'Falta pouco' : `Assinar o plano ${plan.name}`}
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {result ? (
          <Stack spacing={2} alignItems="center" sx={{ py: 1 }}>
            {result.billingType === 'PIX' && result.pix ? (
              <>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Escaneie o QR Code no app do seu banco ou copie o código Pix abaixo. Assim que o pagamento
                  for confirmado, você recebe por e-mail o acesso ao painel da sua arena.
                </Typography>
                <Box
                  component="img"
                  src={`data:image/png;base64,${result.pix.encodedImage}`}
                  alt="QR Code Pix"
                  sx={{ width: 220, height: 220, borderRadius: 2, bgcolor: '#fff', p: 1 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={copyPixCode}
                  fullWidth
                >
                  {copied ? 'Código copiado!' : 'Copiar código Pix'}
                </Button>
              </>
            ) : (
              <Stack spacing={2} alignItems="center" textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  {result.status === 'CONFIRMED' || result.status === 'RECEIVED'
                    ? 'Pagamento confirmado! Você vai receber por e-mail o acesso ao painel da sua arena.'
                    : 'Cobrança gerada. Assim que o pagamento for confirmado, você recebe por e-mail o acesso ao painel da sua arena.'}
                </Typography>
                {result.invoiceUrl && (
                  <Button variant="outlined" href={result.invoiceUrl} target="_blank" rel="noopener">
                    Ver fatura
                  </Button>
                )}
              </Stack>
            )}
          </Stack>
        ) : (
          <Box component="form" id="checkout-form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {plan.description} — {currencyBR(plan.price)}/{BILLING_CYCLE_LABEL[plan.billingCycle]}
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}

              <TextField label="Nome da arena" value={arenaName} onChange={(e) => setArenaName(e.target.value)} required fullWidth />
              <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
              <TextField
                label="CPF ou CNPJ"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                required
                fullWidth
                helperText="Apenas números"
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
                </Grid>
                <Grid size={{ xs: 8, sm: 4 }}>
                  <TextField label="Cidade" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <TextField label="UF" value={state} onChange={(e) => setState(e.target.value.toUpperCase())} fullWidth inputProps={{ maxLength: 2 }} />
                </Grid>
              </Grid>
              <TextField label="CEP" value={zipCode} onChange={(e) => setZipCode(e.target.value)} fullWidth helperText="Apenas números" />

              <Divider />

              <ToggleButtonGroup
                value={billingType}
                exclusive
                onChange={(_, value) => value && setBillingType(value)}
                fullWidth
                color="primary"
              >
                <ToggleButton value="PIX">Pix</ToggleButton>
                <ToggleButton value="CREDIT_CARD">Cartão de crédito</ToggleButton>
              </ToggleButtonGroup>

              {billingType === 'CREDIT_CARD' && (
                <Stack spacing={2}>
                  <TextField label="Nome no cartão" value={holderName} onChange={(e) => setHolderName(e.target.value)} required fullWidth />
                  <TextField label="Número do cartão" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required fullWidth />
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <TextField label="Mês" placeholder="MM" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)} required fullWidth />
                    </Grid>
                    <Grid size={4}>
                      <TextField label="Ano" placeholder="AAAA" value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)} required fullWidth />
                    </Grid>
                    <Grid size={4}>
                      <TextField label="CVV" value={ccv} onChange={(e) => setCcv(e.target.value)} required fullWidth />
                    </Grid>
                  </Grid>
                </Stack>
              )}
            </Stack>
          </Box>
        )}
      </DialogContent>

      {!result && (
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="checkout-form" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Processando...' : 'Confirmar assinatura'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
