import { ResultContainer } from "../layouts/resultContainer";
import { ItemCarregando } from "./items/item-skeleton";

export function GradeRepresetacaoCarregando() {
  return (
    <ResultContainer aria-label="Carregando representantes">
      {Array.from({ length: 12 }).map((_, idx) => (
        <ItemCarregando key={idx} />
      ))}
    </ResultContainer>
  );
}
