import { SearchIcon } from "@/components/icons/search-icon";
import { UsersSquarePlusIcon } from "@/components/icons/users-square-plus";
import { Container } from "@/components/layouts/container";
import { CartaoAcaoPagina } from "@/components/layouts/ui/cards/cartao-acao-pagina";
import { PageHeader } from "@/components/layouts/ui/page-header";

export const metadata = {
  title: "Representantes | RENAR",
};

export default function Home() {
  return (
    <>
      <PageHeader title="Representantes" />

      <Container>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CartaoAcaoPagina
            titulo="Criar Representante"
            icone={<UsersSquarePlusIcon className="size-14" />}
            //descricao="Faça uma busca com filtros"
            href="/representantes/novo"
          />

          <CartaoAcaoPagina
            titulo="Buscar Representante"
            icone={<SearchIcon className="size-14" />}
            //descricao="Faça uma busca com filtros"
            href="/representantes/buscar"
          />
        </div>
      </Container>
    </>
  );
}
