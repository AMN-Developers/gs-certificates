import { retrieveCertificateById } from '../action';
import CertificatePrintTemplate from '@/app/_components/templates/CertificatePrintTemplate';

export default async function CertificatePrint({
  params,
}: {
  params: { certificateId: string };
}) {
  const [data] = await retrieveCertificateById({
    certificateId: params.certificateId,
  });

  if (!data?.certificate) {
    return null;
  }

  return (
    <CertificatePrintTemplate
      certificate={data.certificate}
      certificateNumber={params.certificateId}
    />
  );
}
