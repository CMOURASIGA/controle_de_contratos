import { ResultContainer } from "../resultContainer";
import { RepresentanteCardSkeleton } from "./cards/card-representante/card-representante-skeleton";

/**
 * Componente de skeleton para o grid de representantes durante o carregamento
 */
export function GridRepresentantesSkeleton() {
  return (
    <ResultContainer aria-label="Carregando representantes">
      {Array.from({ length: 4 }).map((_, idx) => (
        <RepresentanteCardSkeleton key={idx} />
      ))}
    </ResultContainer>
  );
}