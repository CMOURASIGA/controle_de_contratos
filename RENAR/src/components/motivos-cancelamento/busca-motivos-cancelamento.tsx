"use client";

import CamposBuscaMotivosCancelamento from "./busca/campos-busca-motivos-cancelamento";
import { CabecalhoBuscaMotivosCancelamento } from "./cabecalhos/cabecalho-busca-motivos-cancelamento";
import { FiltrosMotivosCancelamentoProps } from "@/types/motivo-cancelamento.type";
import { GradeMotivosCancelamento } from "./grades/grade-motivos-cancelamento";
import { SearchBarContainer } from "../layouts/search-bar-container";
import { GridRepresentantesSkeleton } from "../layouts/representantes/grid-representantes-skeleton";
import useMotivosCancelamento from "@/hooks/motivos-cancelamento/use-motivos-cancelamento";
import Swal from "sweetalert2";
import { exportarMotivosCancelamento } from "@/services/motivos-cancelamento.service";

export function BuscaMotivosCancelamento() {
  const {
    motivosCancelamento,
    total,
    isFetching,
    executarBusca,
    filtros,
  } = useMotivosCancelamento();
  
    const handleExport = async () => {
      if (!motivosCancelamento || motivosCancelamento.length === 0) {
        Swal.fire({
          text: "Não há dados para exportar",
          icon: "warning",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      try {
        const blob = await exportarMotivosCancelamento(filtros);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `motivos-cancelamento-${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("Erro ao exportar:", error);
        const errorMessage = error instanceof Error
          ? error.message
          : "Erro ao exportar motivos de cancelamento";
        Swal.fire({
          text: errorMessage,
          icon: "error",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
      }
    };

  const handleSubmitBusca = (data: FiltrosMotivosCancelamentoProps) => {
    executarBusca(data);
  };

  return (
    <div>
      <CabecalhoBuscaMotivosCancelamento dados={motivosCancelamento} filtros={filtros} />
      <SearchBarContainer>
        <CamposBuscaMotivosCancelamento
          filtros={filtros}
          enviarFiltros={handleSubmitBusca}
          loading={isFetching}
          exportarRelatorio={handleExport}
        />
      </SearchBarContainer>
      <section className="px-6">
        {isFetching ? (
          <GridRepresentantesSkeleton />
        ) : (
          <GradeMotivosCancelamento
            itens={motivosCancelamento}
            total={total}
            isLoading={isFetching}
          />
        )}
      </section>
    </div>
  );
}

