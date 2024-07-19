'use client';

import Link from 'next/link';
import { useServerAction } from 'zsa-react';
import { Button } from '@components/ui/button';
import { useToast } from '@components/ui/use-toast';
import { logout } from '../action';
import { useRouter } from 'next/navigation';

export default function Certificates() {
  const router = useRouter();
  const { toast } = useToast();

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
      {/* TODO: This section needs to be responsive to */}
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Seus certificados G&S</h1>
          <Link
            href={`/certificados/novo`}
            className="text-brand hover:underline"
          >
            Emitir novo certificado
          </Link>
        </div>
        <div className="text-right font-medium">
          <div className="flex items-center justify-end gap-2">
            <h2 className="text-xl">Olá Cliente 0098342</h2>
            <Button
              className="text-brand hover:underline"
              variant="link"
              onClick={() => execute()}
            >
              Sair
            </Button>
          </div>
          <p>Seja bem-vindo ao seu painel de certificados digitais</p>
        </div>
      </div>
      <div>
        <p>Nenhum certificado encontrado.</p>
      </div>
    </section>
  );
}
