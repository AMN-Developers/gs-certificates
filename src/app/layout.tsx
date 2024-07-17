import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Header from '@components/organisms/Header';
import { cn } from '@lib/utils';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Certificados | G&S Home Soltions',
  description:
    'Gerador de certificados digitais para produtos G&S Home Solutions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={cn(
          'flex h-dvh flex-col font-sans antialiased',
          montserrat.variable,
        )}
      >
        <Header />
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
