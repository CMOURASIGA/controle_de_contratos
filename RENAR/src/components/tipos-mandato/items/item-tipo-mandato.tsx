"use client";

import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { TipoMandatoResponse } from "@/types/tipo-mandato.type";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";
import {
  Card,
  CardContent,
  CardFooter,
  CardFooterItem,
  CardHeader,
} from "@cnc-ti/layout-basic";
import Link from "next/link";

interface ItemTipoMandatoProps {
  dados: TipoMandatoResponse;
  visualizarAcao: (tipo: TipoMandatoResponse) => void;
  editarAcao: (tipo: TipoMandatoResponse) => void;
}

export function ItemTipoMandato({
  dados,
}: ItemTipoMandatoProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <span className="text-sm text-black"># {dados.idTipoMandato}</span>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-between pt-4">
        <div className="w-full flex items-center justify-between mb-4">
          <strong className="text-blue-900">{dados.descricao}</strong>
        </div>
        <div className="mb-2">
          <span className="block font-semibold text-slate-800">
            Data de Cadastro
          </span>
          <span>{dados?.dataCadastro ? formatDateToDDMMYYYY(dados.dataCadastro) : "Não informado"}</span>
        </div>
        <div>
          <span className="block font-semibold text-slate-800">
            Data de Alteração
          </span>
          <span>{dados?.dataAlteracao ? formatDateToDDMMYYYY(dados.dataAlteracao) : "Não alterado"}</span>
        </div>
      </CardContent>
      <CardFooter className="text-slate-600">
        <CardFooterItem>
          <Link
            href={`/tipos-mandato/${dados.idTipoMandato}`}
            className="hover:text-blue-800 transition-all"
            title="Visualizar Tipo de Mandato"
          >
            <SearchIcon />
          </Link>
        </CardFooterItem>
        <CardFooterItem>
          <Link
            className="hover:text-blue-800 transition-all"
            href={`/tipos-mandato/${dados.idTipoMandato}/editar`}
            title="Editar Tipo de Mandato"
          >
            <PencilIcon />
          </Link>
        </CardFooterItem>
      </CardFooter>
    </Card>
  );
}

