'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@components/ui/button';
import { Download } from 'lucide-react';
import logo from '@assets/logo.png';
import { generateCertificatePDF } from '@/app/certificados/[certificateId]/action';
import ShareButton from '@/app/_components/molecules/ShareButton';
import { Products } from '@/dtos/certificate';
import { CertificateType } from './DynamicTemplate';

type TCertificateTemplateProps = {
  certificate: {
    date: Date;
    clientName: string;
    companyName: string;
    technichalResponsible: string;
    product: Products;
    type: CertificateType;
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
  const { date, clientName, companyName, technichalResponsible, type } =
    certificate;

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      if (pdf) {
        const blob = new Blob([pdf as BlobPart], { type: 'image/png' });
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

  const getCertificateType = (type: CertificateType) => {
    if (type === 'impermeabilizacao') {
      return 'Impermeabilização';
    }
    return 'Higienização';
  };

  const getHeaderBackground = (type: CertificateType) => {
    if (type === 'impermeabilizacao') {
      return 'bg-gradient-to-r from-[#1a4b8c] via-[#2d6cb5] to-[#1a4b8c]';
    }
    return 'bg-gradient-to-r from-[#1a237e] via-[#3C43EA] to-[#1a237e]';
  };

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
            Baixar
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
      </div>

      {/* Certificate Preview */}
      <div className="relative w-full overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="w-full">
          <div ref={certificateRef} className="flex w-full flex-col bg-white">
            {/* Certificate Header */}
            <div
              className={`flex flex-col items-center gap-3 ${getHeaderBackground(type)} p-6 sm:p-8`}
            >
              <Image
                src={logo}
                alt="G&S Home Solutions Logo"
                width={80}
                height={80}
                className="w-auto"
                priority
              />
              <h1 className="text-center text-xl font-bold uppercase tracking-wide text-white md:text-2xl">
                Certificado de Garantia de {getCertificateType(type)} gerado com
                sucesso
              </h1>
              <p className="text-center font-medium text-white/90">
                Baixe no seu dispositivo ou compartilhe diretamente o
                certificado com seu cliente nos botões acima.
              </p>
            </div>

            {/* Certificate Footer */}
            <div className="flex flex-col justify-between gap-4 bg-gradient-to-br from-[#3b82c4] to-[#1e5a9e] p-6 text-white sm:p-8">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 border-b border-white/30 pb-1">
                  <span className="font-semibold">Cliente:</span>
                  <span>{clientName}</span>
                </div>
                <div className="flex items-center gap-2 border-b border-white/30 pb-1">
                  <span className="font-semibold">Data:</span>
                  <span>
                    {new Date(date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 border-b border-white/30 pb-1">
                  <span className="font-semibold">Empresa:</span>
                  <span>{companyName}</span>
                </div>
                <div className="flex items-center gap-2 border-b border-white/30 pb-1">
                  <span className="font-semibold">Técnico Aplicador:</span>
                  <span>{technichalResponsible}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
