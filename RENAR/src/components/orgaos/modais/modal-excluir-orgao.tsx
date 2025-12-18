"use client";
import { TrashIcon } from "@/components/layouts/ui/icons/trash";
import Modal from "@/components/layouts/ui/modal/modal";
import { useModal } from "@/hooks/use-modal";
import { useQueryString } from "@/hooks/use-query-params";
import {
  buscarOrgaoPorId,
  ExcluirOrgao,
} from "@/services/orgaos/orgaos.service";
import { Button } from "@cnc-ti/layout-basic";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface ModalExcluirOrgaoProps {
  idOrgao: string;
}

export function ModalExcluirOrgao({ idOrgao }: ModalExcluirOrgaoProps) {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const { getAllQueryStrings } = useQueryString();
  const params = getAllQueryStrings();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const { data: orgao, isLoading } = useQuery({
    queryKey: ["query-orgao-excluir", idOrgao],
    queryFn: async () => await buscarOrgaoPorId(idOrgao as string),
    enabled: Boolean(idOrgao),
  });

  const handleDeleteInterest = async () => {
    setLoading(true);
    try {
      const response = await ExcluirOrgao(String(orgao?.data?.id));
      if (response) {
        queryClient.invalidateQueries({ queryKey: ["orgaos", params] });
      }
      // if (redirect) {
      router.push("/orgaos/busca");
      // }
      closeModal();
      toast("Órgão excluído com sucesso!");
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal id="modal_excluir_orgao">
      {!isLoading ? (
        <div className="relative p-4 text-center sm:p-5 w-[450px]">
          <div className="flex flex-col justify-center items-center mb-6 mx-auto">
            <TrashIcon size="size-12" />
          </div>
          <p className="mb-4 text-primary font-medium dark:text-gray-300">
            Tem certeza de que deseja remover o Órgão: <br />
            <span className="font-bold">{orgao?.data?.nome}</span>?
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
              onClick={handleDeleteInterest}
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
