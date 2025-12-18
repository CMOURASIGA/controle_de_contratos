'use client'

import { PageHeaderActionsContainer, PageHeader as PageHeaderClient, PageHeaderTitle, PageHeaderTitleContent } from "@cnc-ti/layout-basic"
import { ButtonBack } from "../layouts/ui/buttons/button-back/button-back";
import { ReactNode } from "react";
import { Avatar } from "../layouts/ui/avatar";

/**
 * Props do componente PageHeaderRepresentante
 */
interface PageHeaderRepresentanteProps {
    /** Título do cabeçalho */
    title: string;
    /** Descrição opcional */
    description?: string;
    /** Se deve exibir botão de voltar */
    goBack?: boolean;
    /** ID do representante para buscar a foto */
    representanteId?: number;
    /** Nome do representante para acessibilidade */
    nomeRepresentante?: string;
    /** Conteúdo adicional (botões de ação) */
    children?: ReactNode;
    /** Indica se está carregando os dados do representante */
    estaCarregandoRepresentante?: boolean;
}

/**
 * Componente de cabeçalho específico para páginas de representante
 * Inclui avatar do representante entre o botão de voltar e o título
 */
export function PageHeaderRepresentante({
    title,
    description,
    goBack = false,
    representanteId,
    nomeRepresentante,
    children,
    estaCarregandoRepresentante = false
}: PageHeaderRepresentanteProps) {
    // Monta a URL da foto do representante
    const urlFoto = representanteId
        ? `${process.env.NEXT_PUBLIC_API_URL}/representantes/${representanteId}/foto`
        : undefined;

    return (
        <PageHeaderClient>
            <PageHeaderTitleContent>
                <div className="flex items-center">
                    {goBack && (
                        <div className="mr-4">
                            <ButtonBack />
                        </div>
                    )}

                    {/* Avatar do representante */}
                    <div className="mr-4">
                        <Avatar
                            urlFoto={urlFoto}
                            textoAlternativo={nomeRepresentante}
                            tamanho="grande"
                            estaCarregando={estaCarregandoRepresentante}
                        />
                    </div>

                    {/* Título e descrição */}
                    <div className="flex-1">
                        {estaCarregandoRepresentante ? (
                            <div className="space-y-2">
                                <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
                                {description && (
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                                )}
                            </div>
                        ) : (
                            <PageHeaderTitle
                                titleAs="h1"
                                title={title}
                                description={description}
                            />
                        )}
                    </div>
                </div>
            </PageHeaderTitleContent>

            <PageHeaderActionsContainer>
                {children}
            </PageHeaderActionsContainer>
        </PageHeaderClient>
    )
}