"use client";
import { ExclamationCircleIcon } from "@/components/layouts/ui/icons/exclamation-circle";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { TrashIcon } from "@/components/layouts/ui/icons/trash";
import {
  ExcluirRepresentanteResponse,
  ValidarExclusaoResponse,
} from "@/services/representantes.service";
import { Representante } from "@/types/representante";
import {
  Badge,
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
import { useState } from "react";
import { DialogVerificacaoSkeleton } from "./dialog-verificacao-skeleton";

interface CardRepresentanteProps {
  data: Representante;
  onDelete?: (id: number) => Promise<ExcluirRepresentanteResponse | null>;
  onValidarExclusao?: (id: number) => Promise<ValidarExclusaoResponse | null>;
}

export function CardRepresentante({
  data: representante,
  onDelete,
  onValidarExclusao,
}: CardRepresentanteProps) {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [validacao, setValidacao] = useState<ValidarExclusaoResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificando, setIsVerificando] = useState(false);

  const handleValidarExclusao = async () => {
    try {
      if (!onValidarExclusao) return;
      setDialogAberto(true);
      setIsVerificando(true);
      const resposta = await onValidarExclusao(representante.id);
      setValidacao(resposta);
    } catch (error) {
      console.error(error);
      setValidacao(null);
    } finally {
      setIsVerificando(false);
    }
  };

  const handleExcluir = async () => {
    if (!onDelete) return;

    setIsLoading(true);
    try {
      const resposta = await onDelete(representante.id);
      if (resposta?.sucesso) {
        setDialogAberto(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className={`pt-4`}>
        <CardHeader className="flex flex-col items-start">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="block text-xs text-slate-600">
              Nº {representante.id}
            </span>

            <Badge
              size="sm"
              variant={
                representante.representante.ativo ? "success" : "default"
              }
            >
              {representante.representante.ativo ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          <div className="w-full flex items-center justify-between">
            <strong
              className={`${
                !representante.representante.ativo
                  ? "text-gray-400"
                  : "text-blue-900"
              }`}
            >
              {representante.nome}
            </strong>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 justify-between pt-4">
          <div className="space-y-4">
            <div>
              <strong className="flex items-center gap-2 text-sm">
                Profissão
              </strong>
              <p className="text-xs mt-1">
                {representante?.representante?.profissao?.nome}
              </p>
            </div>
            <div>
              <strong className="flex items-center gap-2 text-sm">
                Categoria
              </strong>
              <p className="text-xs mt-1">
                <Badge size="sm" variant="info">
                  {representante?.representante?.categoria?.nome}
                </Badge>
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-slate-600">
          <CardFooterItem>
            <Link
              href={`/representantes/${representante.idPessoa}`}
              className="hover:text-blue-800 transition-all"
              title="Visualizar Representante"
            >
              <SearchIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <Link
              className="hover:text-blue-800 transition-all"
              href={`/representantes/editar?representanteId=${representante.idPessoa}`}
              title="Editar Representante"
            >
              <PencilIcon />
            </Link>
          </CardFooterItem>
          <CardFooterItem>
            <button
              className={`hover:text-red-800 transition-all`}
              onClick={handleValidarExclusao}
              title="Excluir Representante"
            >
              <TrashIcon />
            </button>
          </CardFooterItem>
        </CardFooter>
      </Card>

      {isVerificando ? (
        <DialogVerificacaoSkeleton />
      ) : (
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent className="bg-white">
            <div className="flex flex-col items-center max-w-xl mx-auto mt-4 ">
              {validacao?.podeDeletar ? (
                <>
                  <TrashIcon size="size-12 mb-4" />
                  <DialogTitle className="text-lg">
                    Confirmar exclusão
                  </DialogTitle>
                  <p className="text-center text-base">
                    Tem certeza que deseja excluir o representante{" "}
                    <strong>{representante.nome}</strong>?
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
                    O representante <strong>{representante.nome}</strong> não
                    pode ser excluído, pois o mesmo está vinculado a uma
                    representação.
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
                {validacao?.podeDeletar === false ? "Sair" : "Não, cancelar."}
              </Button>
              {validacao?.podeDeletar && (
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
