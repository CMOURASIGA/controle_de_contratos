"use client";

import { TrashIcon } from "@/components/layouts/ui/icons/trash";
import Modal from "@/components/layouts/ui/modal/modal";
import { useModal } from "@/hooks/use-modal";
import { useQueryString } from "@/hooks/use-query-params";
import { excluirAtividade } from "@/services/atividades.service";

import { Atividade } from "@/types/atividade.type";
import { Button } from "@cnc-ti/layout-basic";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { toast } from "react-toastify";

interface ModalExcluirAtividadeProps {
  atividade: Atividade;
  redirect?: boolean;
}


export function ModalExcluirAtividade({
  atividade,
  redirect,
}: ModalExcluirAtividadeProps): JSX.Element {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const { getAllQueryStrings } = useQueryString();
  const params = getAllQueryStrings();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const acaoExcluirAtividade = async () => {
    setLoading(true);
    try {
      await excluirAtividade(atividade.id);
      queryClient.invalidateQueries({ queryKey: ["atividades", params] });
      closeModal();
      toast("Atividade excluída com sucesso!", {
        type: "success",
      });
      if (redirect) {
        router.push("/atividades/buscar");
      }
    } catch (error) {
      toast("Erro ao excluir a atividade.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal id="modal_excluir_atividade">
      {atividade ? (
        <div className="relative p-4 text-center sm:p-5 w-[450px]">
          <div className="flex flex-col justify-center items-center mb-6 mx-auto">
            <TrashIcon size="size-12" />
          </div>
          <p className="mb-4 text-primary font-medium dark:text-gray-300">
            Tem certeza de que deseja remover a atividade{" "}
            <span className="font-bold">{atividade.descricaoAtividade}</span>?
          </p>
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={closeModal}
              type="button"
              className="py-2 px-4 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition-all"
            >
              Não, cancelar
            </button>
            <Button
              onClick={acaoExcluirAtividade}
              className="bg-red-500 hover:bg-red-600 text-sm font-semibold "
              isLoading={loading}
            >
              {loading ? "Removendo..." : "Sim, tenho certeza"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative p-4 text-center sm:p-5 w-[450px]">
          <p>Carregando...</p>
        </div>
      )}
    </Modal>
  );
}