import React from 'react';
import { Box, Container, Typography, Stack, Divider, Link as MuiLink } from '@mui/material';
import type { Metadata } from 'next';

const COMPANY_NAME = 'Felipe de Souza Fuzzo';
const COMPANY_DOCUMENT = 'CPF: 152.102.989-06';
const COMPANY_ADDRESS = 'Siqueira Campos — PR';
const SUPPORT_EMAIL = 'settoarenas.suporte@gmail.com';
const LAST_UPDATED = '14 de setembro de 2026';

export const metadata: Metadata = {
  title: 'Termos de Uso — Setto',
  description: 'Termos e Condições Gerais de Uso do aplicativo e plataforma Setto.',
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

export default function TermsOfServicePage() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Termos e Condições Gerais de Uso — Setto
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Última atualização: {LAST_UPDATED}
        </Typography>

        <P>
          Estes Termos de Uso regem o acesso e a utilização do aplicativo móvel, painel administrativo e serviços oferecidos
          pela plataforma <strong>Setto</strong>, operada por {COMPANY_NAME} ({COMPANY_DOCUMENT}), sediada em {COMPANY_ADDRESS}.
        </P>
        <P>
          Ao criar uma conta, utilizar o aplicativo móvel ou assinar qualquer plano do Setto, você declara que leu, compreendeu
          e concorda integralmente com estes Termos.
        </P>

        <Divider sx={{ my: 3 }} />

        <SectionTitle>1. Definições</SectionTitle>
        <Ul>
          <Li><strong>Plataforma Setto:</strong> Conjunto de sistemas, incluindo painel web de gestão, APIs e aplicativo móvel para atletas.</Li>
          <Li><strong>Arena (Contratante):</strong> Estabelecimento esportivo cadastrado na plataforma para gerenciar quadras, horários e cobranças.</Li>
          <Li><strong>Atleta (Usuário Final):</strong> Pessoa física que utiliza o aplicativo para visualizar, agendar e pagar por horários de quadras nas Arenas.</Li>
          <Li><strong>Provedor de Pagamento:</strong> Instituição parceira responsável pelo processamento de transações de Pix e Cartão de Crédito (Asaas).</Li>
        </Ul>

        <SectionTitle>2. Objeto e Serviços</SectionTitle>
        <P>
          O Setto é uma plataforma SaaS (Software como Serviço) desenvolvida para intermediar e automatizar a gestão de arenas esportivas,
          incluindo disponibilização de agenda em tempo real, aplicativo móvel para reservas e automação financeira.
        </P>

        <SectionTitle>3. Cadastro e Segurança da Conta</SectionTitle>
        <P>
          Para utilizar os recursos da plataforma, o usuário ou gestor da arena deve fornecer dados autênticos, atualizados e completos.
        </P>
        <Ul>
          <Li>A responsabilidade pela guarda das credenciais de acesso (e-mail e senha) é exclusivamente do usuário.</Li>
          <Li>O Setto utiliza o serviço <strong>Firebase Authentication</strong> para garantir autenticação segura.</Li>
          <Li>Caso identifique uso não autorizado de sua conta, o usuário deve comunicar o suporte imediatamente.</Li>
        </Ul>

        <SectionTitle>4. Planos, Assinaturas e Cancelamento de Arenas</SectionTitle>
        <P>
          As Arenas contratam a plataforma mediante assinatura de planos com ciclos de faturamento configurados (mensal, trimestral, semestral ou anual).
        </P>
        <Ul>
          <Li>
            <strong>Sem fidelidade obrigatória:</strong> A Arena pode solicitar o cancelamento ou a alteração de seu plano a qualquer momento pelo painel ou contato com o suporte.
          </Li>
          <Li>
            <strong>Inadimplência:</strong> O atraso no pagamento do plano da Arena poderá acarretar a suspensão temporária do acesso ao painel de gestão e à visibilidade no aplicativo.
          </Li>
        </Ul>

        <SectionTitle>5. Agendamentos, Reservas e Pagamentos por Atletas</SectionTitle>
        <P>
          O Setto permite aos Atletas efetuar reservas diretas de quadras disponíveis através do aplicativo.
        </P>
        <Ul>
          <Li>
            <strong>Processamento de Pagamento:</strong> Todas as cobranças via Pix e Cartão de Crédito são processadas de forma segura através do gateway <strong>Asaas</strong>.
          </Li>
          <Li>
            <strong>Prazo de Pagamento via Pix:</strong> Agendamentos pendentes de pagamento via Pix possuem um prazo estipulado (ex.: 30 minutos). Caso o pagamento não seja confirmado dentro deste prazo, o horário será automaticamente liberado para a grade.
          </Li>
          <Li>
            <strong>Políticas de Cancelamento e Reembolso:</strong> O cancelamento de reservas e regras de reembolso ou crédito de horários são definidos por cada Arena em sua respectiva política interna. O Setto atua como facilitador tecnológico e não se responsabiliza por disputas de reembolso oriundas de desistência de Atletas fora dos prazos da Arena.
          </Li>
        </Ul>

        <SectionTitle>6. Tokenização de Cartão de Crédito</SectionTitle>
        <P>
          Quando o Atleta optar por salvar seu cartão de crédito para compras futuras no app, os dados do cartão não serão armazenados em nossos servidores.
          A tokenização é feita diretamente pelo Asaas, ficando armazenado no Setto apenas o token de autorização e dados parciais de visualização (ex.: últimos 4 dígitos).
        </P>

        <SectionTitle>7. Propriedade Intelectual</SectionTitle>
        <P>
          Todo o conteúdo, código-fonte, marcas, logotipos, interfaces e estrutura do Setto são de propriedade exclusiva de {COMPANY_NAME}.
          É proibida qualquer cópia, modificação, engenharia reversa ou reprodução não autorizada do sistema.
        </P>

        <SectionTitle>8. Limitação de Responsabilidade</SectionTitle>
        <P>
          O Setto empenha-se em manter a plataforma disponível de forma ininterrupta, contudo:
        </P>
        <Ul>
          <Li>Não se responsabiliza por instabilidades decorrentes de falhas em serviços de terceiros (ex.: instabilidade de internet, serviços de nuvem ou indisponibilidade pontual do gateway de pagamento/Pix).</Li>
          <Li>Não é responsável pelo estado físico das quadras, infraestrutura das arenas ou conduta de atletas e gestores nos locais esportivos.</Li>
        </Ul>

        <SectionTitle>9. Privacidade e Proteção de Dados</SectionTitle>
        <P>
          A coleta e o tratamento de dados pessoais são realizados conforme nossa{' '}
          <MuiLink href="/politica-de-privacidade">Política de Privacidade</MuiLink>, em estrita observância à Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
        </P>

        <SectionTitle>10. Modificações nos Termos de Uso</SectionTitle>
        <P>
          Estes Termos podem ser revisados periodicamente para refletir melhorias no sistema ou alterações legais.
          A continuação do uso do aplicativo após atualizações constitui aceitação tácita dos novos termos.
        </P>

        <SectionTitle>11. Foro e Legislação Aplicável</SectionTitle>
        <P>
          Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o Foro da Comarca de Siqueira Campos,
          Estado do Paraná, para dirimir eventuais controvérsias oriundas deste documento.
        </P>

        <SectionTitle>12. Contato e Suporte</SectionTitle>
        <P>
          Para dúvidas, sugestões ou suporte sobre estes Termos de Uso:
        </P>
        <Ul>
          <Li>E-mail: <MuiLink href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</MuiLink></Li>
          <Li>Razão Social / Responsável: {COMPANY_NAME}</Li>
          <Li>Cidade/UF: {COMPANY_ADDRESS}</Li>
        </Ul>

        <Divider sx={{ my: 4 }} />
        <Stack direction="row" justifyContent="center">
          <MuiLink href="/">Voltar para o início</MuiLink>
        </Stack>
      </Container>
    </Box>
  );
}