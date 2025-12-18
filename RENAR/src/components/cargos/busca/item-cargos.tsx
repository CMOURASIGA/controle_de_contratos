"use client";

import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { Cargo } from "@/types/cargo.type";
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
  dados: Cargo;
}

export function ItemCargo({ dados }: ItemCargoProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          N° {dados?.codigo}
        </CardHeader>
        <CardContent className="flex flex-col flex-1 justify-between pt-4">
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <span className="block font-semibold text-slate-800">
                Descrição
              </span>
              <span>{dados?.descricao}</span>
            </div>
            <div>
              <span className="block font-semibold text-slate-800">
                Data de Cadastro
              </span>
              <span>{dados?.dataCadastro ? formatDateToDDMMYYYY(dados.dataCadastro) : ""}</span>
            </div>
            <div>
              <span className="block font-semibold text-slate-800">
                Data de Alteração
              </span>
              <span>{dados?.dataAlteracao ? formatDateToDDMMYYYY(dados.dataAlteracao) : ""}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-slate-600">
          <CardFooterItem>
            <Link
              href={`/cargos/${dados.codigo}`}
              className="hover:text-blue-800 transition-all"
              title="Visualizar cargos"
            >
              <SearchIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <Link
              className="hover:text-blue-800 transition-all"
              href={`/cargos/${dados.codigo}/editar`}
              title="Editar cargos"
            >
              <PencilIcon />
            </Link>
          </CardFooterItem>
        </CardFooter>
      </Card>
    </>
  );
}
