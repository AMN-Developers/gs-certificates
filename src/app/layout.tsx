import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Header from '@components/organisms/Header';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'] });

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
      <body className={montserrat.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}