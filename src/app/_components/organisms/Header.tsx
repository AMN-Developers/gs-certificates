'use client';

import Image from 'next/image';
import logo from '@assets/logo.svg';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@components/ui/button';
import { BarChart3, BookOpen, FileText, KeyRound, LogOut } from 'lucide-react';
import { useServerActionQuery } from '@lib/hooks/server-action-hooks';
import { getSessionAccess } from '@/app/action';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isAdminArea = pathname.startsWith('/dashboard');
  const isClientArea = pathname.startsWith('/certificados');
  const { data: sessionAccess } = useServerActionQuery(getSessionAccess, {
    input: undefined,
    queryKey: ['getSessionAccess'],
  });

  async function logoutAdmin() {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/admin/session', { method: 'DELETE' });
      if (!response.ok) throw new Error('Não foi possível encerrar a sessão.');
      router.replace('/admin');
      router.refresh();
    } catch (error) {
      console.error(error);
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="via-[#18183b]/93 h-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand to-[#181a3d] p-4">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        <Link href={isAdminArea ? '/dashboard' : '/'} prefetch={false}>
          <Image
            src={logo}
            alt="G&S Home Solutions Image Logo"
            className="max-w-[6.25rem]"
            draggable={false}
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, 768px"
          />
        </Link>

        {isClientArea && (
          <nav className="flex items-center gap-2">
            <Link href="/certificados">
              <Button
                variant={pathname === '/certificados' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center gap-2 text-white hover:bg-white/10"
              >
                <FileText className="h-4 w-4" />
                Certificados
              </Button>
            </Link>
          </nav>
        )}

        {isAdminArea && sessionAccess?.isAdmin && (
          <nav className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button
                variant={pathname === '/dashboard' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center gap-2 text-white hover:bg-white/10"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/docs">
              <Button
                variant={pathname === '/dashboard/docs' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center gap-2 text-white hover:bg-white/10"
              >
                <BookOpen className="h-4 w-4" />
                Docs
              </Button>
            </Link>
            <Link href="/dashboard/account">
              <Button
                variant={
                  pathname === '/dashboard/account' ? 'default' : 'ghost'
                }
                size="sm"
                className="flex items-center gap-2 text-white hover:bg-white/10"
              >
                <KeyRound className="h-4 w-4" />
                Minha senha
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              disabled={isLoggingOut}
              onClick={logoutAdmin}
              className="flex items-center gap-2 text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? 'Saindo…' : 'Sair'}
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
