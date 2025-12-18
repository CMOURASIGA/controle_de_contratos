import { SearchIcon } from "@/components/icons/search-icon";
import { UsersSquarePlusIcon } from "@/components/icons/users-square-plus";
import { Container } from "@/components/layouts/container";
import { CartaoAcaoPagina } from "@/components/layouts/ui/cards/cartao-acao-pagina";
import { PageHeader } from "@/components/layouts/ui/page-header";

export function AcessoRapidoAtividades() {
    return (
        <>
            <PageHeader title="Atividades" />
            <Container>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <CartaoAcaoPagina
                        titulo="Criar Atividade"
                        descricao="Cadastre uma nova atividade operacional"
                        icone={<UsersSquarePlusIcon className="size-14" />}
                        href="/atividades/novo"
                    />
                    <CartaoAcaoPagina
                        titulo="Buscar Atividades"
                        descricao="Encontre atividades existentes"
                        icone={<SearchIcon className="size-14" />}
                        href="/atividades/buscar"
                    />
                </div>
            </Container>
        </>
    );
}

