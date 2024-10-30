'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Button } from '@components/ui/button';
import logo from '@assets/logo.png';
import qrVegan from '@assets/qrVegan.png';
import astm from '@assets/astm.png';

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
      const pdf = new jsPDF('p', 'px', 'a4');

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
      const pdf = new jsPDF('p', 'px', 'a4');
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
      <section className="flex w-full flex-col gap-4 rounded-md bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#3C43EA] to-[#101242] px-4 py-2 text-white lg:w-2/3">
        <div className="flex flex-col">
          <div className="mb-4 flex flex-col items-center gap-4">
            <Image
              src={logo}
              alt="G&S Home Solutions Image Logo"
              className="w-[4rem] max-w-[6.25rem] sm:w-[5rem]"
              draggable={false}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, 768px"
            />
            <div className="my-auto flex w-full justify-center text-center text-lg font-extrabold sm:text-xl md:text-2xl">
              <h1 className="text-center">
                Certificado de Garantia de Higienização
              </h1>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="mt-2 flex w-1/2 flex-col gap-2 text-justify text-[8px] font-semibold sm:text-lg">
              <p>
                Certificamos que a superfície foi higienizada com o Power Trio
                da G&S Home Solutions.
              </p>
              <p>
                Esta higienização garante que a superfície têxtil esteja livres
                de bactérias, conforme testes realizados seguindo a normas
                têxteis internacionais método ASTM E2419-13.
              </p>
              <p>
                Todos os produtos componentes do Power Trio G&S, que são eles:
                Lótus All-01 , Lótus Tira-Manchas e Lótus Pré-Imper, são
                produtos notificados pela ANVISA, garantindo a sua segurança e
                conformidade quanto a sua função.
              </p>
              <Image
                src={astm}
                alt="qr Code"
                className="mt-4 w-[4.25rem] max-w-[6.25rem] self-center sm:w-[6rem]"
                draggable={false}
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, 768px"
              />
            </div>
            <div className="mt-2 flex h-fit w-1/2 flex-col gap-4 rounded-lg bg-shades-wave bg-cover bg-no-repeat px-4 py-2 text-justify text-[8px] font-semibold sm:text-lg">
              <p>
                Certificamos também, que os produtos são homologados pela SVB
                (Sociedade Vegana Brasileira). Cuidamos da saúde do seu lar, sem
                agredir o meio ambiente e respeitando a vida dos animais.
              </p>
              <div className="flex flex-col items-center justify-center gap-2">
                <Image
                  src={qrVegan}
                  alt="Selo vegano"
                  className="w-[3rem] max-w-[6.25rem] sm:w-[6rem]"
                  draggable={false}
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, 768px"
                />
                <p className="px-4 py-2 text-center text-[5px] italic sm:text-xs">
                  Esta é uma parcela de cuidado com o nosso planeta que você nos
                  ajudou a garantir, juntos iremos transformar o mundo em um
                  lugar mais limpo e sustentável.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex py-2">
          <div className="flex w-1/2 flex-col gap-2 text-[8px] font-semibold sm:text-xs">
            <p className="w-full leading-none">Cliente: {clientName}</p>
            <p className="w-full leading-none">
              Data:{' '}
              {new Date(date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p className="w-full leading-none">Empresa: {companyName}</p>
            <p className="w-full leading-none">
              Técnico Aplicador: {technichalResponsible}
            </p>
          </div>
          <div className="w flex w-1/2 flex-row items-end justify-end overflow-y-auto">
            <p className="text-right text-[0.2rem] sm:text-[0.5rem]">
              CERTIFICADO-{certificateNumber}
            </p>
          </div>
        </div>
      </section>
      {isModalOpen && (
        <section
          className="flex w-full flex-col gap-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#3C43EA] to-[#101242] px-4 py-2 text-white lg:w-2/3"
          ref={certificateRef}
          className="flex flex-col gap-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#3C43EA] to-[#101242] px-14 py-12 text-white"
          style={{
            width: '210mm', // Largura A4
            height: '297mm', // Altura A4
          }}
        >
          <div className="flex flex-col">
            <div className="mb-4 flex flex-col items-center gap-4">
              <Image
                src={logo}
                alt="G&S Home Solutions Image Logo"
                className="mb-3 h-[120px] w-[100px]"
                draggable={false}
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, 768px"
              />
              <div className="mx-10 my-auto mb-5 flex w-full justify-center text-center text-[35px] font-semibold">
                <h1 className="text-center">
                  Certificado de Garantia de Higienização
                </h1>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="mt-2 flex w-1/2 flex-col gap-2 text-justify text-[16px] font-semibold">
                <p>
                  Certificamos que a superfície foi higienizada com o Power Trio
                  da G&S Home Solutions.
                </p>
                <p>
                  Esta higienização garante que a superfície têxtil esteja livre
                  de bactérias, conforme testes realizados seguindo as normas
                  têxteis internacionais método ASTM E2419-13.
                </p>
                <p>
                  Todos os produtos componentes do Power Trio G&S, que são eles:
                  Lótus All-01, Lótus Tira-Manchas e Lótus Pré-Imper, são
                  produtos notificados pela ANVISA, garantindo a sua segurança e
                  conformidade quanto a sua função.
                </p>
                <Image
                  src={astm}
                  alt="qr Code"
                  className="mt-4 h-[120px] w-[120px] self-center"
                  draggable={false}
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, 768px"
                />
              </div>
              <div className="mt-2 flex h-fit w-1/2 flex-col gap-4 rounded-lg bg-shades-wave bg-cover bg-no-repeat px-4 py-2 text-justify text-[16px] font-semibold">
                <p>
                  Certificamos também que os produtos são homologados pela SVB
                  (Sociedade Vegana Brasileira). Cuidamos da saúde do seu lar,
                  sem agredir o meio ambiente e respeitando a vida dos animais.
                </p>
                <div className="flex flex-col items-center justify-center gap-2">
                  <Image
                    src={qrVegan}
                    alt="Selo vegano"
                    className="mt-4 h-[70px] w-[90px] self-center"
                    draggable={false}
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, 768px"
                  />
                  <p className="px-4 py-2 text-center text-[10px] italic">
                    Esta é uma parcela de cuidado com o nosso planeta que você
                    nos ajudou a garantir, juntos iremos transformar o mundo em
                    um lugar mais limpo e sustentável.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex py-2">
            <div className="flex w-1/2 flex-col gap-2 text-[14px] font-semibold">
              <p className="w-full leading-none">Cliente: {clientName}</p>
              <p className="w-full leading-none">
                Data:{' '}
                {new Date(date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className="w-full leading-none">Empresa: {companyName}</p>
              <p className="w-full leading-none">
                Técnico Aplicador: {technichalResponsible}
              </p>
            </div>
            <div className="flex w-1/2 flex-row items-end justify-end overflow-y-auto">
              <p className="p-2 text-right text-[10px]">
                CERTIFICADO-{certificateNumber}
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
