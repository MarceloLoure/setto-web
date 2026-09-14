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
import Image from 'next/image';

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
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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
          <Link href="/" style={{ textDecoration: 'none', display: 'flex' }}>
            <Image
              src="/header.webp"
              alt="Setto Arenas"
              width={100}
              height={50}
              priority
              style={{ objectFit: 'contain' }}
            />
          </Link>
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

      {/* Banner Principal - Full Width (Solto fora do Container) */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          maxHeight: 450,
          height: "auto",
          my: { xs: 2, md: 4 },
          overflow: 'hidden',
          borderRadius: { xs: 1, md: 2 },
          mx: 'auto',
          padding: { xs: '0px 5px', md: 0 },
        }}
      >
        <Image
          src="/banner_principal.webp"
          alt="Banner Setto Arenas"
          width={1200}
          height={450}
          sizes="100vw"
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </Box>

      {/* Hero Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }} sx={{ justifySelf: {xs: 'center', md: 'start'}, textAlign: {xs: 'center', md: 'start'} }}>
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
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={{xs: 2}}>
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
            <Grid container spacing={4} justifyContent="center" alignItems="center">
              {[
                { value: data.stats.activeArenas, label: 'arenas ativas na plataforma' },
                { value: data.stats.activeCourts, label: 'quadras gerenciadas' },
                { value: data.stats.totalBookings, label: 'reservas realizadas' },
              ].map((stat) => (
                <Grid size={{ xs: 12, sm: 4 }} key={stat.label} sx={{ textAlign: 'center' }}>
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
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }}} id="recursos">
        <Typography variant="h4" fontWeight={800} sx={{ mb: 5, maxWidth: 560, justifySelf: 'center', textAlign: 'center' }}>
          Tudo que sua arena precisa pra parar de perder reserva por WhatsApp
        </Typography>
        <Grid container spacing={4} mt={2}>
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
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, textAlign: 'center' }} id="planos">
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
          <Grid container spacing={3} mt={2} justifyContent="center">
            {data.plans.map((plan: any, index: number) => {
              const isHighlighted = index === Math.floor((data.plans.length - 1) / 2) && data.plans.length > 1;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.id}>
                  <Box
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: isHighlighted ? 'primary.main' : 'divider',
                      bgcolor: 'background.paper',
                      position: 'relative',
                      justifyItems: 'center',
                    }}
                  >
                    {isHighlighted && (
                      <Chip
                        label="Mais escolhido"
                        color="primary"
                        size="small"
                        sx={{ position: 'absolute', top: -12, left: 24, justifyContent: 'center', fontWeight: 700, px: 1.5, py: 0.25 }}
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
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="space-between">
          <Grid size={{ xs: 12, sm: 5 }} textAlign={'center'} justifyItems={'center'}>
            <Image
              src="/header.webp"
              alt="Setto Arenas"
              width={100}
              height={50}
              priority
              style={{ objectFit: 'contain', marginBottom: 12 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, mb: 2 }}>
              A plataforma completa para gestão, agendamento e pagamento automatizado para arenas esportivas.
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              © {new Date().getFullYear()} Setto. Todos os direitos reservados.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 7 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 6 }} textAlign={'center'}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                  Institucional
                </Typography>
                <Stack spacing={1} mt={1}>
                  <Button component={Link} href="/politica-de-privacidade" color="inherit" size="small" sx={{ justifyContent: 'flex-start', p: 0 }}>
                    Política de Privacidade
                  </Button>
                  <Button component={Link} href="/termos-de-uso" color="inherit" size="small" sx={{ justifyContent: 'flex-start', p: 0 }}>
                    Termos de Uso
                  </Button>
                </Stack>
              </Grid>

              <Grid size={{ xs: 6, sm: 6 }} textAlign={'center'}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                  Acesso
                </Typography>
                <Stack spacing={1} mt={1}>
                  <Button component={Link} href="/login" color="inherit" size="small" sx={{ justifyContent: 'flex-start', p: 0 }}>
                    Área do Cliente
                  </Button>
                  <Button component="a" href="#planos" color="inherit" size="small" sx={{ justifyContent: 'flex-start', p: 0 }}>
                    Cadastrar Arena
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <CheckoutDialog plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
    </Box>
  );
}