import Label from "@/components/layouts/ui/label/label";
import { useConsultarRepresentacao } from "@/hooks/representacoes/use-consultar-representacao";
import { useParams } from "next/navigation";

export const VisualizacaoInformacoesAdicionaisRepresentacoesTab = () => {
  const params = useParams();
  const representacaoId = params.id as string;
  const { representacaoSelected } = useConsultarRepresentacao(representacaoId);

  const situacaoPublicacaoPerfil =
    representacaoSelected?.situacaoPublicacaoPerfil === 0 ? "Não" : "Sim";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Label label="Competência" value={representacaoSelected?.competencia} />
      <Label label="Perfil" value={representacaoSelected?.perfilWeb} />
      <Label label="Publicar na web" value={situacaoPublicacaoPerfil} />
      <Label
        label="Site legislação"
        value={representacaoSelected?.enderecoHomepageLegislacao}
      />
      <Label
        label="Site composição"
        value={representacaoSelected?.enderecoHomepageComposicao}
      />
      <Label
        label="Descrição da Representação na Web"
        value={representacaoSelected?.perfil}
      />
    </div>
  );
};
