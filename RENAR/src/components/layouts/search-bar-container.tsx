import { ReactNode } from "react";

interface SearchBarContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Container padrão para envolver barras de busca em páginas de listagem.
 * Aplica espaçamento, cor de fundo e borda inferior.
 */
export function SearchBarContainer({
  children,
  className = "",
}: SearchBarContainerProps) {
  return (
    <div className={`px-8 py-10 border-b mb-8 bg-gray-50 ${className}`}>
      {children}
    </div>
  );
}
