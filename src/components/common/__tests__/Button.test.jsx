import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Button from "../Button";

describe("Button", () => {
  it("matches snapshot with default props", () => {
    const { container } = render(<Button>Click me</Button>);
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with different variants", () => {
    const { container, rerender } = render(
      <Button variant="primary">Primary</Button>,
    );
    expect(container).toMatchSnapshot();

    rerender(<Button variant="outline">Outline</Button>);
    expect(container).toMatchSnapshot();

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot when disabled with tooltip", () => {
    const { container } = render(
      <Button disabled tooltip="Please fill required fields">
        Disabled Button
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("applies different variants correctly", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole("button");
    expect(button).toHaveStyle({ backgroundColor: "#2563EB" }); // primary color

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveStyle({ backgroundColor: "transparent" });
    expect(button).toHaveStyle({ border: "2px solid #2563EB" });
  });

  it("handles disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveStyle({ cursor: "not-allowed" });
  });

  it("shows tooltip when disabled and hovered", async () => {
    render(
      <Button disabled tooltip="Please fill required fields">
        Disabled
      </Button>,
    );

    const container = screen.getByTestId("disabled-button-container");
    const tooltip = screen.getByText("Please fill required fields");

    expect(tooltip).toHaveStyle({ visibility: "hidden", opacity: "0" });

    fireEvent.mouseEnter(container);
    expect(tooltip).toHaveStyle({ visibility: "visible", opacity: "1" });

    fireEvent.mouseLeave(container);
    expect(tooltip).toHaveStyle({ visibility: "hidden", opacity: "0" });
  });

  it("handles click events when not disabled", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies different sizes correctly", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveStyle({ fontSize: "0.875rem" });

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveStyle({ minWidth: "140px" });
  });

  it("handles full width styling", () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByTestId("full-width-button-container")).toHaveStyle({
      width: "100%",
    });
  });
});
