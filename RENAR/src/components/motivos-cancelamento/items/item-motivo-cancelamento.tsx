"use client";

import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { MotivoCancelamentoResponse } from "@/types/motivo-cancelamento.type";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";
import {
  Card,
  CardContent,
  CardFooter,
  CardFooterItem,
  CardHeader,
  Badge,
  BadgeVariant,
} from "@cnc-ti/layout-basic";
import Link from "next/link";

interface ItemMotivoCancelamentoProps {
  dados: MotivoCancelamentoResponse;
  visualizarAcao: (motivo: MotivoCancelamentoResponse) => void;
  editarAcao: (motivo: MotivoCancelamentoResponse) => void;
}

const opcoesStatus = [
  {
    label: "Ativo",
    value: "1",
  },
  {
    label: "Inativo",
    value: "0",
  },
];

export const getStatusLabel = (status?: number): string => {
  if (status === undefined || status === null) return "Desconhecido";
  const statusOption = opcoesStatus.find(
    (option) => option.value === String(status)
  );
  return statusOption ? statusOption.label : "Desconhecido";
};

const getStatusVariant = (status: number): BadgeVariant => {
  const statusValue = String(status);
  switch (statusValue) {
    case "1": // Ativo
      return "success";
    case "0": // Inativo
      return "default";
    default:
      return "default";
  }
};

export function ItemMotivoCancelamento({
  dados,
}: ItemMotivoCancelamentoProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <span className="text-sm text-black"># {dados.id}</span>
        <Badge
          variant={getStatusVariant(dados.status)}
        >
          {getStatusLabel(dados.status)}
        </Badge>
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
            href={`/motivos-cancelamento/${dados.id}`}
            className="hover:text-blue-800 transition-all"
            title="Visualizar Motivo de Cancelamento"
          >
            <SearchIcon />
          </Link>
        </CardFooterItem>
        <CardFooterItem>
          <Link
            className="hover:text-blue-800 transition-all"
            href={`/motivos-cancelamento/${dados.id}/editar`}
            title="Editar Motivo de Cancelamento"
          >
            <PencilIcon />
          </Link>
        </CardFooterItem>
      </CardFooter>
    </Card>
  );
}

