"use client";

import { BarraBuscaRepresentantes } from "@/components/layouts/representantes/barra-busca-representantes";
import { ListaResultadosRepresentantes } from "@/components/layouts/representantes/lista-resultados-representantes";
import { SearchBarContainer } from "@/components/layouts/search-bar-container";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { useRepresentantes } from "@/hooks/representantes/use-representantes";
import { FormBuscaRepresentantes } from "@/types/representante";
import { Button } from "@cnc-ti/layout-basic";
import Link from "next/link";

export function PaginaBuscaRepresentantes() {
  const { isLoading, representantes, totalResultados, buscarRepresentantes, excluirRepresentante, validarExclusao } =
    useRepresentantes();

  const handleSubmitBusca = (data: FormBuscaRepresentantes) => {
    buscarRepresentantes(data);
  };

  return (
    <>
      <PageHeader
        title="Buscar Representantes"
        description="Localize representantes cadastrados utilizando filtros avançados."
      >
        <Link href="/representantes/novo">
          <Button className="font-semibold">Novo Representante</Button>
        </Link>
      </PageHeader>

      <SearchBarContainer>
        <BarraBuscaRepresentantes onSubmit={handleSubmitBusca} />
      </SearchBarContainer>

      <ListaResultadosRepresentantes
        representantes={representantes}
        total={totalResultados}
        isLoading={isLoading}
        excluirRepresentante={excluirRepresentante}
        validarExclusao={validarExclusao}
      />
    </>
  );
}
