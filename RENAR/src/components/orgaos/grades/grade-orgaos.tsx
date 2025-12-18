"use client";
import { useState } from "react";
import { useDrawer } from "@/hooks/use-drawer";
import { ResultContainer } from "@/components/layouts/resultContainer";
import { ResultMetadata } from "@/components/layouts/metadata-result";
import { ExclusaoOrgaoResponse, OrgaoResponse, ValidacaoDelecaoOrgaosResponse } from "@/types/orgao.type";
import { ModalExcluirOrgao } from "../modais/modal-excluir-orgao";
import { ItemOrgao } from "../items/item-orgao";
import { useModal } from "@/hooks/use-modal";

interface GradeOrgaosProps {
  itens: OrgaoResponse[] | undefined;
  total?: number;
  isLoading: boolean;
  validarExclusao(id: number): Promise<ValidacaoDelecaoOrgaosResponse | null>;
  handleDeleteOrgao(id: number): Promise<ExclusaoOrgaoResponse | null>;
}

export function GradeOrgaos({
  itens,
  total,
  isLoading,
  validarExclusao,
  handleDeleteOrgao,
}: GradeOrgaosProps) {
  const { openDrawer } = useDrawer();
  const { openModal } = useModal();
  const [idOrgaoSelecionado, setIdOrgaoSelecionado] = useState<
    string | null
  >(null);

  // const excluirOrgaoSelecionado = (orgao: OrgaoResponse) => {
  //   if (orgao) {
  //     setIdOrgaoSelecionado(orgao.id ? String(orgao.id) : null);
  //     openModal("modal_excluir_orgao");
  //   }
  // };

  const lidarOrgaoSelecionado = (orgao: OrgaoResponse) => {
    setIdOrgaoSelecionado(String(orgao.id));
    openDrawer("detalhes_orgao");
  };

  const editarOrgaoSelecionado = (orgao: OrgaoResponse) => {
    if (orgao.id) {
      setIdOrgaoSelecionado(String(orgao.id));
    }
  };

  return (
    <>
      <ResultMetadata
        resourceName="Órgãos"
        displayed={itens?.length || 0}
        total={total || 0}
        isLoading={isLoading}
      />
      <ResultContainer>
        {itens && itens.map((item: OrgaoResponse, index: number) => (
          <ItemOrgao
            visualizarAcao={lidarOrgaoSelecionado}
            editarAcao={editarOrgaoSelecionado}
            excluirAcao={handleDeleteOrgao}
            validarExclusao={validarExclusao}
            dados={item}
            key={index}
          />
        ))}
      </ResultContainer>
      <ModalExcluirOrgao
        idOrgao={idOrgaoSelecionado as string}
      />
    </>
  );
}
