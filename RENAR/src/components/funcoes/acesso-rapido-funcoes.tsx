import { SearchIcon } from "../icons/search-icon";
import { UsersSquarePlusIcon } from "../icons/users-square-plus";
import { Container } from "../layouts/container";
import { CartaoAcaoPagina } from "../layouts/ui/cards/cartao-acao-pagina";
import { PageHeader } from "../layouts/ui/page-header";

export function AcessoRapidoFuncoes() {
  return (
    <>
      <PageHeader title="Funções" />
      <Container>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CartaoAcaoPagina
            titulo="Criar Função"
            descricao="Cadastre uma função"
            icone={<UsersSquarePlusIcon className="size-14" />}
            href="/funcoes/novo"
          />
          <CartaoAcaoPagina
            titulo="Buscar Funções"
            descricao="Encontre funções existentes"
            icone={<SearchIcon className="size-14" />}
            href="/funcoes/buscar"
          />
        </div>
      </Container>
    </>
  );
}
