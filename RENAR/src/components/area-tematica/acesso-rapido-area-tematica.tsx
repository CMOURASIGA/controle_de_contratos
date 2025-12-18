import { SearchIcon } from "../icons/search-icon";
import { UsersSquarePlusIcon } from "../icons/users-square-plus";
import { Container } from "../layouts/container";
import { CartaoAcaoPagina } from "../layouts/ui/cards/cartao-acao-pagina";
import { PageHeader } from "../layouts/ui/page-header";

export function AcessoRapidoAreaTematica() {
  return (
    <>
      <PageHeader title="Áreas Temáticas" />
      <Container>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CartaoAcaoPagina
            titulo="Criar Área Temática"
            descricao="Cadastre uma área temática"
            icone={<UsersSquarePlusIcon className="size-14" />}
            href="/area-tematica/novo"
          />
          <CartaoAcaoPagina
            titulo="Buscar Áreas Temáticas"
            descricao="Encontre áreas temáticas existentes"
            icone={<SearchIcon className="size-14" />}
            href="/area-tematica/buscar"
          />
        </div>
      </Container>
    </>
  );
}
