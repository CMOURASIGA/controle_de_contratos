"use client";

import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { SelectOptionsSkeletonSimple } from "@/components/shared/select-options-skeleton";
import { useBuscarRepresentacoes } from "@/hooks/representacoes/use-buscar-representacoes";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";

interface SelectFieldRepresentacaoProps {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function SelectFieldRepresentacao({
  name,
  label = "Representação",
  placeholder = "Buscar representação",
  value,
  onChange,
  disabled = false,
}: SelectFieldRepresentacaoProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { setValue, watch } = useFormContext();
  const isUserInteractionRef = useRef(false);
  const previousValueRef = useRef<string | number | undefined>(value);

  const formValue = watch(name);
  const currentValue = formValue || value;

  useEffect(() => {
    const valueChanged = previousValueRef.current !== value;
    previousValueRef.current = value;

    if (valueChanged && value && String(value) !== String(formValue) && !isUserInteractionRef.current) {
      setValue(name, String(value), { shouldDirty: false, shouldValidate: false });
    }
    isUserInteractionRef.current = false;
  }, [value, formValue, name, setValue]);

  const debounce = useDebounce(400);
  const handleInputChange = debounce((value: string) => {
    setSearchTerm(value ?? "");
  });

  const { opcoes, isLoading } = useBuscarRepresentacoes(
    searchTerm,
    true,
    undefined
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    const currentValueStr = currentValue?.toString() || "";

    isUserInteractionRef.current = true;

    if (newValue === currentValueStr && currentValueStr !== "") {
      setValue(name, "", { shouldDirty: false, shouldValidate: false });
      setSearchTerm("");
      onChange?.("");
    } else if (newValue && newValue.trim() !== "") {
      setValue(name, newValue, { shouldDirty: true, shouldValidate: false });
      setSearchTerm("");
      onChange?.(newValue);
    }
  };

  return (
    <SelectField
      name={name}
      label={label}
      placeholder={placeholder}
      options={opcoes}
      onChange={handleChange}
      onInput={(e: string) => handleInputChange(e)}
      disabled={disabled}
      notFoundContent={
        <>
          {isLoading && <SelectOptionsSkeletonSimple count={5} />}
          {!isLoading && opcoes.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              {searchTerm
                ? "Nenhuma representação encontrada"
                : "Digite o nome da representação para buscar"}
            </div>
          )}
        </>
      }
    />
  );
}
