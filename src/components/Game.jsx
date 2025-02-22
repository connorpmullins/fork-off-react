import React from "react";
import { useGame } from "../context/GameContext";
import Button from "./common/Button";
import Card from "./common/Card";
import { colors, typography, spacing } from "../styles/theme";

const Game = () => {
  const { gameState, leaveRoom } = useGame();
  const { roomId, nickname, isHost, players } = gameState;

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
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[2],
  };

  const subtitleStyles = {
    color: colors.neutral.gray600,
    fontSize: typography.fontSize.lg,
    marginBottom: spacing[4],
  };

  const contentStyles = {
    width: "100%",
    maxWidth: "600px",
  };

  const playerListStyles = {
    marginTop: spacing[6],
  };

  const playerItemStyles = {
    display: "flex",
    alignItems: "center",
    padding: spacing[4],
    borderBottom: `1px solid ${colors.neutral.gray200}`,
  };

  const hostBadgeStyles = {
    backgroundColor: colors.primary[500],
    color: colors.white,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: "9999px",
    fontSize: typography.fontSize.sm,
    marginLeft: spacing[2],
  };

  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <h1 style={titleStyles}>Game Room: {roomId}</h1>
        <p style={subtitleStyles}>
          Welcome, {nickname}! {isHost ? "You are the host." : ""}
        </p>
      </header>

      <Card style={contentStyles}>
        <div>
          <h2 style={{ ...titleStyles, fontSize: typography.fontSize.xl }}>
            Players
          </h2>
          <div style={playerListStyles}>
            {players.map((player) => (
              <div key={player.id} style={playerItemStyles}>
                <span style={{ flex: 1 }}>{player.nickname}</span>
                {player.isHost && <span style={hostBadgeStyles}>Host</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: spacing[8] }}>
          <Button
            variant="secondary"
            onClick={leaveRoom}
            style={{ width: "100%" }}
          >
            Leave Room
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Game;
