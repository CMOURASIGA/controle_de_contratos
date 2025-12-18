"use client";

import { CabecalhoBusca } from "@/components/layouts/cabecalho-busca";
import useTipoOrgao from "@/hooks/orgaos/use-tipo-orgaos";
import { FiltrosTipoOrgaosProps } from "@/services/orgaos/tipo-orgaos.service";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";
import { utils, writeFile } from "xlsx";
import { GridRepresentantesSkeleton } from "../../layouts/representantes/grid-representantes-skeleton";
import { SearchBarContainer } from "../../layouts/search-bar-container";
import CamposBuscaTipoOrgaos from "./campos-busca-tipo-orgaos";
import { ResultTipoOrgao } from "./resultados-busca-tipo-orgaos";

export default function BuscaTipoOrgaos() {
  const { tipoOrgaos, isFetchingTipoOrgaos, total, executarBusca, filtros } =
    useTipoOrgao();

  const handleSubmitBusca = (data: FiltrosTipoOrgaosProps) => {
    executarBusca(data);
  };

  async function handleExportSearch() {
    const data = tipoOrgaos.map((tipoOrgao) => {
      return {
        ID: tipoOrgao.id,
        Nome: tipoOrgao.nome,
        "Data Cadastro": formatDateToDDMMYYYY(tipoOrgao.dataCadastro),
        "Data Alteração": formatDateToDDMMYYYY(tipoOrgao.dataAlteracao),
        "Criado Por": tipoOrgao.usuarioCadastro,
        "Alterado Por": tipoOrgao.usuarioAlteracao,
      };
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    ws["!cols"] = [{ wch: 20 }];

    utils.book_append_sheet(wb, ws, "Tipos Orgaos Renar");
    writeFile(wb, "tipos-orgaos-renar.xlsx");
  }

  return (
    <div>
      <CabecalhoBusca
        title={"Tipo Órgãos"}
        description={"Página de busca de tipos de órgãos."}
        hrefButton={"/tipos-orgaos/novo"}
        titleButton={"Novo Tipo Órgão"}
      />
      <SearchBarContainer>
        <CamposBuscaTipoOrgaos
          filtros={filtros}
          enviarFiltros={handleSubmitBusca}
          loading={isFetchingTipoOrgaos}
          onExport={handleExportSearch}
        />
      </SearchBarContainer>
      <section className="px-6">
        {isFetchingTipoOrgaos ? (
          <GridRepresentantesSkeleton />
        ) : (
          <ResultTipoOrgao
            itens={tipoOrgaos}
            total={total}
            isLoading={isFetchingTipoOrgaos}
          />
        )}
      </section>
    </div>
  );
}
