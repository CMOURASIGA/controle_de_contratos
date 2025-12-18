/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from "@/components/layouts/ui/table/table";
import { Representante } from "@/types";
import { useState } from "react";

export const VisualizacaoRepresentantesRepresentacoesTab = () => {
  const [dadosRepresentantes] = useState<Representante[]>([]);

  const columns = [
    {
      title: "Nome",
      key: "nome",
      width: "90%",
    },
    {
      title: "Ações",
      key: "acoes",
      width: "10%",
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
        Representantes
      </h1>
      <Table data={dadosRepresentantes as any} columns={columns} />
    </>
  );
};
