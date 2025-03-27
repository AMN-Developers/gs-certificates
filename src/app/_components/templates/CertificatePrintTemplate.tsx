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

export default function CertificatePrintTemplate({
  certificate,
  certificateNumber,
}: TCertificatePrintTemplateProps) {
  const { date, clientName, companyName, technichalResponsible } = certificate;

  return (
    <div className="fixed inset-0 flex flex-col gap-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#3C43EA] to-[#101242] p-10 text-white">
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
            Certificamos que a superfície foi higienizada com o Power Trio da
            G&S Home Solutions.
          </p>
          <p>
            Esta higienização garante que a superfície têxtil esteja livre de
            bactérias, conforme testes realizados seguindo as normas têxteis
            internacionais método ASTM E2149-13.
          </p>
          <p>
            Todos os produtos componentes do Power Trio G&S são notificados pela
            ANVISA, garantindo sua segurança e conformidade.
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
            (Sociedade Vegana Brasileira). Cuidamos da saúde do seu lar, sem
            agredir o meio ambiente e respeitando a vida dos animais.
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
  );
}
