import { SearchIcon } from "../icons/search-icon";
import { UsersSquarePlusIcon } from "../icons/users-square-plus";
import { Container } from "../layouts/container";
import { CartaoAcaoPagina } from "../layouts/ui/cards/cartao-acao-pagina";
import { PageHeader } from "../layouts/ui/page-header";

export function AcessoRapidoTextosWeb() {
  return (
    <>
      <PageHeader title="Texto Web" />
      <Container>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CartaoAcaoPagina
            titulo="Criar Texto Web"
            descricao="Cadastre um texto web"
            icone={<UsersSquarePlusIcon className="size-14" />}
            href="/texto-web/novo"
          />
          <CartaoAcaoPagina
            titulo="Buscar Textos Web"
            descricao="Encontre textos existentes"
            icone={<SearchIcon className="size-14" />}
            href="/texto-web/buscar"
          />
        </div>
      </Container>
    </>
  );
}
