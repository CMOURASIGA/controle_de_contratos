"use client";

import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { TipoOrgaos } from "@/services/orgaos/tipo-orgaos.service";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";
import {
  Card,
  CardContent,
  CardFooter,
  CardFooterItem,
  CardHeader,
} from "@cnc-ti/layout-basic";
import Link from "next/link";

interface ItemCargoProps {
  dados: TipoOrgaos;
}

export function ItemTipoOrgao({ dados }: ItemCargoProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          N° {dados?.id}
        </CardHeader>
        <CardContent className="flex flex-col flex-1 justify-between pt-4">
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <span className="block font-semibold text-slate-800">
                Descrição
              </span>
              <span>{dados?.nome}</span>
            </div>
            <div>
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
          </div>
        </CardContent>
        <CardFooter className="text-slate-600">
          <CardFooterItem>
            <Link
              href={`/tipos-orgaos/${dados.id}`}
              className="hover:text-blue-800 transition-all"
              title="Visualizar tipo Órgão"
            >
              <SearchIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <Link
              className="hover:text-blue-800 transition-all"
              href={`/tipos-orgaos/${dados.id}/editar`}
              title="Editar Tipo Órgão"
            >
              <PencilIcon />
            </Link>
          </CardFooterItem>
        </CardFooter>
      </Card>
    </>
  );
}
