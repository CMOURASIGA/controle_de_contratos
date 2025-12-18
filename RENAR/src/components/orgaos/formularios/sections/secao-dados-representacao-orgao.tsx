import CustomCollapse from "@/components/layouts/ui/collapse";
import { RadioField } from "@/components/layouts/ui/fields/radio-field/radio-field";

import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { useQueryString } from "@/hooks/use-query-params";
import { useParams } from "next/navigation";

const opcoesPrioridade = [
  { value: "1", label: "Baixa" },
  { value: "2", label: "Média" },
  { value: "3", label: "Alta" },
];
const opcoesAreaTematica = [
  { value: "1", label: "Comércio Exterior e Relações Internacionais" },
  { value: "2", label: "Economia, Comércio e Serviços" },
  { value: "3", label: "Educação, Cultura e Inovação" },
  { value: "4", label: "Infraestrutura" },
  { value: "5", label: "Meio ambiente e Sustentabilidade" },
  { value: "6", label: "Microempresa e Empresa de Pequeno Porte" },
  { value: "7", label: "Normalização" },
  { value: "8", label: "Relação de trabalho" },
  { value: "9", label: "Governança Pública e Corporativa" },
  { value: "10", label: "Saúde e Segurança no Trabalho" },
  { value: "11", label: "Turismo" },
  { value: "13", label: "Relações Institucionais" },
];
// interface SecaoDadosRepresentacaoOrgaoProps {
//   tipoRepresentacao: string;
// }

export const SecaoDadosRepresentacaoOrgao: React.FC = () => {
  const params = useParams();
  const representacaoId = params.id as string;

  return (
    <CustomCollapse
      title={
        <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
          {"Representação"}
        </h1>
      }
      defaultActive={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 ">
        <div className="md:col-span-4">
          <TextField
            name="representacaoNome"
            label="Representação permanente"
            placeholder="Representação permanente"
            id="campo-representacao-permanente"
          />
        </div>

        <TextField
          name="numero"
          label="Número"
          placeholder="Número"
          id="campo-numero"
          disabled={!!representacaoId}
        />

        <TextField
          name="sigla"
          label="Sigla"
          placeholder="Sigla"
          id="campo-sigla"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3  gap-4 mt-4">
        <div className="md:col-span-2">
          <SelectField
            options={[
              {
                value: "1",
                label: "Ministério dos direitos humanos e da Cidadania",
              },
            ]}
            name="vinculado"
            label="Vinculado(a)*"
            placeholder=" Selecione uma opção"
          />
        </div>
        <SelectField
          options={opcoesPrioridade}
          name="grauPrioridade"
          label="Grau de prioridade"
          placeholder=" Selecione uma opção"
        />

        <div className="md:col-span-2">
          <SelectField
            options={opcoesAreaTematica}
            name="areaTematica"
            label="Área temática"
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
            <RadioField name="situacao" label="Ativo" value="-1" />
            <RadioField name="situacao" label="Inativo" value="0" />
            <RadioField
              name="situacao"
              label="Aguardando definição"
              value="1"
            />
            <RadioField name="situacao" label="Declinada" value="2" />
          </div>
        </div>

        <div>
          <label className="text-sm" htmlFor="">
            Tipo
          </label>
          <div className="flex flex-row gap-4 mt-2 border-2 rounded-md p-4">
            <RadioField name="tipo" label="Permanente" value="0" />
            <RadioField name="tipo" label="Eventual" value="1" />
            <RadioField name="tipo" label="Virtual " value="2" />
          </div>
        </div>
      </div>
    </CustomCollapse>
  );
};
