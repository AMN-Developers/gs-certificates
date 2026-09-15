'use client';

import Image from 'next/image';
import logo from '@assets/logo.svg';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@components/ui/button';
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  FileText,
  KeyRound,
  LogOut,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useServerActionQuery } from '@lib/hooks/server-action-hooks';
import { getSessionAccess } from '@/app/action';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover';

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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex h-auto items-center gap-2 px-2 py-1.5 text-white hover:bg-white/10"
                  aria-label="Abrir informações da conta administrativa"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                    <UserRound className="h-4 w-4" />
                  </span>
                  <span className="hidden max-w-28 truncate text-sm font-semibold sm:block">
                    {sessionAccess.adminUsername || 'Conta'}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-80" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                      <UserRound className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {sessionAccess.adminUsername || 'Administrador'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {sessionAccess.adminRole === 'owner'
                          ? 'Proprietário do sistema'
                          : 'Administrador do sistema'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 px-5 py-4 text-sm">
                  <div className="flex items-start gap-3 text-slate-600">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-medium text-slate-800">
                        Sessão protegida
                      </p>
                      <p className="text-xs leading-5 text-slate-500">
                        Este acesso é separado dos usuários clientes.
                      </p>
                    </div>
                  </div>
                  <Link href="/dashboard/account" className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex w-full items-center justify-center gap-2"
                    >
                      <KeyRound className="h-4 w-4" />
                      Redefinir minha senha
                    </Button>
                  </Link>
                </div>
                <div className="border-t border-slate-100 p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoggingOut}
                    onClick={logoutAdmin}
                    className="flex w-full items-center justify-center gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? 'Saindo…' : 'Sair do painel'}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </nav>
        )}
      </div>
    </header>
  );
}
