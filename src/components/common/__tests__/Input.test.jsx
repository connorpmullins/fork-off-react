import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Input from "../Input";

describe("Input", () => {
  const defaultProps = {
    id: "test-input",
    value: "",
    onChange: jest.fn(),
  };

  it("renders with default props", () => {
    render(<Input {...defaultProps} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("displays label when provided", () => {
    render(<Input {...defaultProps} label="Username" />);
    const label = screen.getByText("Username");
    expect(label).toBeInTheDocument();
  });

  it("shows required indicator when required prop is true", () => {
    render(<Input {...defaultProps} label="Username" required />);
    const requiredIndicator = screen.getByText("*");
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveStyle({ color: "#ef4444" });
  });

  it("displays error message when error prop is provided", () => {
    const errorMessage = "This field is required";
    render(<Input {...defaultProps} error={errorMessage} />);
    const error = screen.getByText(errorMessage);
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle({ color: "#ef4444" });
  });

  it("applies error styles to input when error prop is provided", () => {
    render(<Input {...defaultProps} error="Error message" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveStyle({ borderColor: "#ef4444" });
  });

  it("handles password input type", () => {
    render(<Input {...defaultProps} type="password" />);
    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("type", "password");
  });

  it("applies correct aria attributes", () => {
    render(
      <Input
        {...defaultProps}
        required
        error="Error message"
        label="Username"
      />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("matches snapshot with default props", () => {
    const { container } = render(<Input {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with label and required indicator", () => {
    const { container } = render(
      <Input {...defaultProps} label="Username" required />,
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with error state", () => {
    const { container } = render(
      <Input {...defaultProps} error="This field is required" />,
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with all features", () => {
    const { container } = render(
      <Input
        {...defaultProps}
        label="Username"
        required
        error="This field is required"
        type="password"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
