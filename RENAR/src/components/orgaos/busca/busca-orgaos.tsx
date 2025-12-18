"use client";

import useOrgaos from "@/hooks/orgaos/use-orgaos";
import { FiltrosOrgaosProps } from "@/services/orgaos/orgaos.service";
import { GridRepresentantesSkeleton } from "../../layouts/representantes/grid-representantes-skeleton";
import { SearchBarContainer } from "../../layouts/search-bar-container";
import { CabecalhoBuscaOrgaos } from "../cabecalhos/cabecalho-busca-orgaos";
import { GradeOrgaos } from "../grades/grade-orgaos";
import CamposBuscaOrgaos from "./campos-busca-orgaos";

export function BuscaOrgaos() {
  const {
    orgaos,
    total,
    isFetching,
    executarBusca,
    filtros,
    validarExclusao,
    handleDeleteOrgao,
  } = useOrgaos();

  const handleSubmitBusca = (data: FiltrosOrgaosProps) => {
    executarBusca(data);
  };

  return (
    <div>
      <CabecalhoBuscaOrgaos />
      <SearchBarContainer>
        <CamposBuscaOrgaos
          filtros={filtros}
          enviarFiltros={handleSubmitBusca}
          loading={isFetching}
        />
      </SearchBarContainer>
      <section className="px-6">
        {isFetching ? (
          <GridRepresentantesSkeleton />
        ) : (
          <GradeOrgaos
            itens={orgaos}
            total={total}
            isLoading={isFetching}
            validarExclusao={validarExclusao}
            handleDeleteOrgao={handleDeleteOrgao}
          />
        )}
      </section>
    </div>
  );
}
