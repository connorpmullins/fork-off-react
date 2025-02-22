import React from "react";
import Card from "./common/Card";
import Button from "./common/Button";
import Input from "./common/Input";
import { colors, typography, spacing } from "../styles/theme";

const PlayerList = ({ players }) => (
  <div style={{ marginBottom: spacing[6] }}>
    <h3 style={{ ...typography.heading3, marginBottom: spacing[3] }}>
      Players
    </h3>
    {players.map((player) => (
      <div
        key={player.id}
        style={{
          display: "flex",
          alignItems: "center",
          padding: spacing[2],
          borderBottom: `1px solid ${colors.neutral.gray200}`,
        }}
      >
        <span style={{ flex: 1 }}>{player.nickname}</span>
        {player.isHost && (
          <span
            style={{
              backgroundColor: colors.primary[500],
              color: colors.white,
              padding: `${spacing[1]} ${spacing[2]}`,
              borderRadius: "9999px",
              fontSize: typography.fontSize.sm,
            }}
          >
            Host
          </span>
        )}
      </div>
    ))}
  </div>
);

const HostConfigView = ({
  config,
  onConfigChange,
  onStartGame,
  players,
  roomId,
}) => {
  const handleChange = (field, value) => {
    onConfigChange({
      ...config,
      [field]: value,
    });
  };

  return (
    <Card>
      <h2 style={{ ...typography.heading2, marginBottom: spacing[4] }}>
        Room Settings
      </h2>

      <div style={{ marginBottom: spacing[6] }}>
        <h3 style={{ ...typography.heading3, marginBottom: spacing[3] }}>
          Room Code: {roomId}
        </h3>
        <p style={{ color: colors.neutral.gray600, marginBottom: spacing[4] }}>
          Share this code with your friends to invite them!
        </p>
      </div>

      <div style={{ marginBottom: spacing[6] }}>
        <label style={{ display: "block", marginBottom: spacing[2] }}>
          Number of Rounds
        </label>
        <Input
          type="number"
          id="numberOfRounds"
          min={1}
          max={10}
          value={config.numberOfRounds.toString()}
          onChange={(e) =>
            handleChange("numberOfRounds", parseInt(e.target.value, 10))
          }
          style={{ marginBottom: spacing[4] }}
        />

        <label style={{ display: "block", marginBottom: spacing[2] }}>
          Story Style
        </label>
        <Input
          id="storyStyle"
          value={config.storyStyle}
          onChange={(e) => handleChange("storyStyle", e.target.value)}
          placeholder="e.g., Fantasy, Sci-fi, Horror"
          style={{ marginBottom: spacing[4] }}
        />

        <label style={{ display: "block", marginBottom: spacing[2] }}>
          Fork Variance (1-10)
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: spacing[2],
          }}
        >
          <input
            type="range"
            id="variance"
            min="1"
            max="10"
            value={config.variance}
            onChange={(e) =>
              handleChange("variance", parseInt(e.target.value, 10))
            }
            style={{ flex: 1, marginRight: spacing[2] }}
          />
          <span style={{ minWidth: "2.5em", textAlign: "right" }}>
            {config.variance}
          </span>
        </div>
        <p
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.neutral.gray600,
          }}
        >
          Lower values keep forks similar, higher values allow more creative
          freedom
        </p>
      </div>

      <PlayerList players={players} />

      <Button
        onClick={onStartGame}
        disabled={players.length < 1}
        style={{ width: "100%" }}
      >
        {players.length === 1 ? "Start Solo Game" : "Start Game"}
      </Button>

      {players.length === 1 && (
        <p
          style={{
            marginTop: spacing[4],
            color: colors.neutral.gray600,
            textAlign: "center",
            fontSize: typography.fontSize.sm,
          }}
        >
          Playing solo will generate AI suggestions for you to choose from.
        </p>
      )}
    </Card>
  );
};

const PlayerWaitingView = ({ players, roomId }) => (
  <Card>
    <h2 style={{ ...typography.heading2, marginBottom: spacing[4] }}>
      Waiting for Host
    </h2>

    <div style={{ marginBottom: spacing[6] }}>
      <h3 style={{ ...typography.heading3, marginBottom: spacing[3] }}>
        Room Code: {roomId}
      </h3>
      <p style={{ color: colors.neutral.gray600 }}>
        The host is setting up the game. Get ready!
      </p>
    </div>

    <PlayerList players={players} />
  </Card>
);

const WaitingRoom = ({
  isHost,
  config,
  onConfigChange,
  onStartGame,
  players,
  roomId,
}) => {
  if (isHost) {
    return (
      <HostConfigView
        config={config}
        onConfigChange={onConfigChange}
        onStartGame={onStartGame}
        players={players}
        roomId={roomId}
      />
    );
  }

  return <PlayerWaitingView players={players} roomId={roomId} />;
};

export default WaitingRoom;
