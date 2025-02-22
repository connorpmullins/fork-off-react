import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../Home";

describe("Home", () => {
  const getNicknameInput = () =>
    screen.getByRole("textbox", { name: /nickname/i });
  const getRoomInput = () => screen.getByRole("textbox", { name: /room id/i });

  it("renders the home page with all required elements", () => {
    render(<Home />);

    expect(screen.getByText("Fork-Off Game")).toBeInTheDocument();
    expect(getNicknameInput()).toBeInTheDocument();
    expect(getRoomInput()).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create room/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /join room/i }),
    ).toBeInTheDocument();
  });

  it("matches snapshot of initial state", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with filled form", () => {
    const { container } = render(<Home />);

    userEvent.type(getNicknameInput(), "testuser");
    userEvent.type(getRoomInput(), "room123");

    expect(container).toMatchSnapshot();
  });
});
