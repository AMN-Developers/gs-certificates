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
    <section className="mx-auto flex h-full max-w-screen-xl flex-col gap-4 px-4 py-4 xl:px-0">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">
            Emissão de certificados G&S
          </h1>
        </div>
        <div className="text-right font-medium">
          {isLoading ? (
            <Skeleton className="h-full w-full bg-brand/10" />
          ) : (
            <div className="flex items-center justify-end gap-2 leading-7">
              <h2 className="text-xl">Olá Cliente {data?.id}</h2>
              <Button
                className="m-0 h-auto p-0 text-brand hover:underline"
                variant="link"
                onClick={() => execute()}
              >
                Sair
              </Button>
            </div>
          )}
          <p>Seja bem-vindo ao seu painel de certificados digitais</p>
        </div>
      </div>
      <div>
        {isLoading ? (
          <div className="space-y-4 pt-4">
            <Skeleton className="h-24 w-full bg-brand/10" />
          </div>
        ) : (
          <div>
            {data?.certificateTokens ? (
              Object.entries(data.certificateTokens).map(([key, value]) => (
                <div
                  key={key}
                  className="flex h-24 justify-between rounded bg-brand p-4"
                >
                  <div>
                    <h3 className="font-bold uppercase text-white">{key}</h3>
                    <p className="text-white underline">
                      {value} certificados disponíveis.
                    </p>
                  </div>
                  <Link
                    href={`/certificados/novo?token=${key}`}
                    className="flex items-center rounded border border-white px-4 py-2 text-white transition-all duration-500 hover:bg-white hover:text-brand"
                  >
                    Emitir certificado
                  </Link>
                </div>
              ))
            ) : (
              <div>Você não possui nenhum token de certificado</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
