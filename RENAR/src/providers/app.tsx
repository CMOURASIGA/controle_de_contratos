"use client";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "./query-provider";

interface Props {
  children: React.ReactNode;
}

/**
 * Provider principal da aplicação
 * @param children Componentes filhos
 */
export function AppProvider({ children }: Props) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </SessionProvider>
  );
}
