import { CheckBoxField } from "@/components/layouts/ui/fields/switch-field/checkbox-field";
import { TextAreaField } from "@/components/layouts/ui/fields/text-area-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";

export const SecaoInformacoes = () => {
  return (
    <>
      <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
        Informações Adicionais
      </h1>
      <div className="mb-4">
        <TextAreaField name="competencia" label="Competência:" />
      </div>

      <CheckBoxField
        name="competenciaWeb"
        label="Exibir a competência no SGR Web"
      />
      <div className="my-4">
        <TextAreaField name="perfil" label="Perfil:" />
      </div>
      <CheckBoxField name="publicarWeb" label="Publicar na Web" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <TextField
          name="siteLegislacao"
          label="Site legislação"
          placeholder="www.exemplo.com"
          id="site-legislacao"
        />

        <TextField
          name="siteComposicao"
          label="Site composição"
          placeholder="www.exemplo.com"
          id="site-composicao"
        />
      </div>
      <div className="mt-4">
        <TextAreaField
          name="perfilRepresentacao"
          label="Descrição da Representação na Web"
        />
      </div>
    </>
  );
};
