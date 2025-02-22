/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RoomManager } from "../RoomManager";

describe("RoomManager", () => {
  const mockOnCreateRoom = jest.fn();
  const mockOnJoinRoom = jest.fn();
  const mockSetNickname = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nickname input and room buttons", () => {
    render(
      <RoomManager
        onCreateRoom={mockOnCreateRoom}
        onJoinRoom={mockOnJoinRoom}
        nickname=""
        setNickname={mockSetNickname}
      />,
    );

    expect(screen.getByPlaceholderText("Enter nickname")).toBeInTheDocument();
    expect(screen.getByText("Create Room")).toBeInTheDocument();
    expect(screen.getByText("Join Room")).toBeInTheDocument();
  });

  it("updates nickname when input changes", () => {
    render(
      <RoomManager
        onCreateRoom={mockOnCreateRoom}
        onJoinRoom={mockOnJoinRoom}
        nickname=""
        setNickname={mockSetNickname}
      />,
    );

    const input = screen.getByPlaceholderText("Enter nickname");
    fireEvent.change(input, { target: { value: "TestUser" } });

    expect(mockSetNickname).toHaveBeenCalledWith("TestUser");
  });

  it("calls onCreateRoom when Create Room button is clicked", () => {
    render(
      <RoomManager
        onCreateRoom={mockOnCreateRoom}
        onJoinRoom={mockOnJoinRoom}
        nickname="TestUser"
        setNickname={mockSetNickname}
      />,
    );

    const createButton = screen.getByText("Create Room");
    fireEvent.click(createButton);

    expect(mockOnCreateRoom).toHaveBeenCalled();
  });

  it("calls onJoinRoom when Join Room button is clicked", () => {
    render(
      <RoomManager
        onCreateRoom={mockOnCreateRoom}
        onJoinRoom={mockOnJoinRoom}
        nickname="TestUser"
        setNickname={mockSetNickname}
      />,
    );

    const joinButton = screen.getByText("Join Room");
    fireEvent.click(joinButton);

    expect(mockOnJoinRoom).toHaveBeenCalled();
  });
});
