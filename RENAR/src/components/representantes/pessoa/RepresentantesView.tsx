import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { SelectOptionsSkeletonSimple } from "@/components/shared/select-options-skeleton";
import { usePessoas } from "@/hooks/pessoas/use-pessoas";
import { useDrawer } from "@/hooks/use-drawer";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryString } from "@/hooks/useQueryParams";
import { Button } from "@cnc-ti/layout-basic";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DetalhesRepresentacao } from "./PessoaDrawer";

export function RepresentantesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [nomeInicialPessoa, setNomeInicialPessoa] = useState("");

  const methods = useForm({});
  const { addQueryString } = useQueryString();
  const { openDrawer } = useDrawer();

  const debounce = useDebounce(400);
  const { data: representantes = [], isLoading, refetch } = usePessoas(searchTerm);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    addQueryString("representanteId", e.target.value);
  };

  const handleInputChange = debounce((value: string) => {
    setSearchTerm(value);
  });

  function handleCadastroConcluido() {
    setNomeInicialPessoa("");
    setSearchTerm("");
    refetch();
  }

  return (
    <>
      <p className="mb-4 text-gray-600 text-sm">
        Selecione alguma pessoa para começar.
      </p>
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-4"
          aria-describedby="representantes-form"
        >
          <SelectField
            options={representantes}
            name="representanteId"
            label="Pessoa"
            placeholder="Representante"
            onChange={(e) => handleChange(e)}
            onInput={(e) => handleInputChange(e)}
            notFoundContent={
              <>
                {isLoading && <SelectOptionsSkeletonSimple count={8} />}
                {!isLoading && representantes.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-3 py-4">
                    <div className="text-center">
                      <p className="text-gray-600 text-sm font-medium mb-1">
                        {searchTerm
                          ? "Nenhuma pessoa encontrada"
                          : "Digite o nome da pessoa para buscar"}
                      </p>
                      <p className="text-gray-500 text-xs">
                        O sistema irá buscar representantes conforme você digita
                      </p>
                    </div>
                    {searchTerm && (
                      <Button
                        type="button"
                        className="font-semibold"
                        onClick={() => {
                          setNomeInicialPessoa(searchTerm.trim());
                          openDrawer("criar_pessoa");
                        }}
                      >
                        Cadastrar Pessoa
                      </Button>
                    )}
                  </div>
                )}
              </>
            }
          />
        </form>
      </FormProvider>
      <DetalhesRepresentacao
        nomeInicial={nomeInicialPessoa}
        onCadastroConcluido={handleCadastroConcluido}
      />
    </>
  );
}
