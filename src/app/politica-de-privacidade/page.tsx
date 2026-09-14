import React from 'react';
import { Box, Container, Typography, Stack, Divider, Link as MuiLink } from '@mui/material';
import type { Metadata } from 'next';

const CONTROLLER_NAME = 'Felipe de Souza Fuzzo';
const CONTROLLER_DOCUMENT = 'CPF: 152.102.989-06';
const CONTROLLER_ADDRESS = 'Siqueira Campos — PR';
const PRIVACY_EMAIL = 'settoarenas.suporte@gmail.com';
const LAST_UPDATED = '14 de setembro de 2026';

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
          Esta Política de Privacidade descreve como o aplicativo Setto coleta, utiliza, armazena,
          protege e, quando necessário, compartilha dados pessoais de seus usuários, em conformidade
          com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD) e com as regras
          aplicáveis da Google Play.
        </P>
        <P>Ao criar uma conta ou utilizar o Setto, você declara que leu e compreendeu esta Política de Privacidade.</P>

        <Divider sx={{ my: 3 }} />

        <SectionTitle>1. Quem somos</SectionTitle>
        <P>
          O Setto é um aplicativo mobile destinado à descoberta de arenas esportivas, acompanhamento de
          arenas, consulta de disponibilidade, agendamento de quadras e realização de pagamentos relacionados
          às reservas.
        </P>
        <P>Controlador dos dados pessoais:</P>
        <Ul>
          <Li>Nome: {CONTROLLER_NAME}</Li>
          <Li>{CONTROLLER_DOCUMENT}</Li>
          <Li>E-mail de contato sobre privacidade: <MuiLink href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</MuiLink></Li>
          <Li>Endereço: {CONTROLLER_ADDRESS}</Li>
        </Ul>

        <SectionTitle>2. Dados que coletamos</SectionTitle>
        <P>Os dados coletados podem variar de acordo com a utilização dos recursos disponíveis no aplicativo.</P>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          2.1 Dados de cadastro e perfil
        </Typography>
        <P>Podemos coletar:</P>
        <Ul>
          <Li>Nome completo</Li>
          <Li>E-mail</Li>
          <Li>Senha de acesso</Li>
          <Li>Telefone (quando informado)</Li>
          <Li>CPF (quando necessário para determinadas funcionalidades e pagamentos)</Li>
          <Li>Gênero e data de nascimento (quando informados)</Li>
          <Li>Cidade e estado</Li>
          <Li>Biografia ou outras informações de perfil (quando informadas)</Li>
          <Li>Foto de perfil e imagem de capa (quando enviadas)</Li>
        </Ul>
        <P>
          A senha não é armazenada em texto puro. Ela é protegida utilizando mecanismos de segurança apropriados,
          de forma que não tenhamos acesso à senha original do usuário.
        </P>
        <P>
          A autenticação da conta pode utilizar serviços do Firebase Authentication, da Google, para criação,
          autenticação e gerenciamento seguro das credenciais de acesso.
        </P>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          2.2 Dados relacionados ao uso do aplicativo
        </Typography>
        <P>Durante a utilização do Setto, podemos armazenar informações necessárias ao funcionamento do serviço, incluindo:</P>
        <Ul>
          <Li>Arenas seguidas pelo usuário</Li>
          <Li>Arenas visualizadas ou selecionadas</Li>
          <Li>Reservas realizadas, com datas, horários e quadras associadas</Li>
          <Li>Status das reservas e informações de pagamentos</Li>
          <Li>Identificadores e informações técnicas necessárias para segurança, autenticação e funcionamento do aplicativo</Li>
        </Ul>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          2.3 Dados de localização
        </Typography>
        <P>
          O Setto pode solicitar acesso à localização do dispositivo somente enquanto o aplicativo estiver aberto e sendo utilizado.
          A localização é utilizada exclusivamente para:
        </P>
        <Ul>
          <Li>encontrar e apresentar arenas esportivas próximas ao usuário;</Li>
          <Li>melhorar a experiência de descoberta de arenas.</Li>
        </Ul>
        <P>
          <strong>O Setto não coleta localização em segundo plano.</strong> O usuário pode negar ou revogar a permissão nas
          configurações do próprio dispositivo. Caso negada, o app continuará funcionando com recursos de proximidade limitados.
        </P>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          2.4 Câmera e galeria de fotos
        </Typography>
        <P>
          O Setto poderá solicitar acesso à câmera ou galeria de fotos somente quando o usuário optar por adicionar foto de perfil,
          imagem de capa ou realizar ações ativas de upload no app. Não utilizamos a câmera em segundo plano.
        </P>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          2.5 Dados de pagamento
        </Typography>
        <P>
          Para permitir o pagamento de reservas (Pix e cartão), o Setto utiliza serviços de processamento fornecidos pelo Asaas.
          Podem ser tratados dados como: valor, identificador e status da cobrança, informações da reserva, dados necessários à autorização,
          token de pagamento e informações básicas do cartão disponibilizadas pelo provedor.
        </P>
        <P>
          Quando o usuário opta por salvar um cartão para pagamentos futuros, o Setto armazena apenas um token fornecido pelo Asaas
          e dados limitados de identificação (como os últimos 4 dígitos e validade). O token não corresponde ao número completo do cartão.
        </P>

        <SectionTitle>3. Para que utilizamos seus dados</SectionTitle>
        <P>Tratamos seus dados pessoais para:</P>
        <Ul>
          <Li>criar e gerenciar sua conta e autenticar o usuário;</Li>
          <Li>permitir edição de perfil e envio de fotos/imagens;</Li>
          <Li>apresentar arenas esportivas, quadras e disponibilidades;</Li>
          <Li>processar agendamentos, reservas e pagamentos;</Li>
          <Li>permitir pagamentos futuros utilizando cartão previamente tokenizado, quando solicitado pelo usuário;</Li>
          <Li>enviar informações operacionais sobre reservas, pagamentos e recuperação de acesso;</Li>
          <Li>manter a segurança, prevenir fraudes, abusos e atividades ilícitas;</Li>
          <Li>identificar e solucionar erros técnicos e cumprir obrigações legais e regulatórias.</Li>
        </Ul>

        <SectionTitle>4. Bases legais para o tratamento</SectionTitle>
        <P>O tratamento dos dados pessoais fundamenta-se na LGPD através das bases de:</P>
        <Ul>
          <Li><strong>Execução de contrato:</strong> para prestação dos serviços (conta, reservas, agendamentos e pagamentos);</Li>
          <Li><strong>Consentimento:</strong> para funcionalidades que dependam de autorização prévia (localização em uso, câmera e galeria);</Li>
          <Li><strong>Cumprimento de obrigação legal ou regulatória:</strong> conforme exigido por legislação ou ordens de autoridades;</Li>
          <Li><strong>Legítimo interesse:</strong> para segurança da plataforma, prevenção contra fraudes, diagnósticos e melhorias do serviço.</Li>
        </Ul>

        <SectionTitle>5. Compartilhamento de dados</SectionTitle>
        <P>O Setto não vende dados pessoais. O compartilhamento ocorre apenas quando estritamente necessário:</P>
        <Ul>
          <Li>
            <strong>Arenas esportivas:</strong> ao realizar uma reserva, a arena recebe o nome do cliente e dados do horário/quadra para atendimento. A arena não possui acesso ao cadastro completo, CPF, senha ou dados de cartão.
          </Li>
          <Li>
            <strong>Provedores de pagamento:</strong> dados necessários ao processamento, tokenização, autorização e prevenção a fraudes são tratados junto ao gateway Asaas.
          </Li>
          <Li>
            <strong>Serviços de infraestrutura e autenticação:</strong> utilizaremos provedores como o Firebase Authentication para gestão segura de credenciais.
          </Li>
          <Li>
            <strong>Autoridades públicas:</strong> quando houver obrigação legal, ordem judicial ou determinação válida.
          </Li>
        </Ul>

        <SectionTitle>6. Armazenamento e segurança</SectionTitle>
        <P>
          Adotamos medidas técnicas e administrativas razoáveis para proteger seus dados contra acessos não autorizados, perdas ou alterações,
          incluindo comunicação segura via HTTPS, controle de acesso e tokens de autenticação.
        </P>

        <SectionTitle>7. Retenção e exclusão da conta</SectionTitle>
        <P>
          Os dados são mantidos pelo período necessário para prestação do serviço, histórico de reservas, comprovantes fiscais e obrigações legais.
        </P>
        <P>
          <strong>Exclusão da conta:</strong> o usuário pode solicitar a exclusão de sua conta diretamente pelo aplicativo Setto. Dados associados serão
          excluídos ou anonimizados, respeitados os prazos e obrigações legais de retenção (ex.: registros fiscais de pagamentos).
        </P>

        <SectionTitle>8. Direitos do usuário (LGPD)</SectionTitle>
        <P>Você pode solicitar confirmação da existência de tratamento, acesso, correção, anonimização, exclusão, portabilidade ou revogação de consentimento.</P>
        <P>
          Para exercer seus direitos, entre em contato via e-mail{' '}
          <MuiLink href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</MuiLink> com o assunto &ldquo;LGPD — Setto&rdquo;.
          Você também tem o direito de apresentar reclamação perante a Autoridade Nacional de Proteção de Dados (ANPD).
        </P>

        <SectionTitle>9. Conta de menores</SectionTitle>
        <P>
          O Setto não é destinado a crianças menores de 13 anos. Menores de idade devem utilizar o app sob autorização e supervisão de seus responsáveis legais.
        </P>

        <SectionTitle>10. Serviços de terceiros e links</SectionTitle>
        <P>
          O app utiliza serviços de terceiros como <strong>Firebase Authentication</strong> (autenticação) e <strong>Asaas</strong> (pagamentos), além de links
          para mapas ou páginas externas. Esta política não cobre o tratamento realizado diretamente em ambientes de terceiros.
        </P>

        <SectionTitle>11. Alterações nesta Política</SectionTitle>
        <P>
          Podemos atualizar esta Política periodicamente. Mudanças relevantes serão notificadas via aplicativo ou e-mail.
        </P>

        <SectionTitle>12. Contato</SectionTitle>
        <P>Para dúvidas ou solicitações relacionadas a esta Política:</P>
        <Ul>
          <Li>Responsável: {CONTROLLER_NAME}</Li>
          <Li>Cidade/UF: {CONTROLLER_ADDRESS}</Li>
          <Li>E-mail: <MuiLink href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</MuiLink></Li>
          <Li>Site oficial: <MuiLink href="https://www.settoarenas.com.br/" target="_blank" rel="noopener">https://www.settoarenas.com.br/</MuiLink></Li>
        </Ul>

        <Divider sx={{ my: 4 }} />
        <Stack direction="row" justifyContent="center">
          <MuiLink href="/">Voltar para o início</MuiLink>
        </Stack>
      </Container>
    </Box>
  );
}