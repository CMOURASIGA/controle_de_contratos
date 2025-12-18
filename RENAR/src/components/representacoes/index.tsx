import { SearchIcon } from "../icons/search-icon";
import { UsersSquarePlusIcon } from "../icons/users-square-plus";
import { Container } from "../layouts/container";
import { CartaoAcaoPagina } from "../layouts/ui/cards/cartao-acao-pagina";
import { PageHeader } from "../layouts/ui/page-header";

export function AcessoRapidoRepresentacao() {
  return (
    <>
      <PageHeader title="Representações" />
      <Container>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CartaoAcaoPagina
            titulo="Criar Representação"
            icone={<UsersSquarePlusIcon className="size-14" />}
            descricao="Crie uma nova representação"
            href="/representacoes/novo"
          />

          <CartaoAcaoPagina
            titulo="Buscar Representação"
            icone={<SearchIcon className="size-14" />}
            descricao="Faça uma busca com filtros"
            href="/representacoes/busca"
          />
        </div>
      </Container>
    </>
  );
}
