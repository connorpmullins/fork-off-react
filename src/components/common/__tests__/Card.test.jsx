import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Card from "../Card";

describe("Card", () => {
  it("matches snapshot with default props", () => {
    const { container } = render(
      <Card>
        <div>Test content</div>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with different padding sizes", () => {
    const { container, rerender } = render(
      <Card padding="2">
        <div>Content</div>
      </Card>,
    );
    expect(container).toMatchSnapshot();

    rerender(
      <Card padding="8">
        <div>Content</div>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with different elevations", () => {
    const { container, rerender } = render(
      <Card elevation="sm">
        <div>Content</div>
      </Card>,
    );
    expect(container).toMatchSnapshot();

    rerender(
      <Card elevation="lg">
        <div>Content</div>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders children correctly", () => {
    render(
      <Card>
        <div>Test content</div>
      </Card>,
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies different padding sizes", () => {
    const { rerender } = render(
      <Card padding="2" data-testid="card">
        <div>Content</div>
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveStyle({ padding: "0.5rem" });

    rerender(
      <Card padding="8" data-testid="card">
        <div>Content</div>
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveStyle({ padding: "2rem" });
  });

  it("applies different elevation styles", () => {
    const { rerender } = render(
      <Card elevation="sm" data-testid="card">
        <div>Content</div>
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveStyle({
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    });

    rerender(
      <Card elevation="lg" data-testid="card">
        <div>Content</div>
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveStyle({
      boxShadow:
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    });
  });

  it("handles click events when provided", () => {
    const handleClick = jest.fn();
    render(
      <Card onClick={handleClick}>
        <div>Clickable content</div>
      </Card>,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies hover styles when hoverable prop is true", () => {
    render(
      <Card hoverable data-testid="card">
        <div>Hoverable content</div>
      </Card>,
    );

    expect(screen.getByTestId("card")).toHaveStyle({ cursor: "pointer" });
  });

  it("applies correct accessibility attributes when clickable", () => {
    render(
      <Card onClick={() => {}}>
        <div>Clickable content</div>
      </Card>,
    );

    expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "0");
  });
});
