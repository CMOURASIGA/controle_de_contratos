"use client";

import { GridRepresentantesSkeleton } from "@/components/layouts/representantes/grid-representantes-skeleton";
import { SearchBarContainer } from "@/components/layouts/search-bar-container";
import useCargos from "@/hooks/dominios/use-cargos";
import { FiltrosCargosProps } from "@/services/dominios/cargos.service";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";
import { utils, writeFile } from "xlsx";
import { CabecalhoBuscaCargos } from "./cabecalho-busca-cargos";
import CamposBuscaCargos from "./campos-busca-cargos";
import { ResultCargos } from "./resultados-busca-cargos";

export function BuscaCargos() {
  const { cargos, total, filtros, isFetchingCargos, executarBusca } =
    useCargos();

  async function handleExportSearch() {
    const data = cargos.map((cargo) => {
      return {
        Codigo: cargo.codigo,
        Nome: cargo.descricao,
        "Data Cadastro": formatDateToDDMMYYYY(cargo.dataCadastro),
        "Data Alteração": formatDateToDDMMYYYY(cargo.dataAlteracao),
        "Criado Por": cargo.usuarioCadastro,
        "Alterado Por": cargo.usuarioAlteracao,
      };
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    ws["!cols"] = [{ wch: 20 }];

    utils.book_append_sheet(wb, ws, "Cargos Renar");
    writeFile(wb, "cargos-renar.xlsx");
  }

  const handleSubmitBusca = (data: FiltrosCargosProps) => {
    executarBusca(data);
  };

  return (
    <div>
      <CabecalhoBuscaCargos />
      <SearchBarContainer>
        <CamposBuscaCargos
          filtros={filtros}
          enviarFiltros={handleSubmitBusca}
          loading={isFetchingCargos}
          onExport={handleExportSearch}
        />
      </SearchBarContainer>
      <section className="px-6">
        {isFetchingCargos ? (
          <GridRepresentantesSkeleton />
        ) : (
          <ResultCargos
            itens={cargos}
            total={total}
            isLoading={isFetchingCargos}
          />
        )}
      </section>
    </div>
  );
}
