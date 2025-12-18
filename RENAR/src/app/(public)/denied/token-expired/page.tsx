"use client";
import { signIn } from "next-auth/react";
import { Button } from "@cnc-ti/layout-basic";

export default function DeniedPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="flex items-center text-2xl mb-2 font-bold">
        Sessão expirada
      </h1>
      <p className="text-slate-600 mb-6 text-center">
        Sua sessão expirou devido ao tempo de inatividade ou à validade do
        token. <br />
        Por favor, faça login novamente para continuar acessando o sistema.
      </p>

      <Button
        onClick={() => {
          signIn("azure-ad-b2c", { callbackUrl: "/" });
        }}
      >
        Entrar
      </Button>
    </div>
  );
}
