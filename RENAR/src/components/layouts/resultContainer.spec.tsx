// ResultContainer.test.tsx
import { render, screen } from "@testing-library/react";
import { ResultContainer } from "./resultContainer";

describe("ResultContainer", () => {
  it("renderiza os filhos corretamente", () => {
    render(
      <ResultContainer>
        <div data-testid="child-1">Filho 1</div>
        <div data-testid="child-2">Filho 2</div>
      </ResultContainer>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByText("Filho 1")).toBeInTheDocument();
    expect(screen.getByText("Filho 2")).toBeInTheDocument();
  });

  it("aplica classes de grid corretamente", () => {
    const { container } = render(
      <ResultContainer>
        <div>Exemplo</div>
      </ResultContainer>
    );

    const gridDiv = container.firstChild as HTMLElement;

    expect(gridDiv).toHaveClass("grid");
    expect(gridDiv).toHaveClass("grid-cols-1");
    expect(gridDiv).toHaveClass("sm:grid-cols-2");
    expect(gridDiv).toHaveClass("md:grid-cols-3");
    expect(gridDiv).toHaveClass("lg:grid-cols-4");
  });
});
