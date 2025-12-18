import { ReactNode } from "react";
import Link, { LinkProps } from "next/link";

export interface CartaoAcaoPaginaProps extends LinkProps {
    /** Título do cartão */
    titulo?: string;
    /** Descrição da ação do cartão */
    descricao?: string;
    /** Ícone do cartão */
    icone?: ReactNode;
    /** Classes CSS adicionais */
    className?: string;
}

export function CartaoAcaoPagina({
    titulo,
    descricao,
    icone,
    className = "",
    ...props
}: CartaoAcaoPaginaProps) {

    return (
        <Link
            className={`cursor-pointer hover:shadow-md transition-shadow border rounded p-5 ${className}`}
            {...props}
        >
            <div className="flex flex-col items-center justify-center p-6">
                {icone && <div className="text-blue-600 mb-4">{icone}</div>}
                {titulo && <h3 className="text-base font-bold text-center">{titulo}</h3>}
                {descricao && <span className="text-xs text-slate-500 text-center">{descricao}</span>}
            </div>
        </Link>
    )
}