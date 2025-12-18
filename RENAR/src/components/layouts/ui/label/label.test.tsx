import { render, screen } from "@testing-library/react";
import React from "react";
import Label, { LabelProps } from "./label";

describe("LabelComponent", () => {
  const renderComponent = ({ label, value }: LabelProps) => {
    render(<Label label={label} value={value} />);
  };

  it("should render the label and value correctly", () => {
    renderComponent({ label: "Nome", value: "João Silva" });

    const label = screen.getByText("Nome");
    const value = screen.getByText("João Silva");

    expect(label).toBeInTheDocument();
    expect(value).toBeInTheDocument();
  });

  it("should display '-' when value is null", () => {
    renderComponent({ label: "Cidade", value: null });

    const label = screen.getByText("Cidade");
    const value = screen.getByText("-");

    expect(label).toBeInTheDocument();
    expect(value).toBeInTheDocument();
  });

  it("should display '-' when value is undefined", () => {
    render(<Label label="Estado" />);

    const label = screen.getByText("Estado");
    const value = screen.getByText("-");

    expect(label).toBeInTheDocument();
    expect(value).toBeInTheDocument();
  });

  it("should render a ReactElement as value", () => {
    render(
      <Label
        label="Link"
        value={<span data-testid="custom-element">Externo</span>}
      />
    );

    expect(screen.getByText("Link")).toBeInTheDocument();
    expect(screen.getByTestId("custom-element")).toHaveTextContent("Externo");
  });

  it("ignores the url prop if it is not used in the component", () => {
    render(
      <Label label="Site" value="exemplo.com" url="https://exemplo.com" />
    );

    const icon = screen.getByTestId("external-link-icon");

    expect(icon).toBeInTheDocument();
  });

  it("allows you to click on the external link icon", () => {
    render(
      <Label label="Site" value="exemplo.com" url="https://exemplo.com" />
    );

    const icon = screen.getByTestId("external-link-icon");

    expect(icon.closest("a")).toHaveAttribute("href", "https://exemplo.com");
  });
});
