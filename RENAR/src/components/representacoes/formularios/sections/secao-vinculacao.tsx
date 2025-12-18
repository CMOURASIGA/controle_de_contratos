import { TreeDataItem, TreeView } from "@/components/tree-view";
import { useConsultarRepresentacao } from "@/hooks/representacoes/use-consultar-representacao";
import { Representacao } from "@/types/representacao.type";
import { useParams } from "next/navigation";

export const SecaoVinculacoes = () => {
  const params = useParams();
  const representacaoId = params.id as string;
  const { representacaoSelected } = useConsultarRepresentacao(
    representacaoId,
    true
  );

  function mapVinculadosToTreeData(
    items?: Partial<Representacao>[]
  ): TreeDataItem[] {
    if (!items) return [];
    return items.map((item) => {
      const objeto: TreeDataItem = {
        id: item.idRepresentacao !== undefined ? String(item.idRepresentacao) : "",
        name: item.nome ?? "",
      };
      if (item.vinculados && item.vinculados.length > 0)
        objeto["children"] = mapVinculadosToTreeData(item.vinculados);

      return objeto;
    });
  }

  const vinculados: TreeDataItem[] = mapVinculadosToTreeData(
    representacaoSelected?.vinculados
  );

  return (
    <>
      <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
        Vinculações
      </h1>
      <div className="border rounded-md shadow-sm">
        <TreeView data={vinculados} />
      </div>
    </>
  );
};
