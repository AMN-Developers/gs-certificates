'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@components/ui/button';
import { Download } from 'lucide-react';
import logo from '@assets/logo.png';
import qrVegan from '@assets/qrVegan.png';
import astm from '@assets/astm.png';
import { generateCertificatePDF } from '@/app/certificados/[certificateId]/action';
import ShareButton from '@/app/_components/molecules/ShareButton';

type TCertificateTemplateProps = {
  certificate: {
    date: Date;
    clientName: string;
    companyName: string;
    technichalResponsible: string;
  };
  certificateNumber: string;
};

export default function CertificateTemplate({
  certificate,
  certificateNumber,
}: TCertificateTemplateProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdf, setPdf] = useState<Uint8Array | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { date, clientName, companyName, technichalResponsible } = certificate;

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      if (pdf) {
        const blob = new Blob([pdf], { type: 'image/png' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${clientName}-certificado.png`;
        link.click();
        return;
      }
      const [data, error] = await generateCertificatePDF({
        certificateId: certificateNumber,
      });

      if (error || !data) {
        console.error('Error generating PDF:', error);
        return;
      }
      const uint8Array = new Uint8Array(data.pdf);
      setPdf(uint8Array);
      const blob = new Blob([uint8Array], { type: 'immage/png' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${clientName}-certificado.png`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    async function generatePDF() {
      try {
        setIsGenerating(true);

        const [data, error] = await generateCertificatePDF({
          certificateId: certificateNumber,
        });

        if (error || !data) {
          console.error('Error generating PDF:', error);
          return;
        }
        const uint8Array = new Uint8Array(data.pdf);
        setPdf(uint8Array);
      } catch (error) {
        console.error('Error while generating pdf:', error);
      } finally {
        setIsGenerating(false);
      }
    }

    if (!pdf) {
      generatePDF();
    }
  }, [certificateNumber, pdf]);

  return (
    <>
      {/* Actions Section */}
      <div className="mb-8 space-y-6">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-end">
          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            size="sm"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Baixar PDF
          </Button>
          <ShareButton
            clientName={clientName}
            certificateId={certificateNumber}
            setPdf={setPdf}
            pdf={pdf}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        </div>

        <div className="rounded-lg bg-gray-50 px-4 py-3">
          <p className="text-center text-sm font-medium text-gray-600">
            A pré-visualização do certificado pode variar em dispositivos
            móveis, mas não afeta a qualidade final do PDF.
          </p>
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="relative w-full overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="aspect-[1.4/1] w-full">
          <div
            ref={certificateRef}
            className="flex min-h-[595px] w-full flex-col gap-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#3C43EA] to-[#101242] p-8 text-white sm:p-12"
          >
            {/* Certificate Header */}
            <div className="flex flex-col items-center gap-3">
              <Image
                src={logo}
                alt="G&S Home Solutions Logo"
                width={70}
                height={70}
                className="w-auto"
                priority
              />
              <h1 className="text-center text-3xl font-bold">
                Certificado de Garantia de Higienização
              </h1>
            </div>

            {/* Certificate Content */}
            <div className="grid flex-1 grid-cols-2 gap-6 text-base">
              <div className="flex flex-col items-center gap-3 p-5">
                <p>
                  Certificamos que a superfície foi higienizada com o Power Trio
                  da G&S Home Solutions.
                </p>
                <p>
                  Esta higienização garante que a superfície têxtil esteja livre
                  de bactérias, conforme testes realizados seguindo as normas
                  têxteis internacionais método ASTM E2149-13.
                </p>
                <p>
                  Todos os produtos componentes do Power Trio G&S são
                  notificados pela ANVISA, garantindo sua segurança e
                  conformidade.
                </p>
                <Image
                  src={astm}
                  alt="ASTM Certification"
                  width={100}
                  height={100}
                  className=""
                  priority
                />
              </div>

              <div className="flex flex-col justify-between gap-3 rounded-lg bg-shades-wave bg-cover bg-no-repeat p-5">
                <p>
                  Certificamos também que os produtos são homologados pela SVB
                  (Sociedade Vegana Brasileira). Cuidamos da saúde do seu lar,
                  sem agredir o meio ambiente e respeitando a vida dos animais.
                </p>
                <div className="flex flex-col items-center gap-3">
                  <Image
                    src={qrVegan}
                    alt="Selo Vegano"
                    width={100}
                    height={100}
                    className="w-auto"
                    priority
                  />
                </div>
                <p className="text-center text-xs italic">
                  Esta é uma parcela de cuidado com o nosso planeta que você nos
                  ajudou a garantir.
                </p>
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="flex justify-between gap-4 border-t border-white/20 pt-3">
              <div className="flex flex-col gap-1 text-sm">
                <p>Cliente: {clientName}</p>
                <p>
                  Data:{' '}
                  {new Date(date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p>Empresa: {companyName}</p>
                <p>Técnico Aplicador: {technichalResponsible}</p>
              </div>
              <div className="text-right text-xs">
                CERTIFICADO-{certificateNumber}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
