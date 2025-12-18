import CustomCollapse from "@/components/layouts/ui/collapse";

import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { Orgao } from "@/types/orgao.type";
import { FormProvider, useForm } from "react-hook-form";

export const SecaoCusteioOrgaos = () => {
  const opcoesCusteio = [
    { value: "-1", label: "Não tem direito" },
    { value: "0", label: "Entidade Representação (CNC)" },
    { value: "1", label: "Órgão de Representação" },
    {
      value: "2",
      label: "Entidade Representada (CNC) e Órgão de Representação",
    },
    {
      value: "3",
      label: "Outro",
    },
  ];

  const methods = useForm<Orgao>({
    defaultValues: {
      idHierarquia: 0,
    },
    // resolver: zodResolver(),
  });

  return (
    <CustomCollapse
      title={
        <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
          Informacoes de custeio
        </h1>
      }
      defaultActive
    >
      <FormProvider {...methods}>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <SelectField
              options={opcoesCusteio}
              name="passagem"
              label="Passagem"
              placeholder=" Selecione uma opção"
            />
            <SelectField
              options={opcoesCusteio}
              name="ajudaCusto"
              label="Ajuda de Custo"
              placeholder=" Selecione uma opção"
            />
            <SelectField
              options={opcoesCusteio}
              name="diaria"
              label="Diária"
              placeholder=" Selecione uma opção"
            />
            <SelectField
              options={opcoesCusteio}
              name="remuneracao"
              label="Remuneração"
              placeholder=" Selecione uma opção"
            />
            <SelectField
              options={opcoesCusteio}
              name="translado"
              label="Translado"
              placeholder=" Selecione uma opção"
            />
            <SelectField
              options={opcoesCusteio}
              name="hospedagem"
              label="Hospedagem"
              placeholder=" Selecione uma opção"
            />
          </div>
        </form>
      </FormProvider>
    </CustomCollapse>
  );
};
