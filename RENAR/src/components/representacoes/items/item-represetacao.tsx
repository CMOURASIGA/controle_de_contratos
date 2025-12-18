import {
  Badge,
  BadgeVariant,
  Card,
  CardContent,
  CardFooter,
  CardFooterItem,
  CardHeader,
} from "@cnc-ti/layout-basic";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { TrashIcon } from "@/components/layouts/ui/icons/trash";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import { Representacao } from "@/types/representacao.type";
import Link from "next/link";

interface ItemRepresentacaoProps {
  dados: Representacao;
  excluirAcao: (representacao: Representacao) => void;
}

// Função para obter o rótulo com base no statusSituacao
const getStatusLabel = (statusSituacao: "ATIVO" | "INATIVO" | "AGUARDANDO" | "DECLINADO" | null | undefined): string => {
  if (!statusSituacao) return "Desconhecido";

  switch (statusSituacao) {
    case "ATIVO":
      return "Ativo";
    case "INATIVO":
      return "Inativo";
    case "AGUARDANDO":
      return "Aguardando";
    case "DECLINADO":
      return "Declinado";
    default:
      return "Desconhecido";
  }
};

// Função para obter a variante do badge com base no statusSituacao
const getStatusVariant = (statusSituacao: "ATIVO" | "INATIVO" | "AGUARDANDO" | "DECLINADO" | null | undefined): BadgeVariant => {
  if (!statusSituacao) return "default";

  switch (statusSituacao) {
    case "ATIVO":
      return "success";
    case "INATIVO":
      return "default";
    case "AGUARDANDO":
      return "warning";
    case "DECLINADO":
      return "danger";
    default:
      return "default";
  }
};

export function ItemRepresentacao({
  dados,
  excluirAcao,
}: ItemRepresentacaoProps) {
  return (
    <Card className={`pt-4 `}>
      <CardHeader className="flex flex-row items-center justify-between">
        <span className="text-sm text-black">{dados?.sigla}</span>
        <Badge
          className="text-xs min-w-32 items-center text-center flex flex-row justify-center"
          variant={getStatusVariant(dados?.statusSituacao)}
        >
          {getStatusLabel(dados?.statusSituacao)}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-between pt-4">
        <div className="w-full flex items-center justify-between">
          <strong className="text-blue-900">{dados?.nome}</strong>
        </div>
      </CardContent>
      <CardFooter className="text-slate-600">
        <CardFooterItem>
          <Link
            href={`/representacoes/${dados.idRepresentacao}`}
            className="hover:text-blue-800 transition-all"
            title="Visualizar Representação"
          >
            <SearchIcon />
          </Link>
        </CardFooterItem>
        <CardFooterItem>
          <Link
            className="hover:text-blue-800 transition-all"
            href={`/representacoes/editar/${dados.idRepresentacao}`}
            title="Editar Representação"
          >
            <PencilIcon />
          </Link>
        </CardFooterItem>
        <CardFooterItem>
          <div
            onClick={() => excluirAcao(dados)}
            className="hover:text-red-800 transition-all cursor-pointer"
            title="Excluir Representação"
          >
            <TrashIcon />
          </div>
        </CardFooterItem>
      </CardFooter>
    </Card>
  );
}
