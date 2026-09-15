'use client';

import { useServerAction } from 'zsa-react';
import { Button } from '@components/ui/button';
import { useToast } from '@components/ui/use-toast';
import { Skeleton } from '@components/ui/skeleton';
import { logout } from '../action';
import { useServerActionQuery } from '@lib/hooks/server-action-hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getUser } from './action';
import { ChevronDown, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { OperationLoadingOverlay } from '@components/ui/operation-loading-overlay';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover';

export default function Certificates() {
  const router = useRouter();
  const { toast } = useToast();
  const [openingType, setOpeningType] = useState<string | null>(null);

  const { isLoading, data } = useServerActionQuery(getUser, {
    input: undefined,
    queryKey: ['getUser'],
  });

  const { execute } = useServerAction(logout, {
    onSuccess: () => {
      toast({
        title: 'Usuário deslogado com sucesso',
        description: `O usuário foi deslogado com sucesso!`,
      });
      router.push('/');
    },
    onError: ({ err }) => {
      toast({
        title: 'Erro ao deslogar',
        description: err.message,
      });
    },
  });

  function openCertificateForm(type: string) {
    setOpeningType(type);
    window.requestAnimationFrame(() => {
      router.push('/certificados/novo?token=' + encodeURIComponent(type));
    });
  }

  const displayedTokens = Object.values(
    (data?.certificateTokens ?? []).reduce<
      Record<string, { type: string; balance: number }>
    >((tokens, token) => {
      if (token.type !== 'higienizacao' && token.type !== 'impermeabilizacao') {
        return tokens;
      }

      const current = tokens[token.type];
      tokens[token.type] = {
        type: token.type,
        balance: (current?.balance ?? 0) + token.balance,
      };
      return tokens;
    }, {}),
  );

  return (
    <section className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-screen-xl flex-col gap-6 px-4 py-8 xl:px-0">
      {/* Header Section */}
      <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Emissão de certificados G&S
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Seja bem-vindo ao seu painel de certificados digitais
          </p>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <Skeleton className="h-11 w-44" />
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto gap-3 border-slate-200 bg-white px-3 py-2 text-left shadow-sm hover:bg-slate-50"
                  aria-label="Abrir informações da conta"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <span className="hidden min-w-0 sm:block">
                    <span className="block text-xs font-medium text-slate-500">
                      Bem-vindo,
                    </span>
                    <span className="block max-w-36 truncate text-sm font-semibold text-slate-800">
                      Cliente {data?.id}
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                      <UserRound className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        Cliente {data?.id}
                      </p>
                      <p className="text-xs text-slate-500">
                        Painel de certificados G&S
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 px-5 py-4 text-sm">
                  <div className="flex items-start gap-3 text-slate-600">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-medium text-slate-800">Sessão ativa</p>
                      <p className="text-xs leading-5 text-slate-500">
                        Acesso autenticado pelo seu código de cliente.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
                    Código do cliente:{' '}
                    <span className="font-semibold text-slate-700">
                      {data?.id}
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-100 p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => execute()}
                    className="flex w-full items-center justify-center gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair do painel
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid gap-6">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-lg bg-brand/10" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedTokens.length > 0 ? (
              displayedTokens.map((token) => (
                <div
                  key={token.type}
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-brand to-[#1a237e] p-6 shadow-lg transition-all hover:shadow-xl"
                >
                  <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold uppercase text-white">
                        {token.type === 'higienizacao'
                          ? 'Higienização'
                          : 'Impermeabilização'}
                      </h3>
                      <p className="mt-2 text-white/90">
                        {token.balance} certificados disponíveis
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openCertificateForm(token.type)}
                      disabled={!!openingType}
                      className="inline-flex w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-brand shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-wait disabled:opacity-70"
                    >
                      Emitir certificado
                    </button>
                  </div>

                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 z-0 bg-pattern-waves bg-cover bg-center opacity-10" />
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center text-sm text-yellow-800">
                Você não possui nenhum token de certificado disponível
              </div>
            )}
          </div>
        )}
      </div>
      {openingType && (
        <OperationLoadingOverlay
          title="Abrindo formulário"
          description="Estamos preparando os dados para a emissão. Aguarde alguns segundos."
        />
      )}
    </section>
  );
}
