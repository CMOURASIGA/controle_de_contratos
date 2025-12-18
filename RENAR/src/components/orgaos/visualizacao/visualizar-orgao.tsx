import Label from "@/components/layouts/ui/label/label";
import { OrgaoResponse } from "@/types/orgao.type";
import React from "react";
import { getStatusLabel } from "../items/item-orgao";

interface VisualizarOrgaoProps {
  orgaoSelecionado?: OrgaoResponse;
}

const VisualizarOrgao: React.FC<VisualizarOrgaoProps> = ({
  orgaoSelecionado,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Label label="Nome" value={orgaoSelecionado?.nome} />
        <Label label="Número" value={String(orgaoSelecionado?.id)} />
        <Label label="Sigla" value={orgaoSelecionado?.sigla} />
        <Label
          label="Situação"
          value={getStatusLabel(orgaoSelecionado?.situacao)}
        />
        <Label label="Tipo de Órgão" value={orgaoSelecionado?.tipoOrgao} />
      </div>
    </>
  );
};

export default VisualizarOrgao;
