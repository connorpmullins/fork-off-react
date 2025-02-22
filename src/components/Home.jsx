import React, { useState } from "react";
import { colors, typography, spacing } from "../styles/theme";
import Button from "./common/Button";
import Card from "./common/Card";
import Input from "./common/Input";
import { useGame } from "../context/GameContext";

const Home = () => {
  const { createRoom, joinRoom } = useGame();
  const [nickname, setNickname] = useState("");
  const [roomId, setRoomId] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const containerStyles = {
    minHeight: "100vh",
    backgroundColor: colors.neutral.background,
    padding: spacing[8],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const headerStyles = {
    marginBottom: spacing[8],
    textAlign: "center",
  };

  const titleStyles = {
    color: colors.neutral.gray900,
    fontSize: typography.fontSize["4xl"],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[2],
  };

  const subtitleStyles = {
    color: colors.neutral.gray600,
    fontSize: typography.fontSize.lg,
    maxWidth: "600px",
    marginBottom: spacing[8],
  };

  const formStyles = {
    width: "100%",
    maxWidth: "400px",
  };

  const buttonGroupStyles = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: spacing[4],
    marginTop: spacing[6],
  };

  const validateNickname = () => {
    if (!nickname) {
      return "Nickname is required";
    }
    if (nickname.length < 3) {
      return "Nickname must be at least 3 characters";
    }
    return null;
  };

  const validateRoomId = () => {
    if (!roomId) {
      return "Room ID is required";
    }
    if (roomId.length < 4) {
      return "Room ID must be at least 4 characters";
    }
    return null;
  };

  const handleCreateRoom = async () => {
    const nicknameError = validateNickname();
    if (nicknameError) {
      setErrors((prev) => ({ ...prev, nickname: nicknameError }));
      return;
    }

    setIsLoading(true);
    try {
      await createRoom(nickname);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to create room",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    const nicknameError = validateNickname();
    const roomIdError = validateRoomId();

    if (nicknameError || roomIdError) {
      setErrors({
        nickname: nicknameError,
        roomId: roomIdError,
      });
      return;
    }

    setIsLoading(true);
    try {
      await joinRoom(nickname, roomId);
    } catch (error) {
      let errorMessage = "Failed to join room";
      if (error.message === "Room not found") {
        errorMessage = "Room not found. Please check the room ID.";
      } else if (error.message === "Game has already started") {
        errorMessage = "Cannot join - game has already started.";
      }
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setErrors((prev) => ({ ...prev, nickname: null }));
  };

  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value);
    setErrors((prev) => ({ ...prev, roomId: null }));
  };

  const getCreateButtonTooltip = () => {
    if (!nickname) return "Please enter a nickname";
    return null;
  };

  const getJoinButtonTooltip = () => {
    if (!nickname) return "Please enter a nickname";
    if (!roomId) return "Please enter a room ID";
    return null;
  };

  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <h1 style={titleStyles}>Fork-Off Game</h1>
        <p style={subtitleStyles}>
          Challenge your friends in this exciting multiplayer game where
          strategy meets fun. Create a room or join an existing one to get
          started!
        </p>
      </header>

      <Card>
        <div style={formStyles}>
          <Input
            id="nickname"
            label="Nickname"
            value={nickname}
            onChange={handleNicknameChange}
            error={errors.nickname}
            required
          />

          <Input
            id="room-id"
            label="Room ID (optional for creating)"
            value={roomId}
            onChange={handleRoomIdChange}
            error={errors.roomId}
          />

          {errors.submit && (
            <div style={{ color: colors.error, marginTop: spacing[2] }}>
              {errors.submit}
            </div>
          )}

          <div style={buttonGroupStyles}>
            <Button
              onClick={handleCreateRoom}
              disabled={!nickname || isLoading}
              tooltip={getCreateButtonTooltip()}
              loading={isLoading}
            >
              Create Room
            </Button>

            <Button
              variant="secondary"
              onClick={handleJoinRoom}
              disabled={!nickname || !roomId || isLoading}
              tooltip={getJoinButtonTooltip()}
              loading={isLoading}
            >
              Join Room
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Home;
