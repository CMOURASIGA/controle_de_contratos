import { ButtonBack } from "@/components/layouts/ui/buttons/button-back/button-back";
import {
  Button,
  PageHeader,
  PageHeaderTitle,
  PageHeaderTitleContent,
} from "@cnc-ti/layout-basic";
import Link from "next/link";
import { TipoMandatoResponse } from "@/types/tipo-mandato.type";
import { FiltrosTiposMandatoProps } from "@/types/tipo-mandato.type";

interface CabecalhoBuscaTiposMandatoProps {
  dados?: TipoMandatoResponse[];
  filtros?: FiltrosTiposMandatoProps;
}

export function CabecalhoBuscaTiposMandato({
  dados,
  filtros,
}: CabecalhoBuscaTiposMandatoProps) {

  return (
    <PageHeader className="flex flex-col gap-y-6 lg:flex-row items-center">
      <PageHeaderTitleContent className="flex flex-col lg:flex-row gap-6 items-center">
        <ButtonBack />
        <div className="flex flex-col lg:flex-row w-full items-center gap-4 lg:gap-6 text-center lg:text-start">
          <PageHeaderTitle
            title="Buscar Tipos de Mandato"
            description="Página de busca de tipos de mandato"
          />
        </div>
      </PageHeaderTitleContent>
      <div>
        {/* {dados && dados.length > 0 && (
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className={`flex flex-row items-center gap-2 relative px-3 py-2 text-[#00247d]
              bg-white rounded-lg border border-gray-200 
              hover:text-gray-900 shadow-xs transition-all
              hover:bg-gray-200
              ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isExporting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-[#00247d]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-xs font-medium">Exportando...</p>
              </>
            ) : (
              <>
                <ExportIcon />
                <p className="text-xs font-medium">Exportar</p>
              </>
            )}
          </button>
        )} */}
        <Button variant="create" className="font-semibold ">
          <Link href="/tipos-mandato/novo">Novo tipo</Link>
        </Button>
      </div>
    </PageHeader>
  );
}

