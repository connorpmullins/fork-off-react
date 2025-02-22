import React from "react";
import { useGame } from "../context/GameContext";
import Button from "./common/Button";
import Card from "./common/Card";
import Input from "./common/Input";
import WaitingRoom from "./WaitingRoom";
import { colors, typography, spacing } from "../styles/theme";

const WritingPhase = ({ submitStory, roundTimer }) => {
  const [story, setStory] = React.useState("");
  const timeLeft = Math.max(0, roundTimer - Date.now());

  return (
    <Card>
      <h2 style={{ ...typography.heading2, marginBottom: spacing[4] }}>
        Write Your Story
      </h2>
      <p style={{ marginBottom: spacing[4], color: colors.neutral.gray600 }}>
        Time left: {Math.ceil(timeLeft / 1000)}s
      </p>
      <Input
        multiline
        rows={4}
        value={story}
        onChange={(e) => setStory(e.target.value)}
        placeholder="Once upon a time..."
        style={{ marginBottom: spacing[4] }}
      />
      <Button
        onClick={() => submitStory(story)}
        disabled={!story.trim() || timeLeft <= 0}
        style={{ width: "100%" }}
      >
        Submit Story
      </Button>
    </Card>
  );
};

const ForkingPhase = ({ currentStory, submitFork, roundTimer }) => {
  const [fork, setFork] = React.useState("");
  const timeLeft = Math.max(0, roundTimer - Date.now());

  return (
    <Card>
      <h2 style={{ ...typography.heading2, marginBottom: spacing[4] }}>
        Create Your Fork
      </h2>
      <p style={{ marginBottom: spacing[4], color: colors.neutral.gray600 }}>
        Time left: {Math.ceil(timeLeft / 1000)}s
      </p>
      <div
        style={{
          padding: spacing[4],
          backgroundColor: colors.neutral.gray100,
          borderRadius: spacing[2],
          marginBottom: spacing[4],
        }}
      >
        {currentStory}
      </div>
      <Input
        multiline
        rows={4}
        value={fork}
        onChange={(e) => setFork(e.target.value)}
        placeholder="Continue the story..."
        style={{ marginBottom: spacing[4] }}
      />
      <Button
        onClick={() => submitFork(fork)}
        disabled={!fork.trim() || timeLeft <= 0}
        style={{ width: "100%" }}
      >
        Submit Fork
      </Button>
    </Card>
  );
};

const VotingPhase = ({ currentStory, forks, submitVote, roundTimer }) => {
  const [selectedFork, setSelectedFork] = React.useState(null);
  const timeLeft = Math.max(0, roundTimer - Date.now());

  return (
    <Card>
      <h2 style={{ ...typography.heading2, marginBottom: spacing[4] }}>
        Vote for the Best Fork
      </h2>
      <p style={{ marginBottom: spacing[4], color: colors.neutral.gray600 }}>
        Time left: {Math.ceil(timeLeft / 1000)}s
      </p>
      <div
        style={{
          padding: spacing[4],
          backgroundColor: colors.neutral.gray100,
          borderRadius: spacing[2],
          marginBottom: spacing[4],
        }}
      >
        {currentStory}
      </div>
      <div style={{ marginBottom: spacing[4] }}>
        {forks.map((fork) => (
          <div
            key={fork.id}
            onClick={() => setSelectedFork(fork.id)}
            style={{
              padding: spacing[4],
              marginBottom: spacing[2],
              border: `2px solid ${selectedFork === fork.id ? colors.primary[500] : colors.neutral.gray200}`,
              borderRadius: spacing[2],
              cursor: "pointer",
            }}
          >
            {fork.text}
          </div>
        ))}
      </div>
      <Button
        onClick={() => submitVote(selectedFork)}
        disabled={!selectedFork || timeLeft <= 0}
        style={{ width: "100%" }}
      >
        Submit Vote
      </Button>
    </Card>
  );
};

const ResultsPhase = ({ currentStory, forks, votes }) => {
  const voteCount = {};
  Object.values(votes).forEach((forkId) => {
    voteCount[forkId] = (voteCount[forkId] || 0) + 1;
  });

  const sortedForks = [...forks].sort(
    (a, b) => (voteCount[b.id] || 0) - (voteCount[a.id] || 0)
  );

  return (
    <Card>
      <h2 style={{ ...typography.heading2, marginBottom: spacing[4] }}>
        Results
      </h2>
      <div
        style={{
          padding: spacing[4],
          backgroundColor: colors.neutral.gray100,
          borderRadius: spacing[2],
          marginBottom: spacing[4],
        }}
      >
        {currentStory}
      </div>
      <div>
        {sortedForks.map((fork, index) => (
          <div
            key={fork.id}
            style={{
              padding: spacing[4],
              marginBottom: spacing[2],
              backgroundColor: index === 0 ? colors.primary[100] : colors.white,
              border: `1px solid ${index === 0 ? colors.primary[500] : colors.neutral.gray200}`,
              borderRadius: spacing[2],
            }}
          >
            <div style={{ marginBottom: spacing[2] }}>{fork.text}</div>
            <div
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.neutral.gray600,
              }}
            >
              by {fork.author} - {voteCount[fork.id] || 0} votes
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const Game = () => {
  const {
    gameState,
    leaveRoom,
    startGame,
    submitStory,
    submitFork,
    submitVote,
    updateRoomConfig,
  } = useGame();

  const {
    roomId,
    nickname,
    isHost,
    players,
    phase,
    currentStory,
    forks,
    votes,
    roundTimer,
    config,
  } = gameState;

  const containerStyles = {
    minHeight: "100vh",
    backgroundColor: colors.neutral.background,
    padding: spacing[8],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const contentStyles = {
    width: "100%",
    maxWidth: "800px",
  };

  const renderPhase = () => {
    switch (phase) {
      case "lobby":
        return (
          <WaitingRoom
            isHost={isHost}
            config={config}
            onConfigChange={updateRoomConfig}
            onStartGame={startGame}
            players={players}
            roomId={roomId}
          />
        );
      case "writing":
        return (
          <WritingPhase submitStory={submitStory} roundTimer={roundTimer} />
        );
      case "forking":
        return (
          <ForkingPhase
            currentStory={currentStory}
            submitFork={submitFork}
            roundTimer={roundTimer}
          />
        );
      case "voting":
        return (
          <VotingPhase
            currentStory={currentStory}
            forks={forks}
            submitVote={submitVote}
            roundTimer={roundTimer}
          />
        );
      case "results":
        return (
          <ResultsPhase
            currentStory={currentStory}
            forks={forks}
            votes={votes}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={containerStyles}>
      <header style={{ marginBottom: spacing[8], textAlign: "center" }}>
        <h1 style={{ ...typography.heading1, marginBottom: spacing[2] }}>
          Game Room: {roomId}
        </h1>
        <p style={{ ...typography.body1, color: colors.neutral.gray600 }}>
          Playing as: {nickname}
        </p>
      </header>

      <main style={contentStyles}>{renderPhase()}</main>

      <footer style={{ marginTop: spacing[8] }}>
        <Button variant="secondary" onClick={leaveRoom}>
          Leave Room
        </Button>
      </footer>
    </div>
  );
};

export default Game;
