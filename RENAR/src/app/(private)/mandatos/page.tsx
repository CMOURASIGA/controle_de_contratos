import { SearchIcon } from "@/components/icons/search-icon";
import { UsersSquarePlusIcon } from "@/components/icons/users-square-plus";
import { Container } from "@/components/layouts/container";
import { CartaoAcaoPagina } from "@/components/layouts/ui/cards/cartao-acao-pagina";
import { PageHeader } from "@/components/layouts/ui/page-header";

export default function Home() {
  return (
    <div>
      <PageHeader title="Mandatos" goBack />
      <Container>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CartaoAcaoPagina
            titulo="Criar Mandato"
            icone={<UsersSquarePlusIcon className="size-14" />}
            descricao="Crie um Mandato"
            href="/mandatos/novo"
          />

          <CartaoAcaoPagina
            titulo="Buscar Mandatos"
            icone={<SearchIcon className="size-14" />}
            descricao="Faça uma busca com filtros"
            href="/mandatos/busca"
          />
        </div>
      </Container>
    </div>
  );
}
