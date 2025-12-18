import CustomCollapse from "@/components/layouts/ui/collapse";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";

interface SecaoCusteioProps {
  opcoesTiposCusteio: { value: string; label: string }[];
  opcoesFontesCusteio: { value: string; label: string }[];
  isLoading?: boolean;
}

export const SecaoCusteio = ({
  opcoesTiposCusteio,
  opcoesFontesCusteio,
  isLoading = false,
}: SecaoCusteioProps) => {
  return (
    <CustomCollapse
      title={
        <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
          Informações de custeio
        </h1>
      }
      defaultActive
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          options={opcoesTiposCusteio}
          name="idTipoCusteio"
          label="Tipo de Custeio"
          placeholder="Selecione um tipo"
          disabled={isLoading}
        />
        <SelectField
          options={opcoesFontesCusteio}
          name="idFonteCusteio"
          label="Fonte de Custeio"
          placeholder="Selecione uma fonte"
          disabled={isLoading}
        />
        <TextField
          name="dataCriacao"
          label="Data de Criação"
          type="date"
          placeholder="Data de criação (opcional)"
        />
      </div>
    </CustomCollapse>
  );
};
