import React, { useState } from "react";
import { colors, typography, spacing, borderRadius } from "../styles/theme";
import Button from "./common/Button";
import Card from "./common/Card";
import Input from "./common/Input";

const Home = () => {
  const [nickname, setNickname] = useState("");
  const [roomId, setRoomId] = useState("");
  const [errors, setErrors] = useState({});

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

  const handleCreateRoom = () => {
    const nicknameError = validateNickname();
    setErrors((prev) => ({ ...prev, nickname: nicknameError }));
  };

  const handleJoinRoom = () => {
    const nicknameError = validateNickname();
    const roomIdError = validateRoomId();
    setErrors({
      nickname: nicknameError,
      roomId: roomIdError,
    });
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

      <Card padding="6" className="main-card">
        <div style={formStyles}>
          <Input
            id="nickname"
            label="Nickname"
            value={nickname}
            onChange={handleNicknameChange}
            required
            error={errors.nickname}
          />

          <Input
            id="room-id"
            label="Room ID (optional for creating)"
            value={roomId}
            onChange={handleRoomIdChange}
            error={errors.roomId}
          />

          <div style={buttonGroupStyles}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleCreateRoom}
              disabled={!nickname}
              tooltip={getCreateButtonTooltip()}
              data-testid="create-room-button"
            >
              Create Room
            </Button>

            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleJoinRoom}
              disabled={!nickname || !roomId}
              tooltip={getJoinButtonTooltip()}
              data-testid="join-room-button"
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
