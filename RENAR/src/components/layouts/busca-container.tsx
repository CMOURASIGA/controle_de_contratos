import { ReactNode } from "react";

interface SearchBarContainerProps {
  children: ReactNode;
  className?: string;
}

export function BuscaContainer({
  children,
  className = "",
}: SearchBarContainerProps) {
  return (
    <div className={`px-8 py-10 border-b mb-8 bg-gray-50 ${className}`}>
      {children}
    </div>
  );
}
