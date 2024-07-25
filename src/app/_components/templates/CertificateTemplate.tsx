'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Button } from '@components/ui/button';
import logo from '@assets/logoBlack.png';

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { date, clientName, companyName, technichalResponsible } = certificate;

  const webShareSupported = 'canShare' in navigator;

  const shareOrDownload = async () => {
    setIsModalOpen((prev) => !prev);

    do {
      await new Promise((resolve) => setTimeout(resolve, 100));
    } while (!certificateRef.current);

    if (!certificateRef.current) {
      return;
    }

    if (webShareSupported) {
      const pdf = new jsPDF('l', 'px', 'a4');

      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
      });

      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      const pdfBlob = pdf.output('blob');

      const file = new File([pdfBlob], `${clientName}.pdf`, {
        type: 'application/pdf',
      });

      setIsModalOpen((prev) => !prev);

      await navigator.share({
        title: 'Certificado de Garantia de Higienização',
        text: `Certificado de Garantia de Higienização para ${clientName}`,
        url: `{window.location.origin}/certificado/${certificateNumber}`,
        files: [file],
      });
    } else {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'px', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`${clientName}.pdf`);
    }
  };

  return (
    <>
      <Button onClick={shareOrDownload} className="max-w-fit">
        Compartilhar PDF
      </Button>
      <Button className="max-w-fit">Salvar PDF</Button>
      <p className="text-center text-sm font-bold text-red-500">
        A pré-visualização do certificado é comprometida em dispositivos móveis,
        o que não afeta a qualidade final do mesmo.
      </p>
      <section
        ref={certificateRef}
        className="flex flex-col gap-4 border-[6px] border-blue-950 bg-pattern-waves bg-cover bg-center bg-no-repeat px-14 py-8"
      >
        <div className="flex flex-col">
          <div className="flex">
            <Image
              src={logo}
              alt="G&S Home Solutions Image Logo"
              className="max-w-[6.25rem]"
              draggable={false}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, 768px"
            />
            <div className="my-auto flex w-full justify-center text-center text-2xl font-semibold">
              <h1 className="text-center">
                Certificado de Garantia de Higienização
              </h1>
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-8 text-lg font-semibold">
            <p>
              Certificamos que a superfície foi higienizada com o Power Trio da
              G&S Home Solutions. Esta higienização garante que a superfície
              têxtil esteja livres de bactérias, conforme testes realizados
              seguindo a normas têxteis internacionais método ASTM E2419-13.
            </p>
            <p>
              Todos os produtos componentes do Power Trio G&S, que são eles :
              Lótus All-01 , Lótus Tira-Manchas e Lótus Pré-Imper, são produtos
              notificados pela ANVISA, garantindo a sua segurança e conformidade
              quanto a sua função.
            </p>
            <p>
              Certificamos também, que os produtos são homologados pela SVB
              (Sociedade Vegana Brasileira). Cuidamos da saúde do seu lar, sem
              agredir o meio ambiente e respeitando a vida dos animais.
            </p>
            <p>
              Esta é uma parcela de cuidado com o nosso planeta que você nos
              ajudou a garantir, juntos iremos transformar o mundo em um lugar
              mais limpo e sustentável.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between lg:flex-row">
          <div className="flex w-full flex-row justify-between pt-14 text-lg lg:w-1/2">
            <div className="w-full space-y-4 font-bold">
              <p className="w-full bg-black/10 px-4 pb-4 leading-none">
                Cliente: {clientName}
              </p>
              <p className="w-full bg-black/10 px-4 pb-4 leading-none">
                Data:{' '}
                {new Date(date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className="w-full bg-black/10 px-4 pb-4 leading-none">
                Empresa: {companyName}
              </p>
              <p className="w-full bg-black/10 px-4 pb-4 leading-none">
                Técnico Aplicador: {technichalResponsible}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-sm font-bold">{certificateNumber}</p>
          </div>
        </div>
      </section>
      {isModalOpen && (
        <section
          ref={certificateRef}
          className="flex min-h-[794px] min-w-[1123px] flex-col gap-4 border-[6px] border-blue-950 bg-pattern-waves bg-cover bg-center bg-no-repeat px-14 py-8"
        >
          <div className="flex flex-col">
            <div className="flex">
              <Image
                src={logo}
                alt="G&S Home Solutions Image Logo"
                className="max-w-[6.25rem]"
                draggable={false}
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, 768px"
              />
              <div className="my-auto flex w-full justify-center text-center text-2xl font-semibold">
                <h1>Certificado de Garantia de Higienização</h1>
              </div>
            </div>
            <div className="flex flex-col gap-4 pt-8 text-lg font-semibold">
              <p>
                Certificamos que a superfície foi higienizada com o Power Trio
                da G&S Home Solutions. Esta higienização garante que a
                superfície têxtil esteja livres de bactérias, conforme testes
                realizados seguindo a normas têxteis internacionais método ASTM
                E2419-13.
              </p>
              <p>
                Todos os produtos componentes do Power Trio G&S, que são eles :
                Lótus All-01 , Lótus Tira-Manchas e Lótus Pré-Imper, são
                produtos notificados pela ANVISA, garantindo a sua segurança e
                conformidade quanto a sua função.
              </p>
              <p>
                Certificamos também, que os produtos são homologados pela SVB
                (Sociedade Vegana Brasileira). Cuidamos da saúde do seu lar, sem
                agredir o meio ambiente e respeitando a vida dos animais.
              </p>
              <p>
                Esta é uma parcela de cuidado com o nosso planeta que você nos
                ajudou a garantir, juntos iremos transformar o mundo em um lugar
                mais limpo e sustentável.
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="flex w-1/2 flex-row justify-between pt-14 text-lg">
              <div className="w-full space-y-4 font-bold">
                <p className="w-full bg-black/10 px-4 pb-4 leading-none">
                  Cliente: {clientName}
                </p>
                <p className="w-full bg-black/10 px-4 pb-4 leading-none">
                  Data:{' '}
                  {new Date(date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="w-full bg-black/10 px-4 pb-4 leading-none">
                  Empresa: {companyName}
                </p>
                <p className="w-full bg-black/10 px-4 pb-4 leading-none">
                  Técnico Aplicador: {technichalResponsible}
                </p>
              </div>
            </div>
            <div className="flex max-w-prose flex-row justify-between">
              <p className="text-sm font-bold">{certificateNumber}</p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
