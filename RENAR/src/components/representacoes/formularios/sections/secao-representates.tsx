import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";

import { PlusIcon } from "@/components/layouts/ui/icons/plus";
import { TrashIcon } from "@/components/layouts/ui/icons/trash";
import Table from "@/components/layouts/ui/table/table";
import {
  dadosPrincipaisRepresentacaoDto,
  formularioRepresentacaoAtualizacaoDto,
} from "@/hooks/representacoes/use-representacoes";
import { useRepresentantes } from "@/hooks/representantes/use-representantes";
import { ReactNode, useState } from "react";
import { UseFormReturn } from "react-hook-form";

type Representante = {
  nome: string;
  acoes: ReactNode;
};

//faça uma interface para a secaoRepresentantes que tenha um formMetodos do tipo UseFormReturn
interface SecaoRepresentantesProps {
  formMetodos: UseFormReturn<
    dadosPrincipaisRepresentacaoDto | formularioRepresentacaoAtualizacaoDto
  >;
}

export const SecaoRepresentantes = ({
  formMetodos,
}: SecaoRepresentantesProps) => {
  const { representantes } = useRepresentantes();

  const [dadosRepresentantes, setDadosRepresentantes] = useState<
    Representante[]
  >([]);

  function addRepresentante() {
    const nome = formMetodos.getValues("represetanteNome");

    if (!nome) return;
    setDadosRepresentantes([
      ...dadosRepresentantes,
      {
        nome,
        acoes: <TrashIcon />,
      },
    ]);
    formMetodos.setValue("represetanteNome", "");
  }

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

  const representantesOptions =
    representantes?.map((representante) => ({
      //   value: String(representante.id),
      value: representante?.nome,
      label: representante?.nome,
    })) || [];

  return (
    <>
      <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
        Representantes
      </h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <SelectField
          options={representantesOptions}
          name="represetanteNome"
          label="Nome do representante"
          placeholder="Representante"
          //   onChange={(e) => handleChange(e)}
        />
        <div className="flex items-end">
          <ButtonOutline
            onClick={() => {
              addRepresentante();
            }}
            aria-label="Adicionar meio de comunicação"
          >
            <PlusIcon /> Adicionar
          </ButtonOutline>
        </div>
      </div>
      <Table data={dadosRepresentantes} columns={columns} />
    </>
  );
};
