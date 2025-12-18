"use client";

import { DollarIcon } from "@/components/layouts/ui/icons/circle-dollar";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { TrashIcon } from "@/components/layouts/ui/icons/trash";
import { Atividade } from "@/types/atividade.type";
import {
  Badge,
  Card,
  CardContent,
  CardFooter,
  CardFooterItem,
  CardHeader,
} from "@cnc-ti/layout-basic";
import Link from "next/link";

interface ItemAtividadeProps {
  dados: Atividade;
  excluir: (atividade: Atividade) => void;
}

export default function ItemAtividade({ dados, excluir }: ItemAtividadeProps) {
  const getStatusLabel = (status?: number) => {
    if (status === undefined || status === null) return "Desconhecido";
    switch (status) {
      case 0:
        return "Nova";
      case 1:
        return "Validada";
      case 2:
        return "Cancelada";
      case 3:
        return "Cancelada/Validada";
      default:
        return "Desconhecido";
    }
  };

  const getStatusVariant = (status?: number) => {
    if (status === undefined || status === null) {
      return "default";
    }

    switch (status) {
      case 0:
        return "warning";
      case 1:
        return "success";
      case 2:
      case 3:
        return "danger";
      default:
        return "default";
    }
  };

  const formatarData = (data?: Date | string | null) => {
    if (!data) return "-";

    const dataObj = typeof data === "string" ? new Date(data) : data;
    if (Number.isNaN(dataObj.getTime())) {
      return "-";
    }

    return dataObj.toLocaleDateString("pt-BR");
  };

  return (
    <>
      <Card className="pt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <span className="text-sm text-black">Nº {dados.id}</span>
          {dados.statusAtividade !== undefined && (
            <Badge
              className="text-xs min-w-32 items-center text-center flex flex-row justify-center"
              variant={getStatusVariant(dados.statusAtividade)}
            >
              {getStatusLabel(dados.statusAtividade)}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="flex flex-col flex-1 justify-between pt-4">
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <span className="block font-semibold text-slate-800">
                Descrição da atividade
              </span>
              <span>{dados.descricaoAtividade}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <span className="block font-semibold text-slate-800">
                  Início
                </span>
                <span>{formatarData(dados.dataInicioAtividade)}</span>
              </div>
              <div>
                <span className="block font-semibold text-slate-800">Fim</span>
                <span>{formatarData(dados.dataFimAtividade)}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="text-slate-600">
          <CardFooterItem>
            <Link
              href={`/atividades/${dados.id}`}
              className="hover:text-blue-800 transition-all"
              title="Visualizar Atividade"
            >
              <SearchIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <Link
              href={`/atividades/editar/${dados.id}`}
              className="hover:text-blue-800 transition-all"
              title="Editar Atividade"
            >
              <PencilIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <Link
              href={`/atividades/editar/${dados.id}?tab=prestacao_contas`}
              className="hover:text-blue-800 transition-all"
              title="Prestação de Contas"
            >
              <DollarIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <button
              onClick={() => excluir(dados)}
              className="hover:text-red-800 transition-all"
              title="Excluir Atividade"
            >
              <TrashIcon />
            </button>
          </CardFooterItem>
        </CardFooter>
      </Card>
    </>
  );
}
