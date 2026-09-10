'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Chip,
  CircularProgress,
  Container,
} from '@mui/material';
import { useAuth } from '@/features/auth/AuthContext';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PaidIcon from '@mui/icons-material/Paid';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { publicApi } from '@/features/public/api';
import CheckoutDialog from '@/features/public/components/CheckoutDialog';

const FEATURES = [
  {
    icon: EventAvailableIcon,
    title: 'Agenda em tempo real',
    description: 'Quadras, horários e feriados configurados por você. A disponibilidade aparece pro atleta na hora, sem overbooking.',
  },
  {
    icon: PaidIcon,
    title: 'Cobrança automática',
    description: 'Pix ou cartão gerado no ato da reserva. Se o atleta não pagar em 30 minutos, o horário volta sozinho pra grade.',
  },
  {
    icon: PhoneIphoneIcon,
    title: 'App para os atletas',
    description: 'Seus clientes reservam e pagam pelo celular, sem precisar ligar ou mandar mensagem pra confirmar horário.',
  },
  {
    icon: QueryStatsIcon,
    title: 'Financeiro consolidado',
    description: 'Faturamento, ticket médio e taxa de cancelamento num painel só — sem planilha paralela.',
  },
];

const BILLING_CYCLE_LABEL: Record<string, string> = {
  MONTHLY: 'mês',
  QUARTERLY: 'trimestre',
  SEMIANNUALLY: 'semestre',
  ANNUALLY: 'ano',
};

function currencyBR(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function CourtLine() {
  return (
    <Box
      sx={{
        borderTop: '2px dashed',
        borderColor: 'divider',
        width: '100%',
      }}
    />
  );
}

export default function RootPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    (async () => {
      try {
        const result = await publicApi.getLandingPageData();
        setData(result);
      } catch {
      } finally {
        setIsLoadingData(false);
      }
    })();
  }, []);

  console.log(data)

  if (isLoading || isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Nav */}
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 2.5 }}>
          <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em">
            Setto
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button component={Link} href="/login" color="inherit">
              Entrar
            </Button>
            <Button component="a" href="#planos" variant="contained">
              Ver planos
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* Hero */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2.25rem', md: '3.25rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                mb: 3,
              }}
            >
              Sua arena de beach tennis, futevôlei e vôlei, agendada e paga sozinha
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ mb: 4, maxWidth: 520 }}>
              O Setto cuida da grade de horários, cobra o atleta na hora da reserva e libera o financeiro
              da sua arena de qualquer planilha.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component="a" href="#planos" variant="contained" size="large">
                Cadastrar minha arena
              </Button>
              <Button component="a" href="#recursos" size="large" color="inherit">
                Como funciona
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                p: 2.5,
                bgcolor: 'background.paper',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <FiberManualRecordIcon sx={{ fontSize: 10, color: 'success.main' }} />
                <Typography variant="caption" color="text.secondary">
                  Agenda de hoje — Arena Praia Sul
                </Typography>
              </Stack>
              <Stack spacing={1.25}>
                {[
                  { court: 'Quadra 1 · Beach Tennis', time: '18:00 — 19:00', status: 'Confirmado' },
                  { court: 'Quadra 2 · Futevôlei', time: '19:00 — 20:00', status: 'Livre' },
                  { court: 'Quadra 3 · Beach Tennis', time: '19:00 — 20:00', status: 'Aguardando Pix' },
                ].map((slot) => (
                  <Stack
                    key={slot.court}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {slot.court}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {slot.time}
                      </Typography>
                    </Box>
                    <Chip
                      label={slot.status}
                      size="small"
                      color={slot.status === 'Confirmado' ? 'success' : slot.status === 'Livre' ? 'default' : 'warning'}
                      variant={slot.status === 'Livre' ? 'outlined' : 'filled'}
                    />
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Prova social */}
      {data && data.stats.activeArenas > 0 && (
        <>
          <Container maxWidth="lg"><CourtLine /></Container>
          <Container maxWidth="lg" sx={{ py: 5 }}>
            <Grid container spacing={4}>
              {[
                { value: data.stats.activeArenas, label: 'arenas ativas na plataforma' },
                { value: data.stats.activeCourts, label: 'quadras gerenciadas' },
                { value: data.stats.totalBookings, label: 'reservas realizadas' },
              ].map((stat) => (
                <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
                  <Typography variant="h3" fontWeight={800} color="primary.main">
                    {stat.value.toLocaleString('pt-BR')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      )}

      <Container maxWidth="lg"><CourtLine /></Container>

      {/* Recursos */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }} id="recursos">
        <Typography variant="h4" fontWeight={800} sx={{ mb: 5, maxWidth: 560 }}>
          Tudo que sua arena precisa pra parar de perder reserva por WhatsApp
        </Typography>
        <Grid container spacing={4}>
          {FEATURES.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <Grid size={{ xs: 12, sm: 6 }} key={feature.title}>
                <Stack direction="row" spacing={2}>
                  <FeatureIcon style={{ color: '#00D8A7', fontSize: 32, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <Container maxWidth="lg"><CourtLine /></Container>

      {/* Planos */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }} id="planos">
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
          Escolha o plano da sua arena
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
          Sem contrato de fidelidade. Cancele quando quiser pelo painel.
        </Typography>

        {isLoadingData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : !data || data.plans.length === 0 ? (
          <Typography color="text.secondary">
            Nenhum plano disponível no momento. Fale com a gente para uma proposta sob medida.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {data.plans.map((plan:any, index:number) => {
              const isHighlighted = index === Math.floor((data.plans.length - 1) / 2) && data.plans.length > 1;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.id}>
                  <Box
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: isHighlighted ? 'primary.main' : 'divider',
                      bgcolor: 'background.paper',
                      position: 'relative',
                    }}
                  >
                    {isHighlighted && (
                      <Chip
                        label="Mais escolhido"
                        color="primary"
                        size="small"
                        sx={{ position: 'absolute', top: -12, left: 24 }}
                      />
                    )}
                    <Typography variant="h6" fontWeight={700}>
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {plan.description}
                    </Typography>
                    <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mb: 2 }}>
                      <Typography variant="h4" fontWeight={800}>
                        {currencyBR(plan.price)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        /{BILLING_CYCLE_LABEL[plan.billingCycle]}
                      </Typography>
                    </Stack>
                    <Stack spacing={0.75} sx={{ mb: 3, flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {plan.maxCourts ? `Até ${plan.maxCourts} quadras` : 'Quadras ilimitadas'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.maxStaff ? `Até ${plan.maxStaff} funcionários` : 'Funcionários ilimitados'}
                      </Typography>
                    </Stack>
                    <Button
                      variant={isHighlighted ? 'contained' : 'outlined'}
                      size="large"
                      onClick={() => setSelectedPlan(plan)}
                      fullWidth
                    >
                      Assinar {plan.name}
                    </Button>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* Footer */}
      <Container maxWidth="lg"><CourtLine /></Container>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Setto. Todos os direitos reservados.
          </Typography>
          <Button component={Link} href="/login" color="inherit" size="small">
            Já sou cliente — Entrar
          </Button>
        </Stack>
      </Container>

      <CheckoutDialog plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
    </Box>
  );
}
