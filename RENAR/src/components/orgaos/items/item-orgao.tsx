"use client";

import { DialogVerificacaoSkeleton } from "@/components/layouts/representantes/cards/card-representante/dialog-verificacao-skeleton";
import { ExclamationCircleIcon } from "@/components/layouts/ui/icons/exclamation-circle";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { TrashIcon } from "@/components/layouts/ui/icons/trash";
import {
  ExclusaoOrgaoResponse,
  OrgaoResponse,
  ValidacaoDelecaoOrgaosResponse,
} from "@/types/orgao.type";
import {
  Badge,
  BadgeVariant,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardFooterItem,
  CardHeader,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@cnc-ti/layout-basic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ItemOrgaoProps {
  dados: OrgaoResponse;
  visualizarAcao: (orgao: OrgaoResponse) => void;
  editarAcao: (orgao: OrgaoResponse) => void;
  excluirAcao: (id: number) => Promise<ExclusaoOrgaoResponse | null>;
  validarExclusao(id: number): Promise<ValidacaoDelecaoOrgaosResponse | null>;
}

const opcoesSituacao = [
  {
    label: "Ativo",
    value: "1",
  },
  {
    label: "Inativo",
    value: "0",
  },
  {
    label: "Aguardando Definição",
    value: "2",
  },
  {
    label: "Declinada",
    value: "3",
  },
];

export const getStatusLabel = (staAtiv?: number): string => {
  if (staAtiv === undefined || staAtiv === null) return "Desconhecido";
  const status = opcoesSituacao.find(
    (option) => option.value === String(staAtiv)
  );
  return status ? status.label : "Desconhecido";
};

const getStatusVariant = (staAtiv: number): BadgeVariant => {
  const statusValue = String(staAtiv);
  switch (statusValue) {
    case "1": // Ativo
      return "success";
    case "0": // Inativo
      return "default";
    case "2": // Aguardando Definição
      return "warning";
    case "3": // Declinada
      return "danger";
    default:
      return "default";
  }
};

export function ItemOrgao({
  dados,
  excluirAcao,
  validarExclusao,
}: ItemOrgaoProps) {
  const [isVerificando, setIsVerificando] = useState(false);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [validacao, setValidacao] =
    useState<ValidacaoDelecaoOrgaosResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleValidarExclusao = async () => {
    try {
      if (!validarExclusao) return;
      setDialogAberto(true);
      setIsVerificando(true);
      const resposta = await validarExclusao(dados.id);
      setValidacao(resposta);
    } catch (error) {
      console.error(error);
      setValidacao(null);
    } finally {
      setIsVerificando(false);
    }
  };

  const handleExcluir = async () => {
    if (!excluirAcao) return;

    setIsLoading(true);
    try {
      const response = await excluirAcao(dados?.id);
      if (!response?.error) {
        setDialogAberto(false);
        router.push("/orgaos/busca");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <span className="text-sm text-black">{dados?.sigla}</span>
          <Badge
            className="text-xs min-w-32 items-center text-center flex flex-row justify-center"
            variant={getStatusVariant(dados?.situacao)}
          >
            {getStatusLabel(dados?.situacao)}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 justify-between pt-4">
          <div className="w-full flex items-center justify-between mb-2 text-slate-600 text-xs">
            {dados?.tipoOrgao}
          </div>
          <div className="w-full flex items-center justify-between">
            <strong className="text-blue-900">{dados?.nome}</strong>
          </div>
        </CardContent>
        <CardFooter className="text-slate-600">
          <CardFooterItem>
            <Link
              href={`/orgaos/${dados.id}`}
              className="hover:text-blue-800 transition-all"
              title="Visualizar Órgão"
            >
              <SearchIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <Link
              className="hover:text-blue-800 transition-all"
              href={`/orgaos/${dados.id}/editar`}
              title="Editar Órgão"
            >
              <PencilIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <div
              onClick={() => handleValidarExclusao()}
              className="hover:text-red-800 transition-all cursor-pointer"
              title="Excluir Órgão"
            >
              <TrashIcon />
            </div>
          </CardFooterItem>
        </CardFooter>
      </Card>

      {isVerificando ? (
        <DialogVerificacaoSkeleton />
      ) : (
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent className="bg-white">
            <div className="flex flex-col items-center max-w-xl mx-auto mt-4 ">
              {validacao?.data?.podeSerDeletado ? (
                <>
                  <TrashIcon size="size-12 mb-4" />
                  <DialogTitle className="text-lg">
                    Confirmar exclusão
                  </DialogTitle>
                  <p className="text-center text-base">
                    Tem certeza que deseja excluir o Órgão{" "}
                    <strong>{dados?.nome}</strong>?
                    <br />
                    Esta ação não pode ser desfeita.
                  </p>
                </>
              ) : (
                <>
                  <ExclamationCircleIcon size="size-12" className="mb-4" />
                  <DialogTitle className="text-lg">
                    Não é possível excluir
                  </DialogTitle>
                  <p className="text-center text-base">
                    O Órgão <strong>{dados?.nome}</strong> não pode ser
                    excluído, pois o mesmo tem Órgão(s) ou Representação(ões)
                    vinculada(s).
                    <br />
                    Ele apenas pode ficar inativo para uso.
                    {validacao?.motivo && (
                      <>
                        <br />
                        <strong className="block mt-6">Motivo:</strong>{" "}
                        {validacao?.motivo}
                      </>
                    )}
                  </p>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                {validacao?.data?.podeSerDeletado === false
                  ? "Sair"
                  : "Não, cancelar."}
              </Button>
              {validacao?.data?.podeSerDeletado && (
                <Button
                  onClick={handleExcluir}
                  disabled={isLoading}
                  variant="danger"
                >
                  {" "}
                  {isLoading ? "Excluindo..." : "Sim, tenho certeza"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
