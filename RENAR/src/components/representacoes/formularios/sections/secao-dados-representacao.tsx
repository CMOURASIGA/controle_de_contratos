import CustomCollapse from "@/components/layouts/ui/collapse";
import { RadioField } from "@/components/layouts/ui/fields/radio-field/radio-field";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import Loader from "@/components/layouts/ui/loader/loader";
import { opcoesAreaTematica } from "@/constants/areas-tematicas";
import { opcoesPrioridade } from "@/constants/representacao/prioridade";
import { opcoesSituacao } from "@/constants/representacao/situacao";
import { opcoesTipo } from "@/constants/representacao/tipo";
import { useDebounce } from "@/hooks/useDebounce";
import {
  buscarRepresentacoesEOrgaos,
  RepresentacaoOrgaoItem,
} from "@/services/representacoes.service";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

interface SecaoDadosRepresentacaoProps<T extends FieldValues = FieldValues> {
  method?: UseFormReturn<T>;
}

export const SecaoDadosRepresentacao = <T extends FieldValues>({
  method,
}: SecaoDadosRepresentacaoProps<T>) => {
  const [
    isSearchingRepresentacoesEOrgaos,
    setIsSearchingRepresentacoesEOrgaos,
  ] = useState(false);
  const [opcoes, setOpcoes] = useState<
    {
      label: string;
      value: string;
      tipo?: "REPRESENTACAO" | "ORGAO";
    }[]
  >([]);
  const params = useParams();

  const representacaoId = params.id as string;
  const situacaoErro = method?.formState.errors.situacao;
  const tipoErro = method?.formState.errors.tipoDados;

  const debounce = useDebounce(400);
  const isUpdatingFromWatch = useRef(false);
  const hasLoadedInitialData = useRef(false);

  const buscarVinculadosCallback = useCallback(async (nome?: string) => {
    setIsSearchingRepresentacoesEOrgaos(true);
    try {
      const data = await buscarRepresentacoesEOrgaos(nome);

      const opcoesFormatadas = data.map((item: RepresentacaoOrgaoItem) => ({
        value: `${item.id}_${item.tipo}`,
        label: `[${item.tipo === "REPRESENTACAO" ? "REP" : "ORG"}] ${item.nome}`,
        tipo: item.tipo,
      }));

      setOpcoes(opcoesFormatadas);
    } catch (error) {
      setOpcoes([]);
    } finally {
      setIsSearchingRepresentacoesEOrgaos(false);
    }
  }, []);

  const buscarVinculados = useMemo(
    () => debounce(buscarVinculadosCallback),
    [debounce, buscarVinculadosCallback]
  );

  const handleVinculadoChange = useCallback((value: string, skipWatchUpdate = false) => {
    if (!method || !value || typeof value !== "string" || !value.includes("_")) {
      return;
    }

    const [id, tipo] = value.split("_");

    if (!id || id === "" || Number.isNaN(Number(id))) {
      return;
    }

    if (isUpdatingFromWatch.current && skipWatchUpdate) {
      return;
    }

    isUpdatingFromWatch.current = true;

    if (tipo === "REPRESENTACAO") {
      method.setValue("idRepresentacaoPai" as Path<T>, id as unknown as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
        shouldTouch: false
      });
      method.setValue("idOrgaoPai" as Path<T>, null as unknown as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
        shouldTouch: false
      });
    } else if (tipo === "ORGAO") {
      method.setValue("idOrgaoPai" as Path<T>, id as unknown as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
        shouldTouch: false
      });
      method.setValue("idRepresentacaoPai" as Path<T>, null as unknown as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
        shouldTouch: false
      });
    }

    isUpdatingFromWatch.current = false;
  }, [method]);

  useEffect(() => {
    if (!hasLoadedInitialData.current) {
      buscarVinculadosCallback();
      hasLoadedInitialData.current = true;
    }
  }, [buscarVinculadosCallback]);

  useEffect(() => {
    if (!method) return;

    const idRepresentacaoPai = method.getValues("idRepresentacaoPai" as Path<T>);
    const idOrgaoPai = method.getValues("idOrgaoPai" as Path<T>);
    const vinculadoAtual = method.getValues("vinculado" as Path<T>);

    if (idRepresentacaoPai !== null && idRepresentacaoPai !== undefined && idRepresentacaoPai !== "") {
      const id = String(idRepresentacaoPai);
      const valorVinculado = `${id}_REPRESENTACAO`;
      if (vinculadoAtual !== valorVinculado) {
        method.setValue("vinculado" as Path<T>, valorVinculado as unknown as PathValue<T, Path<T>>, { shouldDirty: false, shouldValidate: false });
      }
    } else if (idOrgaoPai !== null && idOrgaoPai !== undefined && idOrgaoPai !== "") {
      const id = String(idOrgaoPai);
      const valorVinculado = `${id}_ORGAO`;
      if (vinculadoAtual !== valorVinculado) {
        method.setValue("vinculado" as Path<T>, valorVinculado as unknown as PathValue<T, Path<T>>, { shouldDirty: false, shouldValidate: false });
      }
    } else if (vinculadoAtual !== "") {
      method.setValue("idRepresentacaoPai" as Path<T>, null as unknown as PathValue<T, Path<T>>, { shouldDirty: false, shouldValidate: false });
      method.setValue("idOrgaoPai" as Path<T>, null as unknown as PathValue<T, Path<T>>, { shouldDirty: false, shouldValidate: false });
      method.setValue("vinculado" as Path<T>, "" as unknown as PathValue<T, Path<T>>, { shouldDirty: false, shouldValidate: false });
    }
  }, [method]);


  return (
    <CustomCollapse
      title={
        <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
          {"Representação"}
        </h1>
      }
      defaultActive={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mr-1">
        <div className="md:col-span-4 pl-1 mr-1">
          <TextField
            name="representacaoNome"
            label="Representação"
            placeholder="Representação"
            id="campo-representacao-permanente"
          />
        </div>

        <TextField
          name="numero"
          label="Número"
          placeholder="Número"
          id="campo-numero"
          disabled
        />

        <TextField
          name="sigla"
          label="Sigla"
          placeholder="Sigla"
          id="campo-sigla"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mr-1 gap-4 mt-4">
        <div className="md:col-span-2">
          <SelectField
            options={opcoes}
            name="vinculado"
            label="Vinculado(a)"
            placeholder="Selecione uma opção"
            onInput={(e: string) => buscarVinculados(e)}
            onChange={(e) => {
              const value = e?.target?.value;
              if (value && typeof value === "string" && value.includes("_")) {
                handleVinculadoChange(value, false);
              } else if (!value || value === "") {
                if (method) {
                  method.setValue("idRepresentacaoPai" as Path<T>, null as unknown as PathValue<T, Path<T>>, {
                    shouldDirty: false,
                    shouldValidate: false,
                    shouldTouch: false
                  });
                  method.setValue("idOrgaoPai" as Path<T>, null as unknown as PathValue<T, Path<T>>, {
                    shouldDirty: false,
                    shouldValidate: false,
                    shouldTouch: false
                  });
                }
              }
            }}
            notFoundContent={
              <>
                {isSearchingRepresentacoesEOrgaos && (
                  <div
                    style={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                      margin: 16,
                    }}
                  >
                    <Loader>Carregando...</Loader>
                  </div>
                )}
                {!isSearchingRepresentacoesEOrgaos && (
                  <div>Nenhum resultado encontrado.</div>
                )}
              </>
            }
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
            label="Área temática *"
            placeholder=" Selecione uma opção"
            required
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div>
          <label
            className="text-sm block mb-1 font-medium text-gray-600"
            htmlFor=""
          >
            Situação
          </label>

          <div className="flex flex-col lg:flex-row gap-4 mt-2 border-2 rounded-md p-4">
            {opcoesSituacao?.map((row) => (
              <RadioField
                key={row.value}
                name="situacao"
                label={row.label}
                value={row.value}
              />
            ))}
          </div>
          {situacaoErro && (
            <p
              className="text-xs ext-red-500 mt-1"
              style={{ color: "red", marginTop: "4px" }}
            >
              {typeof situacaoErro.message === "string"
                ? situacaoErro.message
                : ""}
            </p>
          )}
        </div>

        <div>
          <label
            className="text-sm block mb-1 font-medium text-gray-600"
            htmlFor=""
          >
            Tipo
          </label>

          <div className="flex flex-row gap-4 mt-2 border-2 rounded-md p-4">
            {opcoesTipo?.map((row) => (
              <RadioField
                key={row.value}
                name="tipoDados"
                label={row.label}
                value={row.value}
              />
            ))}
          </div>
          {tipoErro && (
            <p
              className="text-xs ext-red-500 mt-1"
              style={{ color: "red", marginTop: "4px" }}
            >
              {typeof tipoErro.message === "string"
                ? tipoErro.message
                : JSON.stringify(tipoErro.message)}
            </p>
          )}
        </div>
      </div>
    </CustomCollapse>
  );
};
