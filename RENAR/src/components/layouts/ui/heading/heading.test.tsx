import { render, screen } from "@testing-library/react";
import { Heading } from "./heading";

describe("HeadingComponent", () => {

  const renderComponent = ({ title }: { title: string }) => {
    render(<Heading title={title} />);
  }

  it("should render the title passed via props", () => {
    renderComponent({
      title: "Título de Teste"
    });

    const heading = screen.getByRole("heading", { level: 2 })

    expect(heading).toHaveTextContent("Título de Teste");
  });

  it("must have the correct class", () => {
    renderComponent({
      title: "Outro Título"
    });

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toHaveClass("text-lg text-[#00247d] font-semibold mb-4");

  });

  it("must not contain unexpected child elements", () => {
    renderComponent({
      title: "Outro Título"
    });

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading.children.length).toBe(0);
  });
});
