import type { Metadata } from 'next';
import '@pigment-css/react/styles.css';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Setto Arenas',
  description: 'Sua plataforma de esportes de arena. Gerencie reservas, pagamentos e muito mais.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
