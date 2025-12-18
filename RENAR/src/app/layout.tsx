import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@cnc-ti/layout-basic/styles";
import "@/styles/globals.css";
import "@/lib/env";
import { ReactQueryProvider } from "@/providers/react-query";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rede Nacional de Representantes - RENAR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${montserrat.className} antialiased w-full relative`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
