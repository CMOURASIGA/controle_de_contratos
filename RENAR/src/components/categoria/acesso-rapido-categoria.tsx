import { SearchIcon } from "../icons/search-icon";
import { UsersSquarePlusIcon } from "../icons/users-square-plus";
import { Container } from "../layouts/container";
import { CartaoAcaoPagina } from "../layouts/ui/cards/cartao-acao-pagina";
import { PageHeader } from "../layouts/ui/page-header";

export function AcessoRapidoCategorias() {
  return (
    <>
      <PageHeader title="Categoria" />
      <Container>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CartaoAcaoPagina
            titulo="Criar Categoria"
            descricao="Cadastre uma categoria"
            icone={<UsersSquarePlusIcon className="size-14" />}
            href="/categorias/novo"
          />
          <CartaoAcaoPagina
            titulo="Buscar Categorias"
            descricao="Encontre categorias existentes"
            icone={<SearchIcon className="size-14" />}
            href="/categorias/buscar"
          />
        </div>
      </Container>
    </>
  );
}
