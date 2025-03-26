'use client';

import { useServerAction } from 'zsa-react';
import { Button } from '@components/ui/button';
import { useToast } from '@components/ui/use-toast';
import { Skeleton } from '@components/ui/skeleton';
import { logout } from '../action';
import { useServerActionQuery } from '@lib/hooks/server-action-hooks';
import { useRouter } from 'next/navigation';
import { getUser } from './action';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default function Certificates() {
  const router = useRouter();
  const { toast } = useToast();

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
            <Skeleton className="h-10 w-32" />
          ) : (
            <>
              <span className="text-sm font-medium text-gray-600">
                Cliente {data?.id}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => execute()}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
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
            {(data?.certificateTokens?.length ?? 0 > 0) ? (
              data?.certificateTokens.map((token) => (
                <div
                  key={token.type}
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-brand to-[#1a237e] p-6 shadow-lg transition-all hover:shadow-xl"
                >
                  <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold uppercase text-white">
                        {token.type}
                      </h3>
                      <p className="mt-2 text-white/90">
                        {token.balance} certificados disponíveis
                      </p>
                    </div>

                    <Link
                      href={`/certificados/novo?token=${token.type}`}
                      className="inline-flex w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-brand shadow-sm transition-colors hover:bg-gray-50"
                    >
                      Emitir certificado
                    </Link>
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
    </section>
  );
}
