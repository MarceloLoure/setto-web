import React from 'react';
import { Box, Container, Typography, Stack, Divider, Link as MuiLink } from '@mui/material';
import type { Metadata } from 'next';

// ⚠️ Preencha estes dados antes de publicar — são exigidos pela Google Play
// e pela App Store (razão social/CPF-CNPJ do controlador e e-mail de contato
// de privacidade precisam ser reais e válidos, não podem ficar como placeholder).
const CONTROLLER_NAME = '[Nome completo / Razão social]';
const CONTROLLER_DOCUMENT = '[CPF ou CNPJ]';
const CONTROLLER_ADDRESS = '[Cidade/UF — ou endereço completo]';
const PRIVACY_EMAIL = '[seu-email@dominio.com]';
const LAST_UPDATED = '10 de setembro de 2026';

export const metadata: Metadata = {
  title: 'Política de Privacidade — Setto',
  description: 'Política de Privacidade do aplicativo Setto, em conformidade com a LGPD.',
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 1.5 }}>
      {children}
    </Typography>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.75 }}>
      {children}
    </Typography>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <Box component="ul" sx={{ pl: 3, mb: 1.5, color: 'text.secondary' }}>
      {children}
    </Box>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <Typography component="li" variant="body1" color="text.secondary" sx={{ mb: 0.75, lineHeight: 1.75 }}>
      {children}
    </Typography>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Política de Privacidade — Setto
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Última atualização: {LAST_UPDATED}
        </Typography>

        <P>
          Esta Política de Privacidade descreve como o aplicativo Setto coleta, usa, armazena,
          compartilha e protege os dados pessoais dos usuários (&ldquo;você&rdquo;), em conformidade
          com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD) e com as regras da Google
          Play.
        </P>
        <P>Ao criar uma conta ou utilizar o Setto, você declara ter lido e compreendido esta Política.</P>

        <Divider sx={{ my: 3 }} />

        <SectionTitle>1. Quem somos</SectionTitle>
        <P>
          O Setto é um aplicativo mobile para descoberta de arenas esportivas, acompanhamento de
          arenas, agendamento de quadras e pagamento de reservas.
        </P>
        <P>Controlador dos dados:</P>
        <Ul>
          <Li>{CONTROLLER_NAME}</Li>
          <Li>{CONTROLLER_DOCUMENT}</Li>
          <Li>E-mail de contato sobre privacidade: {PRIVACY_EMAIL}</Li>
          <Li>Endereço: {CONTROLLER_ADDRESS}</Li>
        </Ul>

        <SectionTitle>2. Dados que coletamos</SectionTitle>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          2.1 Dados de cadastro e perfil
        </Typography>
        <Ul>
          <Li>Nome completo</Li>
          <Li>E-mail</Li>
          <Li>
            Senha (armazenada de forma criptografada/hash pelo nosso servidor; não temos acesso à
            senha em texto puro)
          </Li>
          <Li>Telefone (quando informado)</Li>
          <Li>CPF (necessário para agendar e para processamento de pagamentos)</Li>
          <Li>Gênero e data de nascimento (quando informados)</Li>
          <Li>Cidade e estado</Li>
          <Li>Biografia / informações de perfil (quando informadas)</Li>
          <Li>Foto de perfil e imagem de capa (quando enviadas)</Li>
        </Ul>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          2.2 Dados de uso do Aplicativo
        </Typography>
        <Ul>
          <Li>Arenas seguidas</Li>
          <Li>Reservas e horários agendados</Li>
          <Li>Histórico de pagamentos relacionados às reservas</Li>
          <Li>
            Interações necessárias ao funcionamento do app (ex.: listagem de arenas, disponibilidade
            de quadras)
          </Li>
        </Ul>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          2.3 Dados de localização
        </Typography>
        <P>
          Com a sua permissão, podemos acessar a localização aproximada ou precisa do dispositivo
          para:
        </P>
        <Ul>
          <Li>sugerir arenas e conteúdo relevantes à sua cidade;</Li>
          <Li>personalizar a experiência na tela inicial.</Li>
        </Ul>
        <P>
          Você pode negar ou revogar essa permissão nas configurações do aparelho. Sem localização, o
          app continua funcionando, podendo usar a cidade informada no perfil ou conteúdo genérico.
        </P>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          2.4 Câmera e fotos
        </Typography>
        <P>
          Com a sua permissão, podemos acessar a câmera ou a galeria apenas para que você envie foto
          de perfil/capa. Não usamos a câmera em segundo plano.
        </P>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          2.5 Dados de pagamento
        </Typography>
        <P>Para reservas pagas (Pix ou cartão), podemos processar:</P>
        <Ul>
          <Li>valor, status e identificadores da cobrança/reserva;</Li>
          <Li>
            dados necessários ao pagamento (ex.: dados do cartão tokenizados, CEP e número do
            endereço do titular, quando aplicável).
          </Li>
        </Ul>
        <P>
          <strong>Importante:</strong> dados sensíveis de cartão (número completo e CVV) são tratados
          por meio de provedores de pagamento (tokenização). Não armazenamos o número completo do
          cartão nem o CVV nos nossos servidores de forma legível para uso indevido.
        </P>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          2.6 Dados técnicos
        </Typography>
        <Ul>
          <Li>Identificadores de sessão/token de autenticação</Li>
          <Li>
            Informações básicas do dispositivo e logs técnicos necessários à segurança, diagnóstico e
            funcionamento do serviço
          </Li>
          <Li>Comunicação com nossos servidores via internet</Li>
        </Ul>

        <SectionTitle>3. Para que usamos seus dados</SectionTitle>
        <P>Tratamos seus dados para:</P>
        <Ul>
          <Li>criar e autenticar sua conta;</Li>
          <Li>permitir edição de perfil e upload de fotos;</Li>
          <Li>localizar e exibir arenas, horários e disponibilidades;</Li>
          <Li>processar agendamentos e pagamentos;</Li>
          <Li>salvar cartões tokenizados a seu pedido, para facilitar pagamentos futuros;</Li>
          <Li>enviar informações operacionais (ex.: status de reserva/pagamento, recuperação de senha);</Li>
          <Li>cumprir obrigações legais e regulatórias;</Li>
          <Li>prevenir fraudes, abusos e falhas de segurança;</Li>
          <Li>melhorar a experiência e o desempenho do Aplicativo.</Li>
        </Ul>

        <SectionTitle>4. Bases legais (LGPD)</SectionTitle>
        <P>Dependendo do caso, o tratamento pode se basear em:</P>
        <Ul>
          <Li>execução de contrato (prestação do serviço de conta, agendamento e pagamento);</Li>
          <Li>consentimento (ex.: localização, câmera/galeria, quando exigido);</Li>
          <Li>cumprimento de obrigação legal/regulatória;</Li>
          <Li>
            legítimo interesse (segurança, prevenção a fraudes e melhorias do serviço), observado o
            seu direito e a LGPD.
          </Li>
        </Ul>

        <SectionTitle>5. Compartilhamento de dados</SectionTitle>
        <P>Podemos compartilhar dados com:</P>
        <Ul>
          <Li>
            <strong>Arenas / estabelecimentos</strong> — informações necessárias para confirmar e
            gerir a reserva (ex.: nome, horário, quadra, status do pagamento).
          </Li>
          <Li>
            <strong>Provedores de pagamento</strong> — para processar Pix/cartão e antifraude (ex.:
            gateways como Asaas ou equivalentes utilizados pela operação).
          </Li>
          <Li>
            <strong>Infraestrutura de nuvem e hospedagem</strong> — para armazenamento e operação do
            backend.
          </Li>
          <Li>
            <strong>Serviços de autenticação/notificação</strong> e ferramentas técnicas necessárias
            ao funcionamento do app (quando aplicável).
          </Li>
          <Li>
            <strong>Autoridades públicas</strong> — quando houver obrigação legal ou ordem válida.
          </Li>
        </Ul>
        <P>Não vendemos seus dados pessoais.</P>

        <SectionTitle>6. Armazenamento e segurança</SectionTitle>
        <P>
          Seus dados são armazenados em servidores sob nosso controle ou de fornecedores contratados,
          com medidas técnicas e administrativas razoáveis de proteção (controle de acesso,
          criptografia em trânsito via HTTPS, tokens de sessão, etc.).
        </P>
        <P>
          Nenhum sistema é 100% seguro. Em caso de incidente relevante, adotaremos as medidas
          cabíveis, inclusive comunicação quando exigido pela LGPD.
        </P>

        <SectionTitle>7. Retenção dos dados</SectionTitle>
        <P>Mantemos os dados apenas pelo tempo necessário para:</P>
        <Ul>
          <Li>prestar o serviço;</Li>
          <Li>cumprir obrigações legais, fiscais e contábeis;</Li>
          <Li>resolver disputas e prevenir fraudes.</Li>
        </Ul>
        <P>
          Você pode solicitar exclusão da conta e dos dados, observados prazos legais de retenção
          (ex.: registros de pagamento).
        </P>

        <SectionTitle>8. Seus direitos (LGPD)</SectionTitle>
        <P>Você pode solicitar:</P>
        <Ul>
          <Li>confirmação da existência de tratamento;</Li>
          <Li>acesso aos dados;</Li>
          <Li>correção de dados incompletos, inexatos ou desatualizados;</Li>
          <Li>anonimização, bloqueio ou eliminação de dados desnecessários;</Li>
          <Li>portabilidade, quando aplicável;</Li>
          <Li>informação sobre compartilhamentos;</Li>
          <Li>revogação do consentimento;</Li>
          <Li>eliminação dos dados tratados com base no consentimento, na forma da lei.</Li>
        </Ul>
        <P>
          Para exercer seus direitos, envie e-mail para{' '}
          <MuiLink href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</MuiLink> com o assunto
          &ldquo;LGPD — Setto&rdquo;.
        </P>
        <P>Também é possível apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).</P>

        <SectionTitle>9. Conta de menores</SectionTitle>
        <P>
          O Setto não é destinado a crianças menores de 13 anos. Se você tiver menos de 18 anos,
          utilize o app apenas com supervisão/autorização do responsável legal, quando aplicável.
        </P>

        <SectionTitle>10. Links e serviços de terceiros</SectionTitle>
        <P>
          O Aplicativo pode abrir mapas, links externos ou serviços de pagamento de terceiros. Esta
          Política não cobre o tratamento feito por esses terceiros. Recomendamos ler as políticas
          deles.
        </P>

        <SectionTitle>11. Alterações nesta Política</SectionTitle>
        <P>
          Podemos atualizar esta Política periodicamente. A data de &ldquo;Última atualização&rdquo;
          será revisada. Em mudanças relevantes, poderemos avisar pelo app ou por e-mail, quando
          adequado.
        </P>

        <SectionTitle>12. Contato</SectionTitle>
        <P>Dúvidas sobre privacidade ou dados pessoais:</P>
        <Ul>
          <Li>
            E-mail: <MuiLink href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</MuiLink>
          </Li>
          <Li>App: Setto</Li>
        </Ul>

        <Divider sx={{ my: 4 }} />
        <Stack direction="row" justifyContent="center">
          <MuiLink href="/">Voltar para o início</MuiLink>
        </Stack>
      </Container>
    </Box>
  );
}
