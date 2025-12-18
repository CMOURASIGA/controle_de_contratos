"use client";

import CamposBuscaTiposMandato from "./busca/campos-busca-tipos-mandato";
import { CabecalhoBuscaTiposMandato } from "./cabecalhos/cabecalho-busca-tipos-mandato";
import { FiltrosTiposMandatoProps } from "@/types/tipo-mandato.type";
import { GradeTiposMandato } from "./grades/grade-tipos-mandato";
import { SearchBarContainer } from "../layouts/search-bar-container";
import { GridRepresentantesSkeleton } from "../layouts/representantes/grid-representantes-skeleton";
import useTiposMandato from "@/hooks/tipos-mandato/use-tipos-mandato";
import { useState } from "react";
import Swal from "sweetalert2";
import { exportarTiposMandato } from "@/services/tipos-mandato.service";

export function BuscaTiposMandato() {
  const {
    tiposMandato,
    total,
    isFetching,
    executarBusca,
    filtros,
  } = useTiposMandato();
  const [, setIsExporting] = useState(false);

  const handleExport = async () => {
      if (!tiposMandato || tiposMandato.length === 0) {
        Swal.fire({
          text: "Não há dados para exportar",
          icon: "warning",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
  
      setIsExporting(true);
      try {
        const blob = await exportarTiposMandato(filtros);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `tipos-mandato-${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("Erro ao exportar:", error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Erro ao exportar tipos de mandato";
        Swal.fire({
          text: errorMessage,
          icon: "error",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        setIsExporting(false);
      }
    };

  const handleSubmitBusca = (data: FiltrosTiposMandatoProps) => {
    executarBusca(data);
  };

  return (
    <div>
      <CabecalhoBuscaTiposMandato dados={tiposMandato} filtros={filtros} />
      <SearchBarContainer>
        <CamposBuscaTiposMandato
          filtros={filtros}
          enviarFiltros={handleSubmitBusca}
          loading={isFetching}
          handleExport={handleExport}
        />
      </SearchBarContainer>
      <section className="px-6">
        {isFetching ? (
          <GridRepresentantesSkeleton />
        ) : (
          <GradeTiposMandato
            itens={tiposMandato}
            total={total}
            isLoading={isFetching}
          />
        )}
      </section>
    </div>
  );
}

