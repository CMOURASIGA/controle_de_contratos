/* eslint-disable @typescript-eslint/no-explicit-any */
import Label from "@/components/layouts/ui/label/label";
import { useConsultarRepresentacao } from "@/hooks/representacoes/use-consultar-representacao";
import { useParams } from "next/navigation";
import { getCusteio } from "../representacoes.utils";

export const VisualizacaoCusteioRepresentacaoTab = () => {
  const params = useParams();
  const representacaoId = params.id as string;
  const { representacaoSelected } = useConsultarRepresentacao(representacaoId);

  const labels: any = [
    {
      label: "Passagem",
      value: getCusteio(Number(representacaoSelected?.staPassg)),
    },
    {
      label: "Remuneração",
      value: getCusteio(Number(representacaoSelected?.staRmnrc)),
    },
    {
      label: "Ajuda de Custo",
      value: getCusteio(Number(representacaoSelected?.staAjdCst)),
    },
    {
      label: "Translado",
      value: getCusteio(Number(representacaoSelected?.staTrsld)),
    },
    {
      label: "Diária",
      value: getCusteio(Number(representacaoSelected?.staDiar)),
    },
    {
      label: "Hospedagem",
      value: getCusteio(Number(representacaoSelected?.staHpdg)),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {labels?.map((row: any, index: number) => {
        return (
          <Label key={index} label={row.label} value={row?.value?.label} />
        );
      })}
    </div>
  );
};
