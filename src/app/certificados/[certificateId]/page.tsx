import Image from 'next/image';
import { retrieveCertificateById } from './action';

import logo from '@assets/logoBlack.png';
import { Button } from '@/app/_components/ui/button';

export default async function Certificate({
  params,
}: {
  params: { certificateId: string };
}) {
  const [data] = await retrieveCertificateById({
    certificateId: params.certificateId,
  });

  if (!data?.certificate) {
    return;
  }

  return (
    <section className="mx-auto flex h-full max-w-screen-xl flex-col gap-4 px-4 py-4 xl:px-0">
      <section className="flex flex-col gap-4 rounded-md border-[6px] border-blue-950 p-4">
        <div className="flex">
          <Image
            src={logo}
            alt="G&S Home Solutions Image Logo"
            className="max-w-[6.25rem]"
            draggable={false}
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, 768px"
          />
          <div className="my-auto flex w-full justify-between text-right font-semibold sm:justify-center sm:text-center md:mr-[100px] md:text-2xl">
            <h1>Certificado de Garantia de Higienização</h1>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-xs font-semibold sm:text-sm md:text-lg">
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

        <div className="flex flex-col justify-between gap-4 text-xs md:flex-row md:text-lg">
          <div className="rounded-md border border-slate-400 bg-slate-200 px-2">
            <p>Cliente: {data.certificate?.clientName}</p>
            <p>Data: {new Date(data.certificate?.date).toLocaleDateString()}</p>
            <p>Empresa: {data.certificate?.companyName}</p>
            <p>
              Responsável técnico: {data.certificate?.technichalResponsible}
            </p>
          </div>
          <div className="content-end break-words">
            <p>
              Certificate - ${params.certificateId}
              {/* TODO: replace with actual domain name in production environment */}
            </p>
          </div>
        </div>
      </section>
      <div className="flex justify-end gap-2">
        <Button>Imprimir</Button>
        <Button>Enviar</Button>
      </div>
    </section>
  );
}
