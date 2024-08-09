import { Metadata, ResolvingMetadata } from 'next';

import { retrieveCertificateById } from './action';
import dynamic from 'next/dynamic';
const CertificateTemplate = dynamic(
  () => import('@/app/_components/templates/CertificateTemplate'),
  { ssr: false },
);

export async function generateMetadata(
  {
    params,
  }: {
    params: { certificateId: string };
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [data] = await retrieveCertificateById({
    certificateId: params.certificateId,
  });

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Certificado de Higienização G&S | ${data?.certificate?.clientName}`,
    description: `Certificado de Higienização G&S para ${data?.certificate?.clientName}`,
    openGraph: {
      images: [...previousImages],
    },
  };
}

export default async function Certificate({
  params,
}: {
  params: { certificateId: string };
}) {
  const [data] = await retrieveCertificateById({
    certificateId: params.certificateId,
  });

  if (!data?.certificate) {
    return (
      <section className="mx-auto flex h-full max-w-screen-xl flex-col gap-4 overflow-x-hidden px-4 py-4 xl:px-0">
        <h1 className="text-center text-2xl font-bold">
          Certificado não encontrado
        </h1>
      </section>
    );
  }

  return (
    <section className="mx-auto flex h-full max-w-screen-xl flex-col gap-4 overflow-x-hidden px-4 py-4 xl:px-0">
      <CertificateTemplate
        certificate={data.certificate}
        certificateNumber={params.certificateId}
      />
    </section>
  );
}
