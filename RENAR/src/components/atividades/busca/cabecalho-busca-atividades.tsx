import { ButtonBack } from "@/components/layouts/ui/buttons/button-back/button-back";
import {
    Button,
    PageHeader,
    PageHeaderTitle,
    PageHeaderTitleContent,
} from "@cnc-ti/layout-basic";
import Link from "next/link";

export default function CabecalhoBuscaAtividades() {
  return (
    <PageHeader className="flex flex-col gap-y-6 lg:flex-row items-center">
        <PageHeaderTitleContent className="flex flex-col lg:flex-row gap-6 items-center">
            <ButtonBack />
            <div className="flex flex-col lg:flex-row w-full items-center gap-4 lg:gap-6 text-center lg:text-start">
                <PageHeaderTitle
                    title="Buscar Atividades"
                    description="Página de busca de atividades"
                />
            </div>
        </PageHeaderTitleContent>
        <div>
            <Button variant="create" className="font-semibold">
                <Link href="/atividades/novo">Nova Atividade</Link>
            </Button>
        </div>
    </PageHeader>
  );
}