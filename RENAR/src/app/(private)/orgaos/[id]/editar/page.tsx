import { EditarOrgao } from "@/components/orgaos/editar-orgao";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Editar Órgão | RENAR",
    description: "Edite os dados do órgão cadastrado no RENAR",
};

export default async function PageEditarOrgao({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const orgaoId = await searchParams?.orgaoId;

  if (!orgaoId) {
    redirect(`/orgaos/${params.id}/editar?orgaoId=${params.id}`);
  }

  return (
    <div>
      <EditarOrgao />
    </div>
  );
}
