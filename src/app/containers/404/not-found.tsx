import Link from 'next/link';
import Image from 'next/image';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import HomeIcon from '@mui/icons-material/Home';

export default function NotFound() {
  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        py: 4,
      }}
    >

      {/* Ícone de Bola/Raquete com Estilo Temático */}
      <Box
        sx={{
          bgcolor: 'action.hover',
          p: 3,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <SportsTennisIcon sx={{ fontSize: 64, color: 'primary.main' }} />
      </Box>

      {/* Código de Erro 404 */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '4rem', md: '6rem' },
          fontWeight: 800,
          color: 'text.primary',
          lineHeight: 1,
          mb: 1,
        }}
      >
        404
      </Typography>

      {/* Título e Descrição */}
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Essa bola foi fora!
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 480, mb: 4 }}
      >
        A página que você está procurando não existe, foi movida ou a URL foi digitada incorretamente.
      </Typography>

      {/* Ações de Navegação */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
            <Link href="/" passHref style={{ textDecoration: 'none' }}>
                <Button
                variant="contained"
                size="large"
                startIcon={<HomeIcon />}
                >
                Voltar para o Início
                </Button>
            </Link>

            <Link href="/login" passHref style={{ textDecoration: 'none' }}>
                <Button
                variant="outlined"
                size="large"
                color="inherit"
                >
                Ir para Login
                </Button>
            </Link>
        </Stack>
    </Container>
  );
}