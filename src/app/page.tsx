'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const mockLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/certificados');
  };

  return (
    <section className="mx-auto flex h-full max-w-screen-xl gap-4 py-4">
      <div className="min-h-full w-1/2 bg-slate-400">
        <div className="h-full w-full bg-brand p-4" />
      </div>
      <div className="flex min-h-full w-1/2 flex-col items-end gap-4">
        <h2 className="text-2xl font-semibold">
          Sistemas de Certificados Digitais G&S
        </h2>
        <form className="flex w-full flex-col gap-4" onSubmit={mockLogin}>
          <input
            className="h-10 w-full rounded-md border border-slate-500 px-4 py-2 text-end outline-none ring-brand [appearance:textfield] focus-within:ring-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="SEU CÓDIGO DO CLIENTE"
            type="number"
            required
          />
          <button
            type="submit"
            className="w-1/3 self-end rounded-md bg-brand px-4 py-2 text-white transition-all hover:bg-blue-950"
          >
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
}
