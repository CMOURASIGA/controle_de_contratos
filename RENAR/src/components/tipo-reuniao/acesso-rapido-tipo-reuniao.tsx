import { SearchIcon } from "../icons/search-icon";
import { UsersSquarePlusIcon } from "../icons/users-square-plus";
import { Container } from "../layouts/container";
import { CartaoAcaoPagina } from "../layouts/ui/cards/cartao-acao-pagina";
import { PageHeader } from "../layouts/ui/page-header";

export function AcessoRapidoTipoReuniao() {
  return (
    <>
      <PageHeader title="Tipo Reunião" />
      <Container>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CartaoAcaoPagina
            titulo="Criar Tipo Reunião"
            descricao="Cadastre um tipo de reunião"
            icone={<UsersSquarePlusIcon className="size-14" />}
            href="/tipo-reuniao/novo"
          />
          <CartaoAcaoPagina
            titulo="Buscar Tipos de Reunião"
            descricao="Encontre tipos de reunião existentes"
            icone={<SearchIcon className="size-14" />}
            href="/tipo-reuniao/buscar"
          />
        </div>
      </Container>
    </>
  );
}
