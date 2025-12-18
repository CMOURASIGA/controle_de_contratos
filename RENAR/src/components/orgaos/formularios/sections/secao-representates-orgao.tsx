import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";

import { PlusIcon } from "@/components/layouts/ui/icons/plus";
import Table from "@/components/layouts/ui/table/table";
import { useRepresentantes } from "@/hooks/representantes/use-representantes";
import { Orgao } from "@/types/orgao.type";
import { ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

type Representante = {
  nome: string;
  acoes: ReactNode;
};

//faça uma interface para a secaoRepresentantes que tenha um formMetodos do tipo UseFormReturn
// interface SecaoRepresentantesOrgaoProps {
//   formMetodos: UseFormReturn<
//     dadosPrincipaisRepresentacaoDto | formularioRepresentacaoAtualizacaoDto
//   >;
// }

export const SecaoRepresentantesOrgao = () => {
  const { representantes } = useRepresentantes();

  const [dadosRepresentantes, setDadosRepresentantes] = useState<
    Representante[]
  >([]);

  // function addRepresentante() {
  //   const nome = formMetodos.getValues("represetanteNome");

  //   if (!nome) return;
  //   setDadosRepresentantes([
  //     ...dadosRepresentantes,
  //     {
  //       nome,
  //       acoes: <TrashIcon />,
  //     },
  //   ]);
  //   formMetodos.setValue("represetanteNome", "");
  // }

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

  const methods = useForm<Orgao>({
    defaultValues: {
      idHierarquia: 0,
    },
    // resolver: zodResolver(),
  });

  return (
    <>
      <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
        Representantes
      </h1>
      <FormProvider {...methods}>
        <form>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <SelectField
              options={[]}
              name="represetanteNome"
              label="Nome do representante"
              placeholder="Representante"
              //   onChange={(e) => handleChange(e)}
            />
            <div className="flex items-end">
              <ButtonOutline
                onClick={() => {
                  //addRepresentante();
                }}
                aria-label="Adicionar meio de comunicação"
              >
                <PlusIcon /> Adicionar
              </ButtonOutline>
            </div>
          </div>
          <Table data={dadosRepresentantes} columns={columns} />
        </form>
      </FormProvider>
    </>
  );
};
