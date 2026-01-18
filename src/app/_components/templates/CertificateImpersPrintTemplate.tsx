import { Montserrat } from 'next/font/google';
import logo from '@assets/logo.png';
import selo from '@assets/selo.png';
import Image from 'next/image';
import { Products } from '@/dtos/certificate';

type TCertificatePrintTemplateProps = {
  certificate: {
    date: Date;
    clientName: string;
    companyName: string;
    technichalResponsible: string;
    product: Products;
  };
  certificateNumber: string;
};

const montserrat = Montserrat({ subsets: ['latin'] });

export default function CertificateImpersPrintTemplate({
  certificate,
  certificateNumber,
}: TCertificatePrintTemplateProps) {
  const { clientName, companyName, technichalResponsible, product, date } =
    certificate;

  return (
    <div
      className={`fixed inset-0 flex min-h-screen flex-col bg-white ${montserrat.className}`}
    >
      {/* Header */}
      <div className="flex flex-col items-center bg-gradient-to-r from-[#1a4b8c] via-[#2d6cb5] to-[#1a4b8c] py-4">
        <Image
          src={logo}
          alt="G&S Home Solutions Logo"
          width={80}
          height={80}
          priority
        />
        <h1 className="mt-2 text-xl font-bold uppercase tracking-wide text-white">
          Certificado de Garantia de Impermeabilização
        </h1>
      </div>

      {/* Content */}
      <div className="grid flex-1 grid-cols-2 gap-4 p-4 text-[0.55rem]">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          {/* Benefícios */}
          <section className="rounded-lg bg-gradient-to-br from-[#3b82c4] to-[#1e5a9e] p-4 text-white">
            <h2 className="mb-2 text-center text-sm font-bold uppercase">
              Benefícios da Impermeabilização
            </h2>
            <p className="text-justify leading-relaxed">
              A linha de impermeabilizantes Lótus protege tecidos contra
              líquidos à base de água, óleo, bebidas alcoólicas até 40° e
              líquidos quentes de até 60°C. Facilita a limpeza, preserva a
              integridade do tecido em acidentes e reduz a necessidade de
              manutenção.
            </p>
            <p className="mt-1 text-justify leading-relaxed">
              Também oferece proteção contra alérgenos, tais como, ácaros,
              fungos, bactérias e mofo, ao evitar a umidade no tecido.
            </p>
            <p className="mt-1 text-justify leading-relaxed">
              Não altera cor, toque ou características essenciais do tecido,
              como resistência física e resistência ao desbotamento por raios
              UV.
            </p>
            <p className="mt-1 text-justify leading-relaxed">
              Todos os impermeabilizantes Lótus são notificados na ANVISA e
              seguem rigorosos padrões de qualidade baseados em normas
              internacionais.
            </p>
          </section>

          {/* Manutenção */}
          <section className="flex-1 rounded-lg bg-gradient-to-br from-[#3b82c4] to-[#1e5a9e] p-4 text-white">
            <h2 className="mb-2 text-sm font-bold uppercase">
              Manutenção e Cuidados Após a Aplicação
            </h2>
            <ul className="flex flex-col gap-1 text-justify">
              <li>
                • <strong>Aspiração regular:</strong> Aspire o estofado
                semanalmente. Poeira e pelos acumulados podem absorver água e
                prejudicar a eficácia da impermeabilização.
              </li>
              <li>
                • <strong>Produtos não recomendados:</strong> Evite odorizadores
                de tecidos/ambientes, home sprays e amaciante diluído, pois
                podem danificar a camada protetora.
              </li>
              <li>
                • <strong>Derramamento de líquidos:</strong> Remova
                imediatamente com papel absorvente, deixando o papel em contato
                com o líquido até que a absorção total seja alcançada por
                capilaridade. Não esfregue nem use panos.
              </li>
              <li>
                • <strong>Manchas e sujidades:</strong> Algumas marcas podem
                ocorrer (sombreamento, patinhas, saliva/excrementos de pets,
                vinho e uso diário). Para removê-las, utilize Lótus Clean
                Protect, que também recompõe a proteção no local.
              </li>
              <li>
                • <strong>Evite produtos caseiros:</strong> Não use detergente
                neutro, sabão para roupas, cloro ou misturas caseiras para
                limpeza de manchas.
              </li>
            </ul>

            {/* Certification Logos */}
            <div className="mt-3 flex items-center gap-4">
              <Image
                src={selo}
                alt="AATCC Certification"
                width={35}
                height={35}
                className="object-contain"
              />
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50">
                <span className="text-[0.4rem]">♻️</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[0.5rem] font-bold">ISO</span>
                <span className="text-[0.35rem]">9001</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Garantia */}
          <section className="rounded-lg bg-gradient-to-br from-[#3b82c4] to-[#1e5a9e] p-4 text-white">
            <h2 className="mb-2 text-sm font-bold">Garantia</h2>
            <p className="text-justify leading-relaxed">
              A impermeabilização com produtos Lótus possui garantia de até 1
              ano, exceto em casos envolvendo urina humana ou animal, tintas,
              graxas, produtos químicos e derivados. A durabilidade depende do
              uso, da aplicação correta e do cumprimento das orientações de
              manutenção. É importante evitar exposição direta ao sol e limpezas
              amadoras com produtos agressivos.
            </p>
            <p className="mt-1 text-justify leading-relaxed">
              A garantia do produto é respaldada pela norma{' '}
              <strong>AATCC TM 22-2017 Water Repellency: Spray Test</strong>, e
              métodos internos da G&S Home Solutions{' '}
              <strong>
                PL-09 Determinação da eficiência de impermeabilidade em tecido
                com água e óleo
              </strong>{' '}
              e{' '}
              <strong>
                PL-21 Determinação da repelência de soluções água-álcool e
                hidrocarboneto
              </strong>
              . Ambas em conformidade com o Código de Defesa do Consumidor. Caso
              ocorra algum derramamento de líquidos de forma proposital, a
              garantia será invalidada. A proteção oferecida pelos produtos da
              linha Lótus é certificada por meio de um certificado digital,
              emitida pela empresa responsável pela aplicação. Se houver
              qualquer irregularidade na proteção, entre em contato com a
              empresa para que ela acione o fabricante.
            </p>
          </section>

          {/* Responsabilidades */}
          <section className="rounded-lg bg-gradient-to-br from-[#3b82c4] to-[#1e5a9e] p-4 text-white">
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
            <p className="text-justify leading-relaxed">
              • Ao final, deve ser realizado teste de eficiência conforme
              orientações do fabricante.
            </p>
            <p className="mt-1 text-justify text-[0.5rem] leading-relaxed">
              • A empresa aplicadora deve seguir o termo de uso profissional,
              disponível no site www.gshomesolutions.com.br e todas as
              instruções acima; o descumprimento é de sua total responsabilidade
              e pode resultar na perda da garantia.
            </p>
          </section>

          {/* Form Fields */}
          <section className="flex-1 rounded-lg bg-gradient-to-br from-[#3b82c4] to-[#1e5a9e] p-4 text-white">
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
                <span className="font-semibold">Produto aplicado:</span>
                <span>Lótus {product}</span>
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
