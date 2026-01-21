import Image from 'next/image';
import logo from '@assets/logo.svg';
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
    <div
      className={`fixed inset-0 flex flex-col gap-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#3C43EA] to-[#101242] p-8 text-white`}
    >
      {/* Certificate Header */}
      <div className="flex flex-col items-center gap-3">
        <Image
          src={logo}
          alt="G&S Home Solutions Logo"
          width={140}
          height={140}
          priority
        />
        <h1 className="text-xl font-bold">
          CERTIFICADO DE GARANTIA DE HIGIENIZAÇÃO
        </h1>
      </div>

      {/* Certificate Content */}
      <div className="grid flex-1 grid-cols-2 gap-6 text-[0.9rem]">
        <div className="flex flex-col items-center gap-3 rounded-lg bg-black bg-opacity-15 p-4">
          <p className="font-light leading-relaxed">
            Certificamos que a superfície foi higienizada com o Power Trio da
            G&S Home Solutions.
            <br />
            <br />
            Esta higienização garante que a superfície têxtil esteja livre de
            bactérias, conforme testes realizados seguindo as normas têxteis
            internacionais método ASTM E2149-13.
            <br />
            <br />
            Todos os produtos componentes do Power Trio G&S são notificados pela
            ANVISA, garantindo sua segurança e conformidade.
          </p>
          <Image
            src={astm}
            alt="ASTM Certification"
            width={50}
            height={50}
            priority
          />
        </div>

        <div className="flex flex-col justify-between gap-3 rounded-lg bg-shades-wave bg-cover bg-no-repeat p-4">
          <p className="font-light leading-relaxed">
            Certificamos também que os produtos são homologados pela SVB
            (Sociedade Vegana Brasileira). Cuidamos da saúde do seu lar, sem
            agredir o meio ambiente e respeitando a vida dos animais.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Image
              src={qrVegan}
              alt="Selo Vegano"
              width={50}
              height={50}
              priority
            />
          </div>
          <p className="text-center font-light italic">
            Esta é uma parcela de cuidado com o nosso planeta que você nos
            ajudou a garantir.
          </p>
        </div>
      </div>

      {/* Certificate Footer */}
      <div className="flex w-full rounded-lg bg-black bg-opacity-15 py-4 pl-2">
        <div className="flex flex-col gap-2">
          <div>
            <p className="font-semibold">
              Data:{' '}
              <span className="font-light">
                {new Date(date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>
          <div>
            <p className="font-semibold">
              Nome do cliente: <span className="font-light">{clientName}</span>
            </p>
          </div>
          <div>
            <p className="font-semibold">
              Empresa aplicadora:{' '}
              <span className="font-light">{companyName}</span>
            </p>
          </div>
          <div>
            <p className="font-semibold">
              Técnico aplicador:{' '}
              <span className="font-light">{technichalResponsible}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="pt-2">
        <p className="font-light">{certificateNumber}</p>
      </div>
    </div>
  );
}
