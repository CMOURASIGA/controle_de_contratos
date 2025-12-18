import { SearchIcon } from "../icons/search-icon";
import { UsersSquarePlusIcon } from "../icons/users-square-plus";
import { Container } from "../layouts/container";
import { CartaoAcaoPagina } from "../layouts/ui/cards/cartao-acao-pagina";
import { PageHeader } from "../layouts/ui/page-header";

export function AcessoRapidoPrioridadeRepresentacao() {
  return (
    <>
      <PageHeader title="Prioridade de Representação" />
      <Container>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CartaoAcaoPagina
            titulo="Criar Prioridade de Representação"
            descricao="Cadastre um prioridade de Representação"
            icone={<UsersSquarePlusIcon className="size-14" />}
            href="/prioridade-representacao/novo"
          />
          <CartaoAcaoPagina
            titulo="Buscar Prioridades de Representação"
            descricao="Encontre prioridades existentes"
            icone={<SearchIcon className="size-14" />}
            href="/prioridade-representacao/buscar"
          />
        </div>
      </Container>
    </>
  );
}
