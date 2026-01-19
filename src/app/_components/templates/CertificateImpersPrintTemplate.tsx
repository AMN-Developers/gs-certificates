import { Montserrat } from 'next/font/google';
import logo from '@assets/logo.svg';
import aatcc from '@assets/aatcc.svg';
import eureciclo from '@assets/eureciclo.svg';
import iso from '@assets/iso.svg';
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
      className={`fixed inset-0 flex min-h-screen flex-col gap-6 bg-gradient-to-br from-[#7ec9ff] via-[#0066a8] to-[#7ec9ff] p-8 text-white ${montserrat.className}`}
    >
      <div className="flex flex-col items-center gap-3">
        <Image
          src={logo}
          alt="G&S Home Solutions Logo"
          width={140}
          height={140}
          priority
        />
        <h1 className="text-xl font-bold">
          CERTIFICADO DE GARANTIA DE IMPERMEABILIZAÇÃO
        </h1>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-6 text-[0.8rem]">
        {/* Benefícios */}
        <section className="flex flex-col items-center rounded-lg bg-black bg-opacity-15 p-4">
          <h2 className="mb-4 text-center font-bold">
            BENEFÍCIOS DA IMPERMEABILIZAÇÃO
          </h2>
          <p className="font-light leading-relaxed">
            A linha de impermeabilizantes Lótus protege tecidos contra líquidos
            à base de água, óleo, bebidas alcoólicas até 40° e líquidos quentes
            de até 60°C. Facilita a limpeza, preserva a integridade do tecido em
            acidentes e reduz a necessidade de manutenção.
            <br />
            Também oferece proteção contra alérgenos, tais como, ácaros, fungos,
            bactérias e mofo, ao evitar a umidade no tecido. Não altera cor,
            toque ou características essenciais do tecido, como resistência
            física e resistência ao desbotamento por raios UV. Todos os
            impermeabilizantes Lótus são notificados na ANVISA e seguem
            rigorosos padrões de qualidade baseados em normas internacionais.
          </p>
        </section>

        {/* Garantia */}
        <section className="flex flex-col">
          <h2 className="mb-4 font-bold">Garantia</h2>
          <p className="">
            A impermeabilização com produtos Lótus possui garantia de até 1 ano,
            exceto em casos envolvendo urina humana ou animal, tintas, graxas,
            produtos químicos e derivados. A durabilidade depende do uso, da
            aplicação correta e do cumprimento das orientações de manutenção. É
            importante evitar exposição direta ao sol e limpezas amadoras com
            produtos agressivos.
            <br />
            <br />A garantia do produto é respaldada pela norma{' '}
            <strong>ATCC TM 22-2017 Water Repellency: Spray Test</strong>, e
            métodos internos da G&S Home Solutions{' '}
            <strong>
              PL-09 Determinação da eficiência de impermeabilidade em tecido com
              água e óleo e PL-21 Determinação da repelência de soluções
              água-álcool e hidrocarboneto.
            </strong>
            Ambas em conformidade com o Código de Defesa do Consumidor. Caso
            ocorra algum derramamento de líquidos de forma proposital, a
            garantia será invalidada. A proteção oferecida pelos produtos da
            linha Lótus é certificada por meio de um certificado digital,
            emitida pela empresa responsável pela aplicação. Se houver qualquer
            irregularidade na proteção, entre em contato com a empresa para que
            ela acione o fabricante.
          </p>
        </section>

        {/* Manutenção */}
        <section className="flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold">
              MANUTENÇÃO E CUIDADOS APÓS A APLICAÇÃO
            </h2>

            <ul className="flex list-inside list-disc flex-col text-left">
              <li>
                <strong>Aspiração Regular:</strong> Aspire o estofado
                semanalmente. Poeira e pelos acumulados podem absorver água e
                prejudicar a eficácia da impermeabilização.
              </li>
              <li>
                <strong>Produtos Não Recomendados:</strong> Evite odorizadores
                de tecidos/ambientes, home sprays e amaciante diluído, pois
                podem danificar a camada protetora.
              </li>
              <li>
                <strong>Derramamento de Líquidos:</strong> Remova imediatamente
                com papel absorvente, deixando o papel em contato com o líquido
                até que a absorção total seja alcançada por capilaridade. Não
                esfregue nem use panos.
              </li>
              <li>
                <strong>Manchas e Sujidades:</strong> Algumas marcas podem
                ocorrer (sombreamento, patinhas, saliva/excrementos de pets,
                vinho e uso diário). Para removê-las, utilize Lótus Clean
                Protect, que também recompõe a proteção no local.
              </li>
              <li>
                <strong>Evitar Produtos Caseiros:</strong> Não use detergente
                neutro, sabão para roupas, cloro ou misturas caseiras para
                limpeza de manchas.
              </li>
            </ul>
          </section>

          <section className="flex items-center justify-start">
            <div className="flex items-center gap-4">
              {/* Add your logos here */}
              <Image src={aatcc} alt="Logo" width={50} height={50} />
              <Image src={eureciclo} alt="Logo" width={50} height={50} />
              <Image src={iso} alt="Logo" width={50} height={50} />
            </div>
          </section>
        </section>

        {/* Responsabilidades + Formulário */}
        <section className="flex flex-col justify-between">
          <div>
            <h2 className="mb-4 font-bold">
              Responsabilidades da empresa aplicadora:
            </h2>

            <ul className="list-inside list-disc">
              <li>
                O técnico deve seguir todas as normas de segurança e usar os
                EPI’s obrigatórios.
              </li>
              <li>
                Pessoas sem EPI, crianças e animais não devem permanecer no
                ambiente durante a aplicação.
              </li>
              <li>
                O técnico deve proteger piso e móveis ao redor para evitar
                irregularidades.
              </li>
              <li>
                Ao final, deve ser realizado teste de eficiência conforme
                orientações do fabricante.
              </li>
              <li>
                A empresa aplicadora deve seguir o termo de uso profissional,
                disponível no site www.gshomesolutions.com.br e todas as
                instruções acima; o descumprimento é de sua total
                responsabilidade e pode resultar na perda da garantia.
              </li>
            </ul>
          </div>

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
                  Nome do cliente:{' '}
                  <span className="font-light">{clientName}</span>
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  Produto aplicado:{' '}
                  <span className="font-light">Lótus {product}</span>
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  Empresa aplicadora:{' '}
                  <span className="font-light">{companyName}</span>
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">
                  Técnico aplicador:{' '}
                  <span className="font-light">{technichalResponsible}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-2 pt-2">
            <p className="font-light">{certificateNumber} </p>
          </div>
        </section>
      </div>
    </div>
  );
}
