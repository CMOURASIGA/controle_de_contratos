"use client";

import Label from "@/components/layouts/ui/label/label";
import Table, { ColumnTableProps } from "@/components/layouts/ui/table/table";
import { getDocument } from "@/services/documentos.service";
import type { DadosRepresentanteCompletos } from "@/types/representante-visualizacao";
import { Badge } from "@cnc-ti/layout-basic";
import { FolderOpenIcon } from "lucide-react";
import { ReactNode, useMemo } from "react";

/**
 * Interface para documentos anexos
 */
interface DocumentoAnexo {
  descricao: string;
  dataUpload: string;
  usuarioCadastro: string;
  acoes: ReactNode;
  [key: string]: string | number | React.ReactNode;
}

/**
 * Interface para observações
 */
interface Observacao {
  data: string;
  usuario: string;
  observacao: string;
  [key: string]: string | number | React.ReactNode;
}

interface OutrasInformacoesVisualizacaoProps {
  representanteSelected: DadosRepresentanteCompletos | null | undefined;
  isLoading: boolean;
}

export function OutrasInformacoesVisualizacao({
  representanteSelected,
  isLoading,
}: OutrasInformacoesVisualizacaoProps) {
  // Configuração das colunas da tabela de documentos
  const colunasDocumentos: ColumnTableProps[] = useMemo(
    () => [
      {
        key: "descricao",
        title: "Nome do Documento",
        width: "40%",
      },
      {
        key: "dataUpload",
        title: "Data Upload",
        width: "20%",
      },
      {
        key: "usuarioCadastro",
        title: "Usuario Cadastro",
        width: "20%",
      },
      {
        title: "Baixar",
        key: "acoes",
        width: "10%",
        action: (descricao: string) => {
          getDocument(descricao);
        },
      },
    ],
    []
  );

  // Configuração das colunas da tabela de observações
  const colunasObservacoes: ColumnTableProps[] = useMemo(
    () => [
      {
        key: "data",
        title: "Data",
        width: "15%",
      },
      {
        key: "usuario",
        title: "Usuário",
        width: "25%",
      },
      {
        key: "observacao",
        title: "Observação",
        width: "60%",
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Carregando outras informações...</p>
      </div>
    );
  }

  if (!representanteSelected) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          Outras informações não disponíveis no momento.
        </p>
      </div>
    );
  }

  // Dados mockados (substituir pela lógica real quando disponível)
  const documentosAnexos: DocumentoAnexo[] =
    // Exemplo de dados que viriam da API
    representanteSelected.documentos.map((doc) => {
      return {
        descricao: doc.nome,
        dataUpload: new Date(doc.dataCadastro).toLocaleDateString(),
        usuarioCadastro: doc.usuarioCadastro,
        acoes: <FolderOpenIcon />,
      };
    });

  const observacoes: Observacao[] = [
    // Exemplo de dados que viriam da API
    // {
    //   data: "20/03/2024",
    //   usuario: "João Silva",
    //   observacao: "Representante ativo e participativo nas reuniões do conselho."
    // },
  ];

  return (
    <div className="mt-6 space-y-8">
      {/* Seção de Status e Informações Gerais */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Informações Gerais
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="block text-primary text-sm font-bold leading-4">
              Status do Representante
            </span>
            <Badge variant="primary">Ativo</Badge>
          </div>
          <div className="space-y-2">
            <Label
              label="Categoria"
              value={representanteSelected.categoria.nome ?? "Não informado"}
            />
          </div>

          <div className="space-y-2">
            <Label
              label="Data de Cadastro"
              value={
                representanteSelected.dataCadastro
                  ? new Date(
                      representanteSelected.dataCadastro
                    ).toLocaleDateString()
                  : "Não informado"
              }
            />
          </div>

          <div className="space-y-2">
            <Label
              label="Responsável pelo Cadastro"
              value={
                representanteSelected.responsavelCadastro ?? "Não informado"
              }
            />
          </div>
          <div className="space-y-2">
            <Label
              label="Última Atualização"
              value={
                representanteSelected.dataAlteracao
                  ? new Date(
                      representanteSelected.dataAlteracao
                    ).toLocaleDateString()
                  : "Não informado"
              }
            />
          </div>
          <div className="space-y-2">
            <Label
              label="Responsável pela Última Atualização"
              value={
                representanteSelected.responsavelAlteracao ?? "Não informado"
              }
            />
          </div>
        </div>
      </div>

      {/* Seção de Documentos Anexos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Documentos Anexos
        </h3>

        {documentosAnexos.length > 0 ? (
          <Table
            data={documentosAnexos}
            columns={colunasDocumentos}
            aria-label="Tabela de documentos anexos"
          />
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 italic">
              Nenhum documento anexo cadastrado no momento.
            </p>
          </div>
        )}
      </div>

      {/* Seção de Observações */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Observações</h3>

        {observacoes.length > 0 ? (
          <Table
            data={observacoes}
            columns={colunasObservacoes}
            aria-label="Tabela de observações"
          />
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 italic">
              Nenhuma observação cadastrada no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
