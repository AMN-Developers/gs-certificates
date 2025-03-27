import { Products } from '@/dtos/certificate';
import CertificateImpersPrintTemplate from './CertificateImpersPrintTemplate';
import CertificatePrintTemplate from './CertificatePrintTemplate';

const Templates = {
  higienizacao: CertificatePrintTemplate,
  impermeabilizacao: CertificateImpersPrintTemplate,
};

export type CertificateType = keyof typeof Templates;

interface DynamicTemplateProps {
  certificate: {
    date: Date;
    clientName: string;
    companyName: string;
    technichalResponsible: string;
    product: Products;
  };
  certificateNumber: string;
  type: CertificateType;
}

export default function DynamicTemplate({
  type,
  certificate,
  certificateNumber,
}: DynamicTemplateProps) {
  const TemplateComponent = Templates[type];

  if (!TemplateComponent) {
    return <div>Template not found for type: {type}</div>;
  }

  return (
    <TemplateComponent
      certificate={certificate}
      certificateNumber={certificateNumber}
      key={type}
    />
  );
}
