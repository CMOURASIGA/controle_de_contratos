
import CostCentersClient from "@/components/cost-centers/CostCentersClient";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CostCentersPage() {
  return (
    <>
      <PageHeader
        title="Centros de Custo"
        description="Gerencie os centros de custo da organização."
      />
      <CostCentersClient />
    </>
  );
}
