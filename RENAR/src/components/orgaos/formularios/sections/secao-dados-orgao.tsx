import CustomCollapse from "@/components/layouts/ui/collapse";
import { RadioField } from "@/components/layouts/ui/fields/radio-field/radio-field";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import useOrgaos from "@/hooks/orgaos/use-orgaos";
import { useParams } from "next/navigation";

export const SecaoDadosOrgao: React.FC = () => {
  const params = useParams();
  const orgaoId = params.id as string;
  const { orgaos } = useOrgaos();

  return (
    <CustomCollapse
      title={
        <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
          {"Órgão"}
        </h1>
      }
      defaultActive={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mr-1 ml-1">
        <div className="md:col-span-4">
          <TextField
            name="orgaoNome"
            label="Órgão"
            placeholder="Nome do órgão"
            id="campo-orgao-nome"
          />
        </div>

        <TextField
          name="numero"
          label="Número"
          placeholder="Número"
          id="campo-numero"
          disabled={true}
        />

        <TextField
          name="sigla"
          label="Sigla"
          placeholder="Sigla"
          id="campo-sigla"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3  gap-4 mt-4 mr-1 ml-1">
        <div className="md:col-span-2">
          <SelectField
            options={orgaos.map((orgao) => ({
              label: orgao.sigla,
              value: orgao.id.toString(),
            }))}
            name="vinculado"
            label="Vinculado(a)*"
            placeholder=" Selecione uma opção"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div>
          <label className="text-sm" htmlFor="">
            Situação
          </label>
          <div className="flex flex-col lg:flex-row gap-4 mt-2 border-2 rounded-md p-4">
            <RadioField name="situacao" label="Ativo" value="1" />
            <RadioField name="situacao" label="Inativo" value="0" />
            <RadioField
              name="situacao"
              label="Aguardando definição"
              value="2"
            />
            <RadioField name="situacao" label="Declinada" value="3" />
          </div>
        </div>

        <div>
          <label className="text-sm" htmlFor="">
            Tipo de Órgão
          </label>
          <div className="flex flex-row gap-4 mt-2 border-2 rounded-md p-4">
            <RadioField name="tipo" label="Órgão Público" value="1" />
            <RadioField name="tipo" label="Órgão Internacional" value="2" />
            <RadioField name="tipo" label="Órgão Privado" value="3" />
          </div>
        </div>
      </div>
    </CustomCollapse>
  );
};
