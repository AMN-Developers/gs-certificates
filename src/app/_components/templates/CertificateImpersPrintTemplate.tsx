import { Montserrat } from 'next/font/google';
import logo from '@assets/logo.png';
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
      className={`fixed inset-0 flex min-h-screen w-full flex-col gap-4 bg-gradient-to-br from-[#7ec9ff] via-[#0066a8] to-[#7ec9ff] p-10 text-white ${montserrat.className}`}
    >
      <div className="flex flex-col items-center gap-3">
        <Image
          src={logo}
          alt="G&S Home Solutions Logo"
          width={70}
          height={70}
          className="w-auto"
          priority
        />
        <h1 className="text-3xl font-bold">
          Certificado de Garantia de Impermeabilização
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-x-1 gap-y-4">
        {/* Benefícios */}
        <section className="rounded-lg bg-black bg-opacity-15 px-10 py-4">
          <h2 className="mb-4 text-center text-xs font-bold">
            Benefícios da Impermeabilização
          </h2>
          <p className="text-xs font-thin leading-relaxed">
            A linha de impermeabilizantes Lótus oferece proteção excepcional aos
            tecidos contra a penetração de líquidos à base de água, óleo,
            líquidos alcoólicos com teor até 40° e líquidos quentes com
            temperatura de até 60°C. <br />
            Além disso, a impermeabilização facilita a limpeza, mantendo a
            integridade do tecido mesmo em casos de acidentes, e simplificando a
            manutenção.
            <br />
            A impermeabilização também protege contra ácaros, fungos, bactérias,
            mofo e outros agentes que possam causar alergias, prevenindo a
            umidade no tecido.
            <br />
            Importante: a aplicação do impermeabilizante da linha Lótus não
            altera a cor original do tecido, o toque e outras características
            essenciais, como resistência física e resistência ao desbotamento
            causado pelos raios UV.
            <br />
            Todos os impermeabilizantes da linha Lótus são notificados na ANVISA
            e seguem rigorosos padrões de qualidade, assegurados pelo sistema de
            gestão da qualidade ISO 9001.
          </p>
        </section>

        {/* Garantia */}
        <section className="px-10 py-4">
          <h2 className="mb-4 text-xs font-bold">Garantia</h2>
          <p className="text-xs">
            A impermeabilização com produtos da linha Lótus oferece garantia de
            até 1 ano, com exceção de casos envolvendo urina humana ou animal,
            tintas, graxas, produtos químicos e seus derivados.
            <br />
            A durabilidade da proteção depende do uso, da aplicação correta do
            produto e do seguimento das orientações de manutenção.
            <br />
            Importante: o estofado não pode ser exposto ao sol diretamente e é
            fundamental evitar limpezas amadoras com produtos químicos
            agressivos ou combinações não recomendadas pelo técnico aplicador.
            <br />A garantia do produto é respaldada pela norma{' '}
            <strong>AATCC TM 22-2017 Water Repellency: Spray Test</strong>, e
            métodos internos da G&S Home Solutions{' '}
            <strong>
              PL-09 Determinação da eficiência de impermeabilidade em tecido com
              água e óleo
            </strong>{' '}
            e{' '}
            <strong>
              PL-21 Determinação da repelência de soluções água-álcool e
              hidrocarboneto
            </strong>
            . Ambas em conformidade com o Código de Defesa do Consumidor. Caso
            ocorra algum derramamento de líquidos de forma proposital, a
            garantia será invalidada.
            <br />A proteção oferecida pelos produtos da linha Lótus é
            certificada por meio de um certificado digital, emitida pela empresa
            responsável pela aplicação. Se houver qualquer irregularidade na
            proteção, entre em contato com a empresa para que ela acione o
            fabricante.
          </p>
        </section>

        {/* Manutenção */}
        <section className="px-10 py-4">
          <h2 className="mb-4 text-xs font-bold">
            Manutenção e Cuidados Após a Aplicação
          </h2>
          <p className="text-xs">
            Para garantir a durabilidade e eficácia da impermeabilização, é
            fundamental seguir as recomendações abaixo:
          </p>
          <ul className="mt-2 text-left text-xs">
            <li className="mb-2">
              - <strong>Aspiração Regular:</strong> Aspire o estofado
              semanalmente para manter a vida útil do tecido e a eficácia da
              proteção impermeabilizante. O acúmulo excessivo de poeira ou pelos
              de animais pode comprometer a eficácia da proteção, pois essas
              partículas possuem a capacidade de absorver água e se acumular na
              superfície do tecido.
            </li>
            <li className="mb-2">
              - <strong>Produtos Não Recomendados:</strong> Evite aplicar sprays
              odorizadores de tecidos/ambientes, home sprays ou amaciante
              diluído em água. Estes produtos contêm substâncias que podem
              danificar a camada impermeabilizante, comprometendo a proteção do
              tecido.
            </li>
            <li className="mb-2">
              - <strong>Derramamento de Líquidos:</strong> Em caso de
              derramamento de líquidos, remova imediatamente com um papel
              absorvente. Deixe o papel em contato com o líquido até que a
              absorção total seja alcançada por capilaridade. Nunca pressione ou
              esfregue o papel sobre o tecido e evite o uso de panos.
            </li>
            <li className="mb-2">
              - <strong>Manchas e Sujidades:</strong> Embora a impermeabilização
              ofereça proteção, algumas manchas podem ocorrer, como sombreamento
              após a remoção de líquidos pastosos, marcas de patinhas de
              animais, manchas de saliva/excrementos de PETs, manchas de vinho e
              marcas do uso diário. Para a remoção de manchas, recomendamos o
              uso do Lótus Clean Protect, que não apenas remove a mancha, mas
              também repõe a camada protetora no local afetado.
            </li>
            <li>
              - <strong>Evitar Produtos Caseiros:</strong> Não utilize
              detergente neutro, sabão de roupas, cloro ou outras misturas
              caseiras para a remoção de manchas.
            </li>
          </ul>
        </section>

        {/* Responsabilidades + Formulário */}
        <section className="flex h-full flex-col justify-between px-10 py-4">
          <div className="mb-4">
            <h2 className="mb-4 text-xs font-bold">
              Responsabilidades da Empresa Aplicadora
            </h2>

            <p className="text-xs">
              A impermeabilização do tecido pode ser realizada na própria
              residência ou em local definido pelo técnico.
              <br />
              Todas as medidas de segurança e utilização de EPI&apos;s deverão
              ser seguidas pelo técnico. Indicamos que pessoas sem os EPI&apos;s
              adequados, crianças e animais não permaneçam no local durante a
              aplicação.
              <br />
              Deve ser realizada medidas para proteção do piso e móveis ao redor
              do local de aplicação. Afim de evitar qualquer tipo de
              irregularidade.
              <br />
              Ao final do serviço deve ser feito um teste de eficiência,
              seguindo as orientações do fabricante. A empresa aplicadora deverá
              seguir o termo de uso profissional definido pelo fabricante e as
              instruções acima escritas. O não seguimento é de total
              responsabilidade da empresa aplicadora, podendo influenciar na
              perda da garantia do produto.
            </p>
          </div>

          <div className="flex w-full rounded-lg bg-black bg-opacity-15 py-4 pl-2">
            <div className="flex flex-col gap-4 text-xs">
              <div>
                <p className="font-semibold">
                  Data:{' '}
                  <span className="font-thin">
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
                  <span className="font-thin">{clientName}</span>
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  Produto aplicado: <span className="font-thin">{product}</span>
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  Empresa aplicadora:{' '}
                  <span className="font-thin">{companyName}</span>
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">
                  Técnico aplicador:{' '}
                  <span className="font-thin">{technichalResponsible}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-2 pt-2">
            <p className="text-xs font-thin">{certificateNumber} </p>
          </div>
        </section>
      </div>
    </div>
  );
}
