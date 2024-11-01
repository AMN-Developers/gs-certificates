'use client';

import CreateCertificateForm from '@components/organisms/CreateCertificateForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewCertificate() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-screen-xl flex-col gap-6 px-4 py-8 xl:px-0">
      {/* Header Section */}
      <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-4">
            <Link
              href="/certificados"
              className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para certificados
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Emitir novo certificado
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Preencha os dados abaixo para emitir um novo certificado
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <CreateCertificateForm />
      </div>
    </section>
  );
}
