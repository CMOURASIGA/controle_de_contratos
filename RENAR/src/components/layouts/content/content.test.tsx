import { render, screen } from "@testing-library/react";
import { Content } from "./content";

describe("", () => {
  it("must correctly apply responsive classes", () => {
    render(<Content>Conteúdo</Content>);

    const contentDiv = screen.getByTestId("content-component") as HTMLElement;

    expect(contentDiv).toHaveClass("lg:w-2/3 md:w-2/2 w-full mx-auto");
  });
});
