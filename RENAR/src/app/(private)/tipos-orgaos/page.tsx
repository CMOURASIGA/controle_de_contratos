import { SearchIcon } from "@/components/icons/search-icon";
import { UsersSquarePlusIcon } from "@/components/icons/users-square-plus";
import { Container } from "@/components/layouts/container";
import { CartaoAcaoPagina } from "@/components/layouts/ui/cards/cartao-acao-pagina";
import { PageHeader } from "@/components/layouts/ui/page-header";

export default function Home() {
  return (
    <div>
      <PageHeader title="Tipo Órgão" goBack />
      <Container>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CartaoAcaoPagina
            titulo="Criar Tipo Órgão"
            icone={<UsersSquarePlusIcon className="size-14" />}
            descricao="Crie um Órgão"
            href="/tipos-orgaos/novo"
          />

          <CartaoAcaoPagina
            titulo="Buscar Tipo Órgão"
            icone={<SearchIcon className="size-14" />}
            descricao="Faça uma busca com filtros"
            href="/tipos-orgaos/busca"
          />
        </div>
      </Container>
    </div>
  );
}
