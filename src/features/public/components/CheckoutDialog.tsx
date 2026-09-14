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
import Link from 'next/link';
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

// Helper para remover tudo que não for dígito
const onlyDigits = (val: string) => val.replace(/\D/g, '');

// Formatadores de máscara visual
const formatCPF = (val: string) => {
  const digits = onlyDigits(val).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatCNPJ = (val: string) => {
  const digits = onlyDigits(val).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

const formatPhone = (val: string) => {
  const digits = onlyDigits(val).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

const formatZipCode = (val: string) => {
  const digits = onlyDigits(val).slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, '$1-$2');
};

const formatCardNumber = (val: string) => {
  const digits = onlyDigits(val).slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

export default function CheckoutDialog({ plan, onClose }: CheckoutDialogProps) {
  const [billingType, setBillingType] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
  const [arenaName, setArenaName] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [arenaEmail, setArenaEmail] = useState('');
  const [cpf, setCpf] = useState('');
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

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await publicApi.checkoutArena({
        platformPlanId: plan.id,
        arenaName,
        name,
        email,
        password,
        cpf: onlyDigits(cpf),
        cpfCnpj: onlyDigits(cpfCnpj),
        phone: onlyDigits(phone) || undefined,
        billingType,
        ...(billingType === 'CREDIT_CARD'
          ? {
              creditCard: {
                holderName,
                number: onlyDigits(cardNumber),
                expiryMonth: onlyDigits(expiryMonth),
                expiryYear: onlyDigits(expiryYear),
                ccv: onlyDigits(ccv),
              },
              creditCardHolderInfo: {
                name: holderName,
                postalCode: onlyDigits(zipCode),
              },
            }
          : {}),
      });

      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
      }

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
        <IconButton onClick={handleClose} size="small" disabled={isSubmitting}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {result ? (
          <Stack spacing={2} alignItems="center" sx={{ py: 1 }}>
            <Alert severity="success" sx={{ width: '100%' }}>
              Sua conta foi criada e você já está logado! Assim que o pagamento for confirmado, sua arena é ativada automaticamente.
            </Alert>
            {result.billingType === 'PIX' && result.pix ? (
              <>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Escaneie o QR Code no app do seu banco ou copie o código Pix abaixo para confirmar o pagamento da assinatura.
                </Typography>
                <Box
                  component="img"
                  src={`data:image/png;base64,${result.pix.encodedImage}`}
                  alt="QR Code Pix"
                  sx={{ width: 220, height: 220, borderRadius: 2, bgcolor: '#fff', p: 1, border: '1px solid #eee' }}
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
                    ? 'Pagamento confirmado! Sua arena já está ativa.'
                    : 'Cobrança gerada. Finalize o pagamento pelo link abaixo para ativar sua arena.'}
                </Typography>
                {result.invoiceUrl && (
                  <Button variant="outlined" href={result.invoiceUrl} target="_blank" rel="noopener">
                    Ver fatura
                  </Button>
                )}
              </Stack>
            )}
            <Button component={Link} href="/dashboard" variant="contained" fullWidth>
              Ir para o painel
            </Button>
          </Stack>
        ) : (
          <Box component="form" id="checkout-form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {plan.description} — <strong>{currencyBR(plan.price)}/{BILLING_CYCLE_LABEL[plan.billingCycle]}</strong>
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}

              {/* DADOS DA ARENA */}
              <Divider textAlign="left">
                <Typography variant="caption" color="text.secondary">Dados da Arena</Typography>
              </Divider>

              <TextField
                label="Nome da arena"
                value={arenaName}
                onChange={(e) => setArenaName(e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="CNPJ da arena"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(formatCNPJ(e.target.value))}
                required
                fullWidth
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Telefone / WhatsApp"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 8, sm: 4 }}>
                  <TextField label="Cidade" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <TextField label="UF" value={state} onChange={(e) => setState(e.target.value.toUpperCase())} fullWidth inputProps={{ maxLength: 2 }} />
                </Grid>
              </Grid>

              <TextField
                label="CEP"
                value={zipCode}
                onChange={(e) => setZipCode(formatZipCode(e.target.value))}
                fullWidth
              />

              {/* DADOS DO GESTOR / CONTA */}
              <Divider textAlign="left">
                <Typography variant="caption" color="text.secondary">Sua conta de acesso ao painel</Typography>
              </Divider>

              <TextField label="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="CPF do responsável"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Seu e-mail (Login)"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    helperText="Mínimo 6 caracteres"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Confirmar senha"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* PAGAMENTO */}
              <Divider textAlign="left">
                <Typography variant="caption" color="text.secondary">Forma de pagamento</Typography>
              </Divider>

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
                <Stack spacing={2} sx={{ pt: 1 }}>
                  <TextField label="Nome impresso no cartão" value={holderName} onChange={(e) => setHolderName(e.target.value)} required fullWidth />
                  <TextField
                    label="Número do cartão"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    required
                    fullWidth
                  />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        label="Mês"
                        placeholder="MM"
                        value={expiryMonth}
                        onChange={(e) => setExpiryMonth(onlyDigits(e.target.value).slice(0, 2))}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        label="Ano"
                        placeholder="AAAA"
                        value={expiryYear}
                        onChange={(e) => setExpiryYear(onlyDigits(e.target.value).slice(0, 4))}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        label="CVV"
                        value={ccv}
                        onChange={(e) => setCcv(onlyDigits(e.target.value).slice(0, 4))}
                        required
                        fullWidth
                      />
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