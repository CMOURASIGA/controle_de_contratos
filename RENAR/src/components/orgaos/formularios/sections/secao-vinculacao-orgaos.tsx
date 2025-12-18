import { TreeDataItem, TreeView } from "@/components/tree-view";
import { useConsultarVinculacaoOrgao } from "@/hooks/orgaos/use-consultar-vinculacao-orgao";
import { Orgao } from "@/types/orgao.type";

interface SecaoVinculacoesOrgaosProps {
  idOrgaoeSelecionado: number;
}

export const SecaoVinculacoesOrgaos = ({
  idOrgaoeSelecionado,
}: SecaoVinculacoesOrgaosProps) => {
  const { vinculacaoOrgao } = useConsultarVinculacaoOrgao(
    String(idOrgaoeSelecionado)
  );

  function mapVinculadosToTreeData(items?: Partial<Orgao>[]): TreeDataItem[] {
    if (!items) return [];

    return items.map((item, k) => {
      const objeto: TreeDataItem = {
        id: item?.id !== undefined ? String(item.id) : "",
        name: item?.nome ?? "",
      };
      if (item?.vinculados && item.vinculados.length > 0)
        objeto["children"] = mapVinculadosToTreeData(item.vinculados);

      return objeto;
    });
  }

  const vinculados: TreeDataItem[] = mapVinculadosToTreeData(vinculacaoOrgao);

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
