import Link from 'next/link';

const codeClass =
  'mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100';

const topics = [
  ['Visão geral', 'visao-geral'],
  ['Acessos e perfis', 'acessos'],
  ['Emissão de certificados', 'emissao'],
  ['Créditos administrativos', 'creditos'],
  ['Auditoria e logs', 'auditoria'],
  ['Integração G&S atual', 'integracao-atual'],
  ['Contrato da API', 'contrato-api'],
  ['Banco e migrações', 'banco'],
  ['Versões e ambiente', 'versoes'],
  ['Operação local', 'operacao-local'],
  ['Problemas frequentes', 'problemas'],
  ['Evolução recomendada', 'evolucao'],
];

function Section({
  id,
  title,
  children,
}: Readonly<{
  id: string;
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <section
      id={id}
      className="scroll-mt-8 border-b border-slate-200 pb-10 last:border-0"
    >
      <h2 className="text-2xl font-bold tracking-tight text-slate-950">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
        {children}
      </div>
    </section>
  );
}

export default function DashboardDocsPage() {
  return (
    <main className="mx-auto flex w-full max-w-screen-2xl gap-8 px-5 py-8 lg:px-10">
      <aside className="hidden w-60 shrink-0 self-start lg:sticky lg:top-6 lg:block">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Documentação
        </p>
        <nav className="space-y-1 border-l border-slate-200">
          {topics.map(([label, id]) => (
            <a
              key={id}
              href={'#' + id}
              className="block border-l-2 border-transparent px-3 py-1.5 text-sm text-slate-600 transition hover:border-brand hover:text-slate-950"
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <article className="min-w-0 max-w-4xl flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold text-brand">G&S Certificates</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
          Manual operacional e técnico
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Referência da versão atual do sistema: emissão de certificados,
          créditos, painel administrativo, integração em uso com a G&S e
          preparação para as próximas evoluções. Esta página descreve apenas o
          que está ativo ou compatível com a base atual.
        </p>

        <div className="my-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Aplicação
            </p>
            <p className="mt-1 font-semibold text-slate-950">Next.js 15.5.24</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Interface
            </p>
            <p className="mt-1 font-semibold text-slate-950">React 19.1.1</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Migração adicional
            </p>
            <p className="mt-1 font-semibold text-slate-950">
              0008_admin_audit.sql
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <Section id="visao-geral" title="Visão geral">
            <p>
              A plataforma recebe créditos de certificados pela integração já
              existente com a G&S. O cliente entra usando o código de cliente
              atual, consulta os saldos disponíveis, preenche o formulário e
              emite o certificado. Esse acesso de cliente não foi alterado.
            </p>
            <p>
              O painel administrativo é independente: possui sessão própria e
              concentra indicadores, ajustes de crédito e consulta de auditoria.
              Ele não utiliza nem altera a sessão do cliente.
            </p>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-950">
              <strong>Escopo atual:</strong> os tipos em operação são
              <code className="mx-1 rounded bg-white px-1.5 py-0.5">
                higienizacao
              </code>
              e
              <code className="mx-1 rounded bg-white px-1.5 py-0.5">
                impermeabilizacao
              </code>
              . Recursos de modelos dinâmicos e novos tipos ficam reservados
              para a futura etapa Certificados 2.0.
            </div>
          </Section>

          <Section id="acessos" title="Acessos e perfis">
            <h3 className="font-semibold text-slate-950">Cliente</h3>
            <p>
              Continua usando o fluxo por código já existente. Não há senha
              adicional, cadastro administrativo ou mudança de dados pessoais no
              fluxo do cliente. Os certificados e saldos exibidos são vinculados
              ao código informado.
            </p>
            <h3 className="font-semibold text-slate-950">Administrador</h3>
            <p>
              Acesse{' '}
              <Link className="text-brand underline" href="/admin">
                /admin
              </Link>{' '}
              com as credenciais exclusivas do dashboard. A autenticação usa
              senha derivada por scrypt e uma sessão própria, limitada a oito
              horas. Sair no cabeçalho encerra somente a sessão administrativa.
            </p>
            <p>
              Acesso administrativo, alteração de créditos e consulta de logs
              são validados no servidor. A tela não é uma autorização por si só.
            </p>
          </Section>

          <Section id="emissao" title="Emissão de certificados">
            <ol className="list-decimal space-y-2 pl-5">
              <li>O cliente entra com o código disponibilizado pela G&S.</li>
              <li>
                Seleciona Higienização ou Impermeabilização com saldo positivo.
              </li>
              <li>
                O sistema exibe um bloqueio de carregamento enquanto abre o
                formulário.
              </li>
              <li>
                Preenche cliente, empresa, data, técnico e produto quando
                aplicável.
              </li>
              <li>
                Ao emitir, a tela permanece bloqueada até a geração terminar.
              </li>
              <li>
                O certificado fica disponível para visualização, download e
                compartilhamento.
              </li>
            </ol>
            <p>
              O calendário mantém a janela operacional permitida: data atual e
              até cinco dias anteriores. Campos de texto e data são controlados
              desde o carregamento para evitar erros de estado da interface.
            </p>
            <p>
              A compatibilidade do PDF foi ajustada para que download e
              compartilhamento gerem o mesmo arquivo válido. Se uma prévia
              falhar em um navegador específico, teste o download ou outro
              visualizador antes de concluir que o PDF está corrompido.
            </p>
          </Section>

          <Section id="creditos" title="Créditos administrativos">
            <p>
              Em <strong>Dashboard → Gerenciar créditos</strong>, o
              administrador consulta o saldo de um usuário e escolhe uma
              operação: <strong>Acrescentar</strong> ou
              <strong>Retirar</strong>. O campo aceita somente número positivo;
              o sentido da operação é definido pelo seletor para evitar erros
              com sinais.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Tipos aceitos: Higienização e Impermeabilização.</li>
              <li>
                Não é permitido retirar mais créditos do que o saldo disponível.
              </li>
              <li>O ajuste é gravado junto com o saldo e possui histórico.</li>
              <li>
                Operações simultâneas do mesmo usuário/tipo são serializadas no
                banco.
              </li>
            </ul>
            <p>
              Esse fluxo substitui a necessidade de editar manualmente
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">
                token_balance
              </code>
              no banco para ajustes rotineiros.
            </p>
          </Section>

          <Section id="auditoria" title="Auditoria e logs">
            <p>
              A área <strong>Auditoria administrativa</strong> registra logins,
              logouts, ajustes de créditos e erros relevantes da operação
              administrativa. Use a busca e os filtros de nível e categoria para
              encontrar eventos.
            </p>
            <p>
              Os logs administrativos são retidos por 180 dias. A limpeza é
              executada após ajustes de crédito bem-sucedidos, evitando
              crescimento indefinido da tabela sem depender de tarefa manual
              diária.
            </p>
            <p>
              Logs de cliente não são um espelho de todos os cliques ou
              preenchimentos. A finalidade da auditoria atual é rastrear ações
              administrativas sensíveis, preservando uma base de dados enxuta.
            </p>
          </Section>

          <Section id="integracao-atual" title="Integração G&S atual">
            <p>
              A ponte existente permanece compatível. A G&S chama a aplicação
              para acrescentar ou consumir créditos em lote. A regra de negócio
              local continua sendo apenas atualizar o saldo por cliente e tipo;
              não é necessário mudar o formulário da G&S para publicar esta
              versão.
            </p>
            <p>
              As chamadas usam o cabeçalho
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">
                Authorization
              </code>
              com o mesmo segredo configurado em
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">
                JWT_SECRET
              </code>
              . A aplicação responde com 401 sem esse valor, 400 para corpo
              inválido e 201 quando processa o lote.
            </p>
          </Section>

          <Section id="contrato-api" title="Contrato da API em uso">
            <h3 className="font-semibold text-slate-950">Adicionar créditos</h3>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5">
                POST /api/order
              </code>{' '}
              recebe uma lista de clientes e os créditos a acrescentar.
            </p>
            <pre className={codeClass}>
              {
                'POST /api/order\\nAuthorization: Bearer SEU_JWT_SECRET\\nContent-Type: application/json\\n\\n[\\n  {\\n    "id": 688754,\\n    "tokens": {\\n      "higienizacao": 10,\\n      "impermeabilizacao": 5\\n    }\\n  }\\n]'
              }
            </pre>
            <h3 className="font-semibold text-slate-950">Consumir créditos</h3>
            <p>
              <code className="rounded bg-slate-100 px-1.5 py-0.5">
                POST /api/decrementTokens
              </code>{' '}
              usa o mesmo formato para retirar os créditos entregues pela
              operação externa.
            </p>
            <pre className={codeClass}>
              {
                'POST /api/decrementTokens\\nAuthorization: Bearer SEU_JWT_SECRET\\nContent-Type: application/json\\n\\n[\\n  {\\n    "id": 688754,\\n    "tokens": { "impermeabilizacao": 1 }\\n  }\\n]'
              }
            </pre>
            <p>
              O campo{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5">id</code> é
              numérico. Cada token é opcional, mas ao menos um tipo deve ser
              enviado pela regra da integração. A adição pode criar o registro
              de saldo quando ele ainda não existe; a retirada exige saldo
              suficiente.
            </p>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
              <strong>Importante:</strong> este é o contrato atual, mantido para
              publicação rápida. Ele ainda não possui idempotência por evento. A
              origem não deve repetir uma mesma solicitação automaticamente sem
              confirmar a resposta.
            </div>
          </Section>

          <Section id="banco" title="Banco e migrações">
            <p>
              A base usa PostgreSQL. As tabelas legadas de usuários,
              certificados e saldos permanecem como fonte de operação. A única
              migração obrigatória desta etapa é
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">
                drizzle/migrations/0008_admin_audit.sql
              </code>
              , que cria os registros de ajustes e auditoria.
            </p>
            <pre className={codeClass}>
              {
                'token_adjustments\\n- histórico de cada acréscimo ou retirada administrativa\\n\\nsystem_logs\\n- login, logout, créditos e eventos administrativos relevantes'
              }
            </pre>
            <p>
              Antes de aplicar em produção, faça backup e execute a migração no
              banco alvo. Os índices usam proteção
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">
                IF NOT EXISTS
              </code>
              , portanto a execução repetida não deve falhar por índices já
              criados.
            </p>
          </Section>

          <Section id="versoes" title="Versões, segurança e ambiente">
            <p>
              A aplicação foi atualizada para Next.js 15.5.24 e React 19.1.1.
              Atualizações controladas reduzem exposição a correções de
              segurança acumuladas, evitam perda de suporte do ecossistema e
              mantêm compatibilidade com navegadores, formulários e bibliotecas
              atuais.
            </p>
            <p>
              A versão do PostgreSQL é definida pela infraestrutura. O ambiente
              local atual usa PostgreSQL 10.2, versão antiga e fora de suporte.
              A atualização do banco precisa ser planejada separadamente, com
              backup, teste de restauração e validação da aplicação; ela não
              deve ser feita por simples troca de imagem em produção.
            </p>
            <h3 className="font-semibold text-slate-950">
              Variáveis obrigatórias
            </h3>
            <pre className={codeClass}>
              {
                'DATABASE_URL=postgresql://...\\nJWT_SECRET=segredo-compartilhado-com-a-gs\\nADMIN_USERNAME=usuario-do-dashboard\\nADMIN_PASSWORD_SCRYPT=hash-scrypt-da-senha\\nADMIN_SESSION_SECRET=segredo-aleatorio-com-32-ou-mais-caracteres'
              }
            </pre>
            <p>
              Nunca envie ou registre essas variáveis em chat, planilha, commit
              ou log. Em produção, configure-as diretamente no gerenciador de
              ambiente do servidor.
            </p>
          </Section>

          <Section id="operacao-local" title="Operação local">
            <p>
              Com Docker Desktop aberto, inicie o banco e depois a aplicação:
            </p>
            <pre className={codeClass}>
              {'docker start db\\npnpm install\\npnpm dev'}
            </pre>
            <p>
              A aplicação abre normalmente em
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">
                http://localhost:3000
              </code>
              . Para Adminer, use
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">
                http://localhost:8080
              </code>
              e, a partir do navegador, informe o servidor
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">
                host.docker.internal
              </code>
              .
            </p>
            <p>
              Antes de validar mudança de banco, confirme o banco selecionado. A
              importação local pode conter dados de testes antigos, que não
              representam os tipos exibidos na produção final.
            </p>
          </Section>

          <Section id="problemas" title="Problemas frequentes">
            <h3 className="font-semibold text-slate-950">
              Admin retorna usuário ou senha inválidos
            </h3>
            <p>
              Confirme que o processo foi reiniciado após mudar
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">
                .env.local
              </code>
              . Hashes scrypt contêm cifrões: no arquivo de ambiente, use o hash
              gerado pelo script do projeto, que já escapa esses caracteres para
              o carregador do Next.
            </p>
            <h3 className="font-semibold text-slate-950">
              Adminer não encontra “db”
            </h3>
            <p>
              No navegador,{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5">db</code> não
              é resolvido. Use{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5">
                host.docker.internal
              </code>
              com a porta publicada do PostgreSQL.
            </p>
            <h3 className="font-semibold text-slate-950">
              PDF não abre na prévia
            </h3>
            <p>
              Faça download e teste em outro leitor ou navegador. O
              compartilhamento deve usar o PDF baixado pela aplicação, não uma
              captura de tela ou URL temporária.
            </p>
          </Section>

          <Section id="evolucao" title="Evolução recomendada para a integração">
            <p>
              Esta seção é uma direção técnica para quando a G&S reestruturar a
              própria base. Não é requisito da publicação atual e não substitui
              as rotas compatíveis acima.
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Enviar um identificador único por evento, como{' '}
                <code>event_id</code>.
              </li>
              <li>
                Assinar cada requisição com HMAC e data de envio, em vez de
                apenas segredo estático.
              </li>
              <li>
                Incluir tipo de operação, cliente, créditos, origem e referência
                do pedido.
              </li>
              <li>
                Repetir com segurança apenas eventos cujo <code>event_id</code>{' '}
                não tenha sido processado.
              </li>
              <li>
                Disponibilizar consulta de status para reconciliação entre as
                duas bases.
              </li>
            </ol>
            <pre className={codeClass}>
              {
                '{\\n  "event_id": "pedido-123-credito-1",\\n  "occurred_at": "2026-09-15T12:00:00Z",\\n  "operation": "credit",\\n  "customer_id": 688754,\\n  "credits": { "impermeabilizacao": 10 },\\n  "reference": "Pedido G&S #123"\\n}'
              }
            </pre>
            <p>
              Quando essa etapa for aprovada, a migração deve ser feita com
              ambiente controlado, clientes de teste e reconciliação de saldos
              antes de apontar o ambiente de produção para o novo contrato.
            </p>
          </Section>
        </div>
      </article>
    </main>
  );
}
