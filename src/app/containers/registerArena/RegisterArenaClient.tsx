'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { registerArenaSchema, RegisterArenaFormData } from '@/features/arenas/schemas/registerArenaSchema';
import { arenasApi } from '@/features/arenas/api';

const COMPANY_TYPES = [
  { value: 'LIMITED', label: 'LTDA (Sociedade Limitada)' },
  { value: 'MEI', label: 'MEI (Microempreendedor Individual)' },
  { value: 'INDIVIDUAL', label: 'Empresário Individual' },
  { value: 'ASSOCIATION', label: 'Associação' },
];

const STEPS = ['Dados da Arena', 'Endereço', 'Contato & Faturamento'];

export default function RegisterArenaClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegisterArenaFormData>({
    resolver: zodResolver(registerArenaSchema),
    defaultValues: {
      token: token,
      name: '',
      email: '',
      cpfCnpj: '',
      companyType: 'LIMITED',
      phone: '',
      mobilePhone: '',
      incomeValue: 10000,
      postalCode: '',
      address: '',
      addressNumber: '',
      complement: '',
      province: '',
      city: '',
      state: '',
    },
  });

  // Autopreenchimento via CEP
  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setValue('address', data.logradouro || '');
          setValue('province', data.bairro || '');
          setValue('city', data.localidade || '');
          setValue('state', data.uf || '');
        }
      } catch (err) {
        console.error('Erro ao consultar CEP:', err);
      }
    }
  };

  const validateStep = async (step: number) => {
    let fields: (keyof RegisterArenaFormData)[] = [];
    if (step === 0) fields = ['token', 'name', 'email', 'cpfCnpj', 'companyType'];
    if (step === 1) fields = ['postalCode', 'address', 'addressNumber', 'province', 'city', 'state'];
    if (step === 2) fields = ['mobilePhone'];

    return await trigger(fields);
  };

  const handleNext = async () => {
    const isValid = await validateStep(activeStep);
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data: RegisterArenaFormData) => {
    setLoading(true);
    setSubmitError(null);
    try {
      await arenasApi.becomeArenaAdmin(data);
      // Como o cookie de auth com a role ARENA_ADMIN foi atualizado pela rota POST,
      // redirecionamos diretamente para o dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setSubmitError(err.message || 'Erro ao cadastrar arena. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Cadastrar Minha Arena
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Preencha os dados do seu estabelecimento para ativar a conta administrativa.
          </Typography>
        </Box>

        {!token && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Token de convite não informado. Verifique se você utilizou o link completo recebido no checkout.
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Passo 1: Informações Básicas */}
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <StorefrontIcon color="primary" /> Dados do Estabelecimento
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Nome da Arena / Razão Social"
                  fullWidth
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="E-mail Principal"
                  type="email"
                  fullWidth
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="CPF ou CNPJ"
                  fullWidth
                  placeholder="00.000.000/0001-00"
                  {...register('cpfCnpj')}
                  error={!!errors.cpfCnpj}
                  helperText={errors.cpfCnpj?.message}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="companyType"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Tipo de Empresa" fullWidth>
                      {COMPANY_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
          )}

          {/* Passo 2: Endereço */}
          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationOnIcon color="primary" /> Endereço
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="CEP"
                  fullWidth
                  {...register('postalCode')}
                  onBlur={handleCepBlur}
                  error={!!errors.postalCode}
                  helperText={errors.postalCode?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Logradouro (Rua, Av.)"
                  fullWidth
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Número"
                  fullWidth
                  {...register('addressNumber')}
                  error={!!errors.addressNumber}
                  helperText={errors.addressNumber?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField label="Complemento" fullWidth {...register('complement')} />
              </Grid>

              <Grid size={{ xs: 12, sm: 5 }}>
                <TextField
                  label="Bairro"
                  fullWidth
                  {...register('province')}
                  error={!!errors.province}
                  helperText={errors.province?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 5 }}>
                <TextField
                  label="Cidade"
                  fullWidth
                  {...register('city')}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 2 }}>
                <TextField
                  label="UF"
                  fullWidth
                  inputProps={{ maxLength: 2 }}
                  {...register('state')}
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />
              </Grid>
            </Grid>
          )}

          {/* Passo 3: Contato & Faturamento */}
          {activeStep === 2 && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ContactPhoneIcon color="primary" /> Contato e Faturamento
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Celular / WhatsApp (com DDD)"
                  fullWidth
                  placeholder="11999998888"
                  {...register('mobilePhone')}
                  error={!!errors.mobilePhone}
                  helperText={errors.mobilePhone?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Telefone Fixo / Comercial" fullWidth {...register('phone')} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="incomeValue"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Faturamento Mensal Estimado"
                      type="number"
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}

          {/* Botões de Ação */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button disabled={activeStep === 0 || loading} onClick={handleBack} variant="outlined">
              Voltar
            </Button>

            {activeStep < STEPS.length - 1 ? (
              <Button onClick={handleNext} variant="contained">
                Próximo
              </Button>
            ) : (
              <Button type="submit" variant="contained" color="primary" size="large" disabled={loading || !token}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Ativar Minha Arena'}
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
}