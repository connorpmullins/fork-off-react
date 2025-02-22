import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../Home";
import { GameProvider } from "../../context/GameContext";

// Mock functions for GameContext
const mockCreateRoom = jest.fn();
const mockJoinRoom = jest.fn();

// Mock the useGame hook
jest.mock("../../context/GameContext", () => ({
  ...jest.requireActual("../../context/GameContext"),
  useGame: () => ({
    createRoom: mockCreateRoom,
    joinRoom: mockJoinRoom,
    gameState: {
      roomId: null,
      nickname: null,
      isHost: false,
      players: [],
      gameStarted: false,
      phase: "lobby",
    },
  }),
}));

describe("Home", () => {
  beforeEach(() => {
    // Clear mock function calls before each test
    mockCreateRoom.mockClear();
    mockJoinRoom.mockClear();
  });

  const getNicknameInput = () =>
    screen.getByRole("textbox", { name: /nickname/i });
  const getRoomInput = () => screen.getByRole("textbox", { name: /room/i });

  it("renders the home page with all required elements", () => {
    render(<Home />);

    expect(screen.getByText("Fork-Off Game")).toBeInTheDocument();
    expect(getNicknameInput()).toBeInTheDocument();
    expect(getRoomInput()).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create room/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /join room/i })
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

  it("calls createRoom when Create Room button is clicked", async () => {
    render(<Home />);

    userEvent.type(getNicknameInput(), "testuser");
    userEvent.click(screen.getByRole("button", { name: /create room/i }));

    expect(mockCreateRoom).toHaveBeenCalledWith("testuser");
  });

  it("calls joinRoom when Join Room button is clicked", async () => {
    render(<Home />);

    userEvent.type(getNicknameInput(), "testuser");
    userEvent.type(getRoomInput(), "room123");
    userEvent.click(screen.getByRole("button", { name: /join room/i }));

    expect(mockJoinRoom).toHaveBeenCalledWith("testuser", "room123");
  });
});
