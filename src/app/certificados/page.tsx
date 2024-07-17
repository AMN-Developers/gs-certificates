import Link from 'next/link';

export default function Certificates() {
  return (
    <section className="mx-auto flex h-full max-w-screen-xl flex-col gap-4 py-4">
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
            <Link href="/" className="text-brand hover:underline">
              Sair
            </Link>
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
