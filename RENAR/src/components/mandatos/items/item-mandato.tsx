import { useState } from "react";

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

import { DialogVerificacaoSkeleton } from "@/components/layouts/representantes/cards/card-representante/dialog-verificacao-skeleton";
import { ExclamationCircleIcon } from "@/components/layouts/ui/icons/exclamation-circle";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import { TrashIcon } from "@/components/layouts/ui/icons/trash";
import {
  ExcluirMandato,
  validarExclusaoMandato,
  type ValidarExclusaoMandatoResponse,
} from "@/services/mandatos.service";
import type { Mandato } from "@/services/representantes.service";
import SearchIcon from "@/components/layouts/ui/icons/search";

interface ItemMandatoProps {
  dados: Mandato;
  refetch: () => void;
}

const getStatusLabel = (status?: number) => {
  if (status === undefined || status === null) {
    return "Desconhecido";
  }

  switch (status) {
    case -1:
      return "A vencer";
    case 0:
      return "Vencido";
    default:
      return "Desconhecido";
  }
};

const getStatusVariant = (status?: number): BadgeVariant => {
  if (status === undefined || status === null) {
    return "default";
  }

  switch (status) {
    case -1:
      return "warning";
    case 0:
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

export function ItemMandato({ dados, refetch }: ItemMandatoProps) {
  const dataInicio =
    (dados as { dataInicio?: string | Date })?.dataInicio ??
    dados.dataInicioMandato;
  const dataFim =
    (dados as { dataFim?: string | Date })?.dataFim ?? dados.dataFimMandato;
  const representacaoNome =
    dados.representacao?.nome ??
    (dados.representacao as { descricao?: string })?.descricao ??
    "Representação não informada";
  const tipoMandatoDescricao =
    dados.tipoMandato?.descricao ??
    (dados.tipoMandato as { nome?: string })?.nome ??
    "-";
  const [isLoading, setIsLoading] = useState(false);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [isVerificando, setIsVerificando] = useState(false);
  const [validacao, setValidacao] =
    useState<ValidarExclusaoMandatoResponse | null>(null);
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [erroExclusao, setErroExclusao] = useState<string | null>(null);

  const handleDialogChange = (aberto: boolean) => {
    setDialogAberto(aberto);
    if (!aberto) {
      setValidacao(null);
      setErroValidacao(null);
      setErroExclusao(null);
      setIsVerificando(false);
    }
  };

  const handleValidarExclusao = async () => {
    setDialogAberto(true);
    setIsVerificando(true);
    setValidacao(null);
    setErroValidacao(null);
    setErroExclusao(null);

    try {
      const resposta = await validarExclusaoMandato(dados.id);
      setValidacao(resposta);
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível validar a exclusão.";
      setErroValidacao(mensagem);
    } finally {
      setIsVerificando(false);
    }
  };

  const handleExcluir = async () => {
    setIsLoading(true);
    setErroExclusao(null);
    try {
      await ExcluirMandato(dados?.id);
      setDialogAberto(false);
      refetch();
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o mandato.";
      setErroExclusao(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="pt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <span className="text-sm text-black">Nº {dados.id}</span>
          <Badge
            className="text-xs min-w-32 items-center text-center flex flex-row justify-center"
            variant={getStatusVariant(dados.situacao)}
          >
            {getStatusLabel(dados.situacao)}
          </Badge>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 justify-between pt-4">
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <span className="block font-semibold text-slate-800">
                Representação / Evento
              </span>
              <span>{representacaoNome}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <span className="block font-semibold text-slate-800">
                  Tipo Mandato / Evento
                </span>
                <span className="text-xs">{tipoMandatoDescricao}</span>
              </div>

              <div>
                <span className="block font-semibold text-slate-800">Tipo</span>
                <span>
                  {dados.tipoLancamento === "M"
                    ? "Mandato"
                    : dados.tipoLancamento === "E"
                    ? "Evento"
                    : "-"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <span className="block font-semibold text-slate-800">
                  Início
                </span>
                <span>{formatarData(dataInicio)}</span>
              </div>
              <div>
                <span className="block font-semibold text-slate-800">Fim</span>
                <span>{formatarData(dataFim)}</span>
              </div>
            </div>

            <div>
              <span className="block font-semibold text-slate-800">
                Nome da indicação
              </span>
              <span>{dados.nomeIndicacao ?? "-"}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="text-slate-600">
          <CardFooterItem>
            <Link
              href={`/mandatos/${dados.id}/visualizar`}
              className="hover:text-blue-800 transition-all"
              title="Visualizar Mandato"
            >
              <SearchIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <Link
              href={`/mandatos/${dados.id}/editar`}
              className="hover:text-blue-800 transition-all"
              title="Editar Mandato"
            >
              <PencilIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <button
              onClick={handleValidarExclusao}
              className="hover:text-red-800 transition-all"
              title="Excluir Mandato"
              disabled={isVerificando}
            >
              <TrashIcon />
            </button>
          </CardFooterItem>
        </CardFooter>
      </Card>

      {isVerificando ? (
        <DialogVerificacaoSkeleton />
      ) : (
        <Dialog open={dialogAberto} onOpenChange={handleDialogChange}>
          <DialogContent className="bg-white">
            <div className="flex flex-col items-center max-w-xl mx-auto mt-4 ">
              {validacao?.podeExcluir ? (
                <>
                  <TrashIcon size="size-12 mb-4" />
                  <DialogTitle className="text-lg">
                    Confirmar exclusão
                  </DialogTitle>
                  <p className="text-center text-base">
                    Tem certeza que deseja excluir o mandato de número{" "}
                    <strong>{dados?.id}</strong>?
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
                    Este mandato não pode ser excluído no momento.
                    {validacao?.motivo && (
                      <>
                        <br />
                        <strong className="block mt-6">Motivo:</strong>{" "}
                        {validacao.motivo}
                      </>
                    )}
                  </p>
                </>
              )}

              {erroValidacao && (
                <p className="mt-4 text-sm text-red-600 text-center">
                  {erroValidacao}
                </p>
              )}

              {erroExclusao && (
                <p className="mt-4 text-sm text-red-600 text-center">
                  {erroExclusao}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleDialogChange(false)}
              >
                {validacao?.podeExcluir === false ? "Sair" : "Não, cancelar."}
              </Button>
              {validacao?.podeExcluir && (
                <Button
                  onClick={handleExcluir}
                  disabled={isLoading}
                  variant="danger"
                >
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
