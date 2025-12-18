import { render, screen, fireEvent } from "@testing-library/react";
import { Drawer, DrawerHeader, DrawerContent, DrawerFooter } from "./drawer";
import { useDrawer } from "@/hooks/use-drawer";
import "@testing-library/jest-dom";

jest.mock("@/hooks/use-drawer", () => ({
  useDrawer: jest.fn(),
}));

describe("DrawerComponent", () => {
  const mockCloseDrawer = jest.fn();

  const renderComponent = (isOpen: boolean, props?: { width?: string }) => {
    const mockUseDrawer = useDrawer as jest.Mock;
    mockUseDrawer.mockReturnValue({
      activeDrawer: isOpen ? "test-drawer" : "",
      closeDrawer: mockCloseDrawer,
    });

    const defaultProps = {
      isOpen,
      width: props?.width ?? "700px",
      children: <div>Content</div>,
    };

    render(
      <Drawer {...defaultProps} id="test-drawer">
        <DrawerHeader>Meu Título</DrawerHeader>
        <DrawerContent>Conteúdo do Drawer</DrawerContent>
        <DrawerFooter>Rodapé</DrawerFooter>
      </Drawer>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display the Drawer when active", () => {
    renderComponent(true);

    const overlay = screen.getByTestId("drawer-overlay");
    expect(overlay).toHaveClass("opacity-100 pointer-events-auto");

    const header = screen.getByText("Meu Título");
    const content = screen.getByText("Conteúdo do Drawer");
    const footer = screen.getByText("Rodapé");

    expect(header).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(footer).toBeInTheDocument();

    const drawer = screen.getByTestId("drawer-container");

    expect(drawer).toHaveClass("translate-x-0");
  });

  it("should not display Drawer when inactive", () => {
    renderComponent(false);

    const overlay = screen.getByTestId("drawer-overlay");
    expect(overlay).toHaveClass("opacity-0 pointer-events-none");

    const drawer = screen.getByTestId("drawer-container");

    expect(drawer).toHaveClass("translate-x-full");
  });

  it("should call closeDrawer when clicking outside (overlay)", () => {
    renderComponent(true);

    const overlay = screen.getByTestId("drawer-overlay");
    fireEvent.click(overlay);

    expect(mockCloseDrawer).toHaveBeenCalled();
  });

  it("should call closeDrawer when clicking the close button", () => {
    renderComponent(true);

    const closeButton = screen.getByRole("button", { name: "Fechar Drawer" });
    fireEvent.click(closeButton);

    expect(mockCloseDrawer).toHaveBeenCalled();
  });

  it("must apply responsive width classes and set style.width on desktop", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1280,
    });

    window.dispatchEvent(new Event("resize"));
    const width = "700px";
    renderComponent(true, { width });

    const drawer = screen.getByTestId("drawer-container");

    expect(drawer).toHaveClass("w-full lg:w-auto");
    expect(drawer).toHaveStyle({ width });
  });
});
