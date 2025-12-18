import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { TextAreaField } from "@/components/layouts/ui/fields/text-area-field";
import { useCategorias } from "@/hooks/dominios/use-categorias";
import { useEntidades } from "@/hooks/dominios/use-entidades";
import { usePronomeTratamento } from "@/hooks/dominios/use-pronomes-tratamento";
// import { useQueryString } from "@/hooks/useQueryParams";
// import { queryClient } from "@/infra/tanStack/ReactQueryWrapper";
// import { Representante } from "@/types/representante.type";
import { Button } from "@cnc-ti/layout-basic";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const dadosExtraSchema = z.object({
  categoriaId: z.string(),
  pronomeId: z.string(),
  entidadeId: z.string(),
  beneficiario: z.string(),
});

type DadosExtras = z.infer<typeof dadosExtraSchema>;
export function DadosOutrasInformacoesForm() {
  // const { getAllQueryStrings } = useQueryString();
  // const { representanteId } = getAllQueryStrings();
  const { opcoesCategorias } = useCategorias();
  const { opcoesPronomes } = usePronomeTratamento();
  const { opcoesEntidades } = useEntidades();
  // const representante: Representante | undefined = queryClient.getQueryData([
  //   "representante",
  //   representanteId,
  // ]);

  const methods = useForm<DadosExtras>({
    resolver: zodResolver(dadosExtraSchema),
    defaultValues: {},
  });

  async function onSubmit(data: DadosExtras) {
    console.log(data);
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        aria-describedby="dados-bancarios-form"
      >
        <div className="grid grid-cols-2 gap-4 my-4 pb-4">
          <SelectField
            options={opcoesEntidades}
            name="entidadeId"
            label="Entidade"
            placeholder="entidade"
            id="field-entidade"
          />

          <SelectField
            options={opcoesCategorias}
            name="categoriaId"
            label="Categoria"
            placeholder="categoria"
            id="field-categoria"
          />
          <TextAreaField
            label="Beneficiario (Seguro Viagem)"
            name="beneficiario"
            placeholder="beneficiario"
            id="field-beneficiario"
            required
          />

          <SelectField
            options={opcoesPronomes}
            name="pronomeId"
            label="Pronome de Tratamento"
            placeholder="pronome de tratamento"
          />
        </div>
        <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
          <Button variant="confirm" type="submit">
            Salvar alterações
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
