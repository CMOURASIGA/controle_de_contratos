"use client";
import {
  PageHeader,
  PageHeaderTitleContent,
  PageHeaderTitle,
} from "@cnc-ti/layout-basic";
import { ButtonBack } from "@/components/layouts/ui/buttons/button-back/button-back";
import { useQueryString } from "@/hooks/useQueryParams";
import { usePathname } from "next/navigation";

export function RepresentantesPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { getAllQueryStrings } = useQueryString();
  const pathname = usePathname();
  const { representanteId } = getAllQueryStrings();

  // Mostra botão de voltar se:
  // - Está em modo de edição (sempre tem ID nos params)
  // - Está em modo de cadastro E tem representanteId na query string
  const isEditMode = pathname?.includes("/editar");
  const showBackButton = isEditMode || !!representanteId;

  return (
    <PageHeader className="flex flex-col gap-y-6 lg:flex-row">
      <PageHeaderTitleContent className="flex flex-col lg:flex-row gap-6 items-center">
        {showBackButton && <ButtonBack />}
        <div className="flex flex-col lg:flex-row w-full items-center gap-4 lg:gap-6 text-center lg:text-start">
          <PageHeaderTitle title={title} description={description} />
        </div>
      </PageHeaderTitleContent>
    </PageHeader>
  );
}
