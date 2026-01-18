import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import logo from '@assets/logo.png';
import qrVegan from '@assets/qrVegan.png';
import astm from '@assets/astm.png';

type TCertificatePrintTemplateProps = {
  certificate: {
    date: Date;
    clientName: string;
    companyName: string;
    technichalResponsible: string;
  };
  certificateNumber: string;
};

const montserrat = Montserrat({ subsets: ['latin'] });

export default function CertificatePrintTemplate({
  certificate,
  certificateNumber,
}: TCertificatePrintTemplateProps) {
  const { date, clientName, companyName, technichalResponsible } = certificate;

  return (
    <div
      className={`fixed inset-0 flex min-h-screen flex-col bg-white ${montserrat.className}`}
    >
      {/* Header */}
      <div className="flex flex-col items-center bg-gradient-to-r from-[#1a237e] via-[#3C43EA] to-[#1a237e] py-4">
        <Image
          src={logo}
          alt="G&S Home Solutions Logo"
          width={80}
          height={80}
          priority
        />
        <h1 className="mt-2 text-xl font-bold uppercase tracking-wide text-white">
          Certificado de Garantia de Higienização
        </h1>
      </div>

      {/* Content */}
      <div className="grid flex-1 grid-cols-2 gap-4 p-4 text-[0.6rem]">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          {/* Certificação */}
          <section className="rounded-lg bg-gradient-to-br from-[#3C43EA] to-[#1a237e] p-4 text-white">
            <h2 className="mb-2 text-center text-sm font-bold uppercase">
              Certificação de Higienização
            </h2>
            <p className="text-justify leading-relaxed">
              Certificamos que a superfície foi higienizada com o Power Trio da
              G&S Home Solutions.
            </p>
            <p className="mt-2 text-justify leading-relaxed">
              Esta higienização garante que a superfície têxtil esteja livre de
              bactérias, conforme testes realizados seguindo as normas têxteis
              internacionais método ASTM E2149-13.
            </p>
            <p className="mt-2 text-justify leading-relaxed">
              Todos os produtos componentes do Power Trio G&S são notificados
              pela ANVISA, garantindo sua segurança e conformidade.
            </p>
            <div className="mt-3 flex justify-center">
              <Image
                src={astm}
                alt="ASTM Certification"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </div>
          </section>

          {/* Selo Vegano */}
          <section className="flex-1 rounded-lg bg-gradient-to-br from-[#3C43EA] to-[#1a237e] p-4 text-white">
            <p className="text-justify leading-relaxed">
              Certificamos também que os produtos são homologados pela SVB
              (Sociedade Vegana Brasileira). Cuidamos da saúde do seu lar, sem
              agredir o meio ambiente e respeitando a vida dos animais.
            </p>
            <div className="mt-3 flex flex-col items-center gap-2">
              <Image
                src={qrVegan}
                alt="Selo Vegano"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </div>
            <p className="mt-2 text-center text-[0.5rem] italic text-white/80">
              Esta é uma parcela de cuidado com o nosso planeta que você nos
              ajudou a garantir.
            </p>
          </section>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Garantia */}
          <section className="rounded-lg bg-gradient-to-br from-[#3C43EA] to-[#1a237e] p-4 text-white">
            <h2 className="mb-2 text-sm font-bold">Garantia</h2>
            <p className="text-justify leading-relaxed">
              A higienização com produtos Power Trio G&S possui garantia de
              eficácia bactericida conforme testes realizados seguindo as normas
              têxteis internacionais método ASTM E2149-13.
            </p>
            <p className="mt-2 text-justify leading-relaxed">
              A durabilidade da proteção depende do uso e das condições de
              manutenção do ambiente. Recomendamos higienização periódica para
              manter a eficácia da proteção.
            </p>
          </section>

          {/* Responsabilidades */}
          <section className="rounded-lg bg-gradient-to-br from-[#3C43EA] to-[#1a237e] p-4 text-white">
            <h2 className="mb-2 text-sm font-bold">
              Responsabilidades da empresa aplicadora:
            </h2>
            <p className="text-justify leading-relaxed">
              • O técnico deve seguir todas as normas de segurança e usar os
              EPI&apos;s obrigatórios.
            </p>
            <p className="text-justify leading-relaxed">
              • Pessoas sem EPI, crianças e animais não devem permanecer no
              ambiente durante a aplicação.
            </p>
            <p className="text-justify leading-relaxed">
              • O técnico deve proteger piso e móveis ao redor para evitar
              irregularidades.
            </p>
            <p className="mt-1 text-justify text-[0.5rem] leading-relaxed">
              • A empresa aplicadora deve seguir o termo de uso profissional,
              disponível no site www.gshomesolutions.com.br e todas as
              instruções acima.
            </p>
          </section>

          {/* Form Fields */}
          <section className="flex-1 rounded-lg bg-gradient-to-br from-[#3C43EA] to-[#1a237e] p-4 text-white">
            <div className="flex flex-col gap-2">
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
                <span className="font-semibold">Nome do Cliente:</span>
                <span>{clientName}</span>
              </div>
              <div className="flex items-center gap-2 border-b border-white/30 pb-1">
                <span className="font-semibold">Empresa aplicadora:</span>
                <span>{companyName}</span>
              </div>
              <div className="flex items-center gap-2 border-b border-white/30 pb-1">
                <span className="font-semibold">Técnico aplicador:</span>
                <span>{technichalResponsible}</span>
              </div>
            </div>
            <p className="mt-2 text-[0.45rem] text-white/70">
              {certificateNumber}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
