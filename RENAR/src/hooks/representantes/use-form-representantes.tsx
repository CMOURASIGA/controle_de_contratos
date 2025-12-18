import { usePaises } from "@/hooks/dominios/use-paises";
import { useUfs } from "@/hooks/dominios/use-ufs";
import { useConsultarRepresentante } from "@/hooks/representantes/use-consultar-representante";
import { useQueryString } from "@/hooks/use-query-params";
import { criarRepresentante } from "@/services/representantes.service";
import { ViaCepService } from "@/services/via-cep.service";
import { formatDateToYYYYMMDD } from "@/utils/generate-format-date";
import { useQuery } from "@tanstack/react-query";

import { TrashIcon } from "@/components/layouts/ui/icons/trash";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { useCategorias } from "../dominios/use-categorias";
import { useEntidades } from "../dominios/use-entidades";
import { usePronomeTratamento } from "../dominios/use-pronomes-tratamento";

const BRASIL_ID = "1";
const dadosPessoaisSchema = z
  .object({
    idRepresentante: z.string().optional(),

    // Dados Pessoais
    nome: z.string().min(2, "Nome deve ter pelo menos 3 caracteres").optional(),
    cpf: z.string().optional(),
    rg: z.string().optional(),
    dataEmissaoOrgao: z.string().optional(),
    nis: z.string().optional(),
    orgaoEmissor: z.string().optional(),
    dataNascimento: z.string().optional(),
    naturalidade: z.string().optional(),

    // Situação do Representante (string "true" = ativo, "false" = inativo)
    // Será convertido para boolean e enviado como "ativo" à API
    ativo: z.enum(["true", "false"], {
      message: "Selecione a situação do representante",
    }),

    // Preferência de Endereço
    statusEndereco: z.enum(["R", "C"], {
      message: "Selecione o endereço preferencial",
    }),

    // Endereço Residencial
    idPaisResidencial: z.string().optional(),
    idUfResidencial: z.string().optional(),
    enderecoCidadeResidencial: z.string().optional(),
    enderecoBairroResidencial: z.string().optional(),
    enderecoLogradouroResidencial: z.string().optional(),
    enderecoComplementoResidencial: z.string().optional(),
    enderecoNumeroResidencial: z.string().optional(),
    enderecoCepResidencial: z.string().optional(),

    // Endereço Comercial
    idPaisComercial: z.string().optional(),
    idUfComercial: z.string().optional(),
    enderecoCidadeComercial: z.string().optional(),
    enderecoBairroComercial: z.string().optional(),
    enderecoLogradouroComercial: z.string().optional(),
    enderecoComplementoComercial: z.string().optional(),
    enderecoNumeroComercial: z.string().optional(),
    enderecoCepComercial: z.string().optional(),

    // Contatos
    meio_contato: z.string().optional(),
    descricao: z.string().optional(),

    // Extras
    idEntidade: z.string().optional(),
    idCategoria: z.string().optional(),
    idPronomeTratamento: z.string().optional(),
    beneficiario: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.statusEndereco === "R") {
      // País sempre obrigatório
      if (
        !data.idPaisResidencial ||
        data.idPaisResidencial.toString().trim() === ""
      ) {
        ctx.addIssue({
          path: ["idPaisResidencial"],
          code: "custom",
          message: "País residencial é obrigatório",
        });
      }

      // Se o país for Brasil, os demais campos são obrigatórios
      const isBrasil = data.idPaisResidencial === BRASIL_ID;

      if (isBrasil) {
        const camposResidenciaisBrasil: (keyof typeof data)[] = [
          "idUfResidencial",
          "enderecoCidadeResidencial",
          "enderecoBairroResidencial",
          "enderecoLogradouroResidencial",
          "enderecoNumeroResidencial",
          "enderecoCepResidencial",
        ];

        camposResidenciaisBrasil.forEach((campo) => {
          if (!data[campo] || data[campo]?.toString().trim() === "") {
            ctx.addIssue({
              path: [campo],
              code: "custom",
              message: `${campo
                .replace("_residencial", "")
                .replace(
                  "_",
                  " "
                )} residencial é obrigatório quando o país é Brasil`,
            });
          }
        });
      }
    }

    if (data.statusEndereco === "C") {
      // País sempre obrigatório
      if (
        !data.idPaisComercial ||
        data.idPaisComercial.toString().trim() === ""
      ) {
        ctx.addIssue({
          path: ["idPaisComercial"],
          code: "custom",
          message: "País comercial é obrigatório",
        });
      }

      // Se o país for Brasil, os demais campos são obrigatórios
      const isBrasil = data.idPaisComercial === BRASIL_ID;

      if (isBrasil) {
        const camposComerciciaisBrasil: (keyof typeof data)[] = [
          "idUfComercial",
          "enderecoCidadeComercial",
          "enderecoBairroComercial",
          "enderecoLogradouroComercial",
          "enderecoNumeroComercial",
          "enderecoCepComercial",
        ];

        camposComerciciaisBrasil.forEach((campo) => {
          if (!data[campo] || data[campo]?.toString().trim() === "") {
            ctx.addIssue({
              path: [campo],
              code: "custom",
              message: `${campo
                .replace("_comercial", "")
                .replace(
                  "_",
                  " "
                )} comercial é obrigatório quando o país é Brasil`,
            });
          }
        });
      }
    }
  });

