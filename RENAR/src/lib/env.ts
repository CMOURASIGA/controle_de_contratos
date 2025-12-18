import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string({
    message: "URL da API pública é obrigatória",
  }).default("http://localhost:3003"),
  AZURE_AD_B2C_TENANT_NAME: z.string({
    message: "Nome do tenant do Azure AD B2C é obrigatório",
  }).optional(),
  AZURE_AD_B2C_CLIENT_ID: z.string({
    message: "Client ID do Azure AD B2C é obrigatório",
  }).optional(),
  AZURE_AD_B2C_CLIENT_SECRET: z.string({
    message: "Client Secret do Azure AD B2C é obrigatório",
  }).optional(),
  AZURE_AD_B2C_PRIMARY_USER_FLOW: z.string({
    message: "User Flow principal do Azure AD B2C é obrigatório",
  }).optional(),
  NEXTAUTH_URL: z.string({
    message: "URL do NextAuth é obrigatória",
  }).default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string({
    message: "Secret do NextAuth é obrigatório",
  }).default("desenvolvimento-secret-key-muito-longa-e-segura"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Erro de configuração nas variáveis de ambiente:",
    parsedEnv.error.flatten().fieldErrors
  );
  throw new Error("Variáveis de ambiente inválidas. Verifique o log acima.");
}

export const env = parsedEnv.data;
