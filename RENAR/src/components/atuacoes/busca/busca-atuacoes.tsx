"use client";

import { GridRepresentantesSkeleton } from "@/components/layouts/representantes/grid-representantes-skeleton";
import { SearchBarContainer } from "@/components/layouts/search-bar-container";
import useAtuacoes from "@/hooks/use-atuacao";
import { FiltrosAtuacoesProps } from "@/services/atuacoes.service";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";
import { utils, writeFile } from "xlsx";
import { CabecalhoBusca } from "../../layouts/cabecalho-busca";
import CamposBuscaAtuacao from "./campos-busca-atuacoes";
import { ResultAtuacoes } from "./resultados-busca-atuacoes";

export function BuscaAtuacoes() {
  const { atuacoes, total, filtros, isFetching, executarBusca } = useAtuacoes();

  async function handleExportSearch() {
    const data = atuacoes.map((atuacao) => {
      return {
        Nome: atuacao.nome,
        Descricao: atuacao.descricao,
        "Data Cadastro": formatDateToDDMMYYYY(atuacao.dataCadastro),
        "Data Alteração": formatDateToDDMMYYYY(atuacao.dataAlteracao),
        "Criado Por": atuacao.usuarioCadastro,
        "Alterado Por": atuacao.usuarioAlteracao,
      };
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    ws["!cols"] = [{ wch: 20 }];

    utils.book_append_sheet(wb, ws, "Tipo Perfil Renar");
    writeFile(wb, "tipo-perfil-renar.xlsx");
  }

  const handleSubmitBusca = (data: FiltrosAtuacoesProps) => {
    executarBusca(data);
  };

  return (
    <div>
      <CabecalhoBusca
        title={"Tipo Perfil"}
        description={"Página de busca de tipo perfil."}
        hrefButton={"/tipo-perfil/novo"}
        titleButton={"Novo tipo perfil"}
      />
      <SearchBarContainer>
        <CamposBuscaAtuacao
          filtros={filtros}
          enviarFiltros={handleSubmitBusca}
          loading={isFetching}
          onExport={handleExportSearch}
        />
      </SearchBarContainer>
      <section className="px-6">
        {isFetching ? (
          <GridRepresentantesSkeleton />
        ) : (
          <ResultAtuacoes
            itens={atuacoes}
            total={total}
            isLoading={isFetching}
          />
        )}
      </section>
    </div>
  );
}