type DadosPessoais = z.infer<typeof dadosPessoaisSchema>;

type Contact = {
  meio_contato: string;
  descricao: string;
  acoes: ReactNode;
};
export function useFormRepresentantes() {
  const { getAllQueryStrings } = useQueryString();
  const { representanteId: rawRepresentanteId } = getAllQueryStrings();

  // Estabiliza o representanteId para evitar recarregamentos desnecessários
  const representanteId = useMemo(
    () => rawRepresentanteId,
    [rawRepresentanteId]
  );

  const { representanteSelected, isLoading } =
    useConsultarRepresentante(representanteId);
  const { ufsOptions, ufs } = useUfs();
  const { opcoesPaises } = usePaises();
  const { opcoesCategorias } = useCategorias();
  const { opcoesPronomes } = usePronomeTratamento();
  const { opcoesEntidades } = useEntidades();
  const [foto, setFoto] = useState<File | null>(null);
  const [cepResidencial, setCepResidencial] = useState<string>("");
  const [cepComercial, setCepComercial] = useState<string>("");
  const [cidadesOptionsComercial, setCidadesOptionsComercial] = useState<
    { label: string; value: string }[]
  >([]);
  const [cidadesOptionsResidencial, setCidadesOptionsResidencial] = useState<
    { label: string; value: string }[]
  >([]);
  const [dataContacts, setDataContacts] = useState<Contact[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para ordenar contatos por tipo
  const dataContactsOrdenados = useMemo(() => {
    const ordemTipos = {
      "E-mail": 1,
      "Telefone Comercial": 2,
      "Telefone Residencial": 3,
      "Fax Comercial": 4,
      "Fax Residencial": 5,
      Site: 6,
    };

    return [...dataContacts].sort((a, b) => {
      const ordemA =
        ordemTipos[a.meio_contato as keyof typeof ordemTipos] || 999;
      const ordemB =
        ordemTipos[b.meio_contato as keyof typeof ordemTipos] || 999;
      return ordemA - ordemB;
    });
  }, [dataContacts]);
  const columns = [
    {
      title: "Meio de Contato",
      key: "meio_contato",
      width: "50%",
    },
    { title: "Descrição", key: "descricao", width: "40%" },
    {
      title: "Ações",
      key: "acoes",
      width: "10%",
      action: (descricao: string) => {
        setDataContacts((prev) =>
          prev.filter((c) => c.descricao !== descricao)
        );
      },
    },
  ];

  // Função para calcular opções disponíveis baseado nos contatos existentes
  const getOpcoesContatoDisponiveis = useMemo(() => {
    const emailsAtuais = dataContacts.filter(
      (contact) => contact.meio_contato === "E-mail"
    ).length;

    const telefoneComercialExiste = dataContacts.some(
      (contact) => contact.meio_contato === "Telefone Comercial"
    );

    const telefoneResidencialExiste = dataContacts.some(
      (contact) => contact.meio_contato === "Telefone Residencial"
    );

    const siteExiste = dataContacts.some(
      (contact) => contact.meio_contato === "Site"
    );

    const faxComercialExiste = dataContacts.some(
      (contact) => contact.meio_contato === "Fax Comercial"
    );

    const faxResidencialExiste = dataContacts.some(
      (contact) => contact.meio_contato === "Fax Residencial"
    );

    return [
      {
        value: "E-mail",
        label: `E-mail ${
          emailsAtuais >= 3 ? "(máx. atingido)" : `(${emailsAtuais}/3)`
        }`,
        disabled: emailsAtuais >= 3,
      },
      {
        value: "Telefone Comercial",
        label: telefoneComercialExiste
          ? "Telefone Comercial (já cadastrado)"
          : "Telefone Comercial",
        disabled: telefoneComercialExiste,
      },
      {
        value: "Telefone Residencial",
        label: telefoneResidencialExiste
          ? "Telefone Residencial (já cadastrado)"
          : "Telefone Residencial",
        disabled: telefoneResidencialExiste,
      },
      {
        value: "Site",
        label: siteExiste ? "Site (já cadastrado)" : "Site",
        disabled: siteExiste,
      },
      {
        value: "Fax Comercial",
        label: faxComercialExiste
          ? "Fax Comercial (já cadastrado)"
          : "Fax Comercial",
        disabled: faxComercialExiste,
      },
      {
        value: "Fax Residencial",
        label: faxResidencialExiste
          ? "Fax Residencial (já cadastrado)"
          : "Fax Residencial",
        disabled: faxResidencialExiste,
      },
    ];
  }, [dataContacts]);

  const methods = useForm<DadosPessoais>({
    resolver: zodResolver(dadosPessoaisSchema),
    defaultValues: {
      ativo: "false",
      statusEndereco: "C",
    },
  });

  // Watch dos campos de UF e País
  const ufMarcadaComercial = methods.watch("idUfComercial");
  const ufMarcadaResidencial = methods.watch("idUfResidencial");
  const paisResidencial = methods.watch("idPaisResidencial");
  const paisComercial = methods.watch("idPaisComercial");

  // Verifica se o país selecionado é Brasil
  const isBrasilResidencial = paisResidencial === BRASIL_ID;
  const isBrasilComercial = paisComercial === BRASIL_ID;

  // Consulta React Query para CEP residencial
  const {
    data: dadosCepResidencial,
    isLoading: isLoadingCepResidencial,
    error: errorCepResidencial,
  } = useQuery({
    queryKey: ["viacep", cepResidencial],
    queryFn: () => ViaCepService.buscarCep(cepResidencial),
    enabled: !!cepResidencial && ViaCepService.validarCep(cepResidencial),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Consulta React Query para CEP comercial
  const {
    data: dadosCepComercial,
    isLoading: isLoadingCepComercial,
    error: errorCepComercial,
  } = useQuery({
    queryKey: ["viacep", cepComercial],
    queryFn: () => ViaCepService.buscarCep(cepComercial),
    enabled: !!cepComercial && ViaCepService.validarCep(cepComercial),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (ufMarcadaResidencial) {
      const cidadesOptions = ufs
        ?.filter((uf) => String(uf.id) == ufMarcadaResidencial)?.[0]
        ?.cidades?.map((cidade) => {
          return { label: cidade.nome, value: cidade.nome };
        });
      setCidadesOptionsResidencial(cidadesOptions || []);
    }
  }, [ufMarcadaResidencial, ufs]);

  useEffect(() => {
    if (ufMarcadaComercial) {
      const cidadesOptions = ufs
        ?.filter((uf) => String(uf.id) == ufMarcadaComercial)?.[0]
        ?.cidades?.map((cidade) => {
          return { label: cidade.nome, value: cidade.nome };
        });
      setCidadesOptionsComercial(cidadesOptions || []);
    }
  }, [ufMarcadaComercial, ufs]);

  // Effect para preencher campos quando CEP residencial for encontrado
  useEffect(() => {
    if (dadosCepResidencial) {
      // Limpa os campos antes de preencher
      methods.setValue("enderecoLogradouroResidencial", "");
      methods.setValue("enderecoBairroResidencial", "");
      methods.setValue("enderecoCidadeResidencial", "");
      methods.setValue("idUfResidencial", "");

      // Preenche os campos automaticamente
      methods.setValue(
        "enderecoLogradouroResidencial",
        dadosCepResidencial.logradouro
      );
      methods.setValue("enderecoBairroResidencial", dadosCepResidencial.bairro);
      methods.setValue(
        "enderecoCidadeResidencial",
        dadosCepResidencial.localidade
      );

      // Busca o ID da UF baseado na sigla
      const ufEncontrada = ufs?.find(
        (uf) => uf.sigla === dadosCepResidencial.uf
      );
      if (ufEncontrada) {
        methods.setValue("idUfResidencial", String(ufEncontrada.id));
      }

      // Define o país como Brasil automaticamente quando CEP é válido
      methods.setValue("idPaisResidencial", BRASIL_ID);
    }
  }, [dadosCepResidencial, methods, ufs]);

  // Effect para preencher campos quando CEP comercial for encontrado
  useEffect(() => {
    if (dadosCepComercial) {
      // Limpa os campos antes de preencher
      methods.setValue("enderecoLogradouroComercial", "");
      methods.setValue("enderecoBairroComercial", "");
      methods.setValue("enderecoCidadeComercial", "");
      methods.setValue("idUfComercial", "");

      // Preenche os campos automaticamente
      methods.setValue(
        "enderecoLogradouroComercial",
        dadosCepComercial.logradouro
      );
      methods.setValue("enderecoBairroComercial", dadosCepComercial.bairro);
      methods.setValue("enderecoCidadeComercial", dadosCepComercial.localidade);

      // Define o país como Brasil automaticamente quando CEP é válido
      methods.setValue("idPaisComercial", BRASIL_ID);

      // Busca o ID da UF baseado na sigla
      const ufEncontrada = ufs?.find((uf) => uf.sigla === dadosCepComercial.uf);
      if (ufEncontrada) {
        methods.setValue("idUfComercial", String(ufEncontrada.id));
      }
    }
  }, [dadosCepComercial, methods, ufs]);

  useMemo(() => {
    if (!representanteSelected) return [];

    const contatosArray: Contact[] = [];

    // Adicionar emails
    if (representanteSelected.email1?.trim()) {
      contatosArray.push({
        meio_contato: "E-mail",
        descricao: representanteSelected.email1.trim(),
        acoes: <TrashIcon />,
      });
    }

    if (representanteSelected.email2?.trim()) {
      contatosArray.push({
        meio_contato: "E-mail",
        descricao: representanteSelected.email2.trim(),
        acoes: <TrashIcon />,
      });
    }

    if (representanteSelected.email3?.trim()) {
      contatosArray.push({
        meio_contato: "E-mail",
        descricao: representanteSelected.email3.trim(),
        acoes: <TrashIcon />,
      });
    }

    if (representanteSelected.telefoneComplementar?.trim()) {
      contatosArray.push({
        meio_contato: "Telefone Comercial",
        descricao: representanteSelected.telefoneComplementar.trim(),
        acoes: <TrashIcon />,
      });
    }

    if (representanteSelected.telefoneResidencial?.trim()) {
      contatosArray.push({
        meio_contato: "Telefone Residencial",
        descricao: representanteSelected.telefoneResidencial.trim(),
        acoes: <TrashIcon />,
      });
    }

    if (representanteSelected.site?.trim()) {
      contatosArray.push({
        meio_contato: "Site",
        descricao: representanteSelected.site.trim(),
        acoes: <TrashIcon />,
      });
    }

    if (representanteSelected.faxComercial?.trim()) {
      contatosArray.push({
        meio_contato: "Fax Comercial",
        descricao: representanteSelected.faxComercial.trim(),
        acoes: <TrashIcon />,
      });
    }

    if (representanteSelected.faxResidencial?.trim()) {
      contatosArray.push({
        meio_contato: "Fax Residencial",
        descricao: representanteSelected.faxResidencial.trim(),
        acoes: <TrashIcon />,
      });
    }

    setDataContacts(contatosArray);
  }, [representanteSelected]);

  function addContact() {
    const meio_contato = methods.getValues("meio_contato");
    const descricao = methods.getValues("descricao");
    if (!meio_contato || !descricao) return;

    const opcaoSelecionada = getOpcoesContatoDisponiveis.find(
      (opcao) => opcao.value === meio_contato
    );

    if (opcaoSelecionada?.disabled) {
      return;
    }

    setDataContacts([
      ...dataContacts,
      { meio_contato, descricao, acoes: <TrashIcon /> },
    ]);
    methods.setValue("meio_contato", "");
    methods.setValue("descricao", "");
  }

  // Função para buscar CEP residencial
  const buscarCepResidencial = useCallback((cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      setCepResidencial(cep);
    }
  }, []);

  // Função para buscar CEP comercial
  const buscarCepComercial = useCallback((cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      setCepComercial(cep);
    }
  }, []);

  // Função para formatar CEP
  const formatarCep = useCallback((cep: string) => {
    return ViaCepService.formatarCep(cep);
  }, []);

  async function onSubmit(data: DadosPessoais) {
    setIsSubmitting(true);
    let fotoBase64: string | null = null;

    if (foto) {
      const arrayBuffer = await foto.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const binary = bytes.reduce((acc, b) => acc + String.fromCharCode(b), "");
      fotoBase64 = btoa(binary);
    }

    // Mapear contatos para os campos do banco de dados
    const emails = dataContacts
      .filter((item) => item.meio_contato === "E-mail")
      .map((item) => item.descricao);

    const contatosMapeados = {
      emails: {
        email1: emails[0] || "",
        email2: emails[1] || "",
        email3: emails[2] || "",
      },
      telefoneComercial:
        dataContacts.find((item) => item.meio_contato === "Telefone Comercial")
          ?.descricao || "",
      telefoneResidencial:
        dataContacts.find(
          (item) => item.meio_contato === "Telefone Residencial"
        )?.descricao || "",
      faxComercial:
        dataContacts.find((item) => item.meio_contato === "Fax Comercial")
          ?.descricao || "",
      faxResidencial:
        dataContacts.find((item) => item.meio_contato === "Fax Residencial")
          ?.descricao || "",
      homepage:
        dataContacts.find((item) => item.meio_contato === "Site")?.descricao ||
        "",
    };

    const { ativo, ...restData } = data;
    const payload = {
      ...restData,
      idRepresentante: representanteId,
      statusRepresentante: ativo === "true",
      fotoRepresentante: fotoBase64,
      ...contatosMapeados,
    };

    criarRepresentante(payload)
      .then(() => {
        Swal.fire({
          text: "Representante salvo com sucesso",
          icon: "success",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
        // updateQueryParams({ representanteId: null });
      })
      .catch(() => {
        Swal.fire({
          text: "Erro ao salvar representante",
          icon: "error",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  useEffect(() => {
    if (!representanteSelected) return;
    // Dados Pessoais
    methods.setValue("idRepresentante", representanteId);
    methods.setValue("nome", representanteSelected?.nome || "");
    methods.setValue("cpf", representanteSelected?.cpf || "Não informado");
    methods.setValue("rg", representanteSelected?.rg || "Não informado");
    methods.setValue(
      "dataEmissaoOrgao",

      representanteSelected?.dataEmissaoOrgao
        ? formatDateToYYYYMMDD(representanteSelected?.dataEmissaoOrgao)
        : "Não informado"
    );
    methods.setValue("nis", representanteSelected?.nis || "Não informado");
    methods.setValue(
      "orgaoEmissor",
      representanteSelected?.orgaoEmissor || "Não informado"
    );
    methods.setValue(
      "dataNascimento",
      representanteSelected?.dataNascimento
        ? formatDateToYYYYMMDD(representanteSelected?.dataNascimento)
        : "Não informado"
    );
    methods.setValue(
      "naturalidade",
      representanteSelected?.naturalidade || "Não informado"
    );

    const ativoBoolean = representanteSelected?.ativo ?? true;
    methods.setValue("ativo", ativoBoolean ? "true" : "false");

    methods.setValue(
      "statusEndereco",
      representanteSelected?.tipoEnderecoResidencial || "C"
    );

    // Endereço Comercial
    methods.setValue(
      "enderecoBairroComercial",
      representanteSelected?.bairroComercial
    );
    methods.setValue(
      "enderecoComplementoComercial",
      representanteSelected?.complementoComercial
    );
    methods.setValue(
      "enderecoLogradouroComercial",
      representanteSelected?.logradouroComercial
    );
    methods.setValue(
      "enderecoNumeroComercial",
      representanteSelected?.numeroResidenciaComercial
    );
    methods.setValue(
      "enderecoCepComercial",
      representanteSelected?.cepComercial
    );
    methods.setValue(
      "idPaisComercial",
      String(representanteSelected?.idPaisComercial)
    );
    methods.setValue(
      "idUfComercial",
      String(representanteSelected?.idUfComercial)
    );
    methods.setValue(
      "enderecoCidadeComercial",
      String(representanteSelected?.cidadeComercial)
    );

    // Endereço Residencial
    methods.setValue(
      "enderecoCepResidencial",
      representanteSelected?.cepResidencial
    );
    methods.setValue(
      "enderecoNumeroResidencial",
      representanteSelected?.numeroResidencial
    );
    methods.setValue(
      "enderecoLogradouroResidencial",
      representanteSelected?.logradouroResidencial
    );
    methods.setValue(
      "enderecoComplementoResidencial",
      representanteSelected?.complementoResidencia
    );
    methods.setValue(
      "enderecoBairroResidencial",
      representanteSelected?.bairroResidencial
    );
    methods.setValue(
      "idPaisResidencial",
      String(representanteSelected?.idPaisResidencial)
    );
    methods.setValue(
      "idUfResidencial",
      String(representanteSelected?.idUfResidencial)
    );
    methods.setValue(
      "enderecoCidadeResidencial",
      String(representanteSelected?.cidadeResidencial)
    );
    methods.setValue("idEntidade", String(representanteSelected?.idEntidade));
    methods.setValue(
      "idCategoria",
      String(representanteSelected?.categoria?.id)
    );
    methods.setValue(
      "idPronomeTratamento",
      String(representanteSelected?.idPronomeTratamento)
    );
    methods.setValue(
      "beneficiario",
      String(representanteSelected?.beneficio || "")
    );
  }, [representanteSelected, representanteId, methods]);

  return {
    representanteSelected,
    representanteId,
    isLoading,
    isSubmitting,
    methods,
    onSubmit,
    setFoto,
    opcoesPaises,
    isBrasilResidencial,
    ufsOptions,
    cidadesOptionsResidencial,
    isBrasilComercial,
    cidadesOptionsComercial,
    addContact,
    dataContacts: dataContactsOrdenados,
    columns,
    getOpcoesContatoDisponiveis,
    buscarCepResidencial,
    buscarCepComercial,
    formatarCep,
    isLoadingCepResidencial,
    isLoadingCepComercial,
    errorCepResidencial,
    errorCepComercial,
    opcoesEntidades,
    opcoesCategorias,
    opcoesPronomes,
  };
}
