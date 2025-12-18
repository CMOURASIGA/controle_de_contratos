import CustomCollapse from "@/components/layouts/ui/collapse";

import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";

export const opcoesEntidades = [
  {
    label: "CNC",
    value: "1995",
  },
  {
    label: "SENAC",
    value: "4544",
  },
  {
    label: "SESC",
    value: "4836",
  },
];
export const SecaoDadosCadastrais = () => {
  return (
    <CustomCollapse
      title={
        <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
          Dados Cadastrais
        </h1>
      }
      defaultActive={true}
    >
      <div className="w-full md:w-1/2">
        <SelectField
          options={opcoesEntidades}
          name="entidade"
          label="Entidade"
          placeholder="Selecione uma opção"
          disabled={true}
        />
      </div>
    </CustomCollapse>
  );
};
