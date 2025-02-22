import React from "react";
import { useGame } from "../context/GameContext";
import Button from "./common/Button";
import Card from "./common/Card";
import Input from "./common/Input";
import WaitingRoom from "./WaitingRoom";
import { colors, typography, spacing } from "../styles/theme";

const WritingPhase = ({ submitStory }) => {
  const [story, setStory] = React.useState("");
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (!story.trim()) {
      setError("Please write a story before submitting");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await submitStory(story);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 style={{ ...typography.heading2, marginBottom: spacing[4] }}>
        Write Your Story
      </h2>
      <p style={{ color: colors.neutral.gray600, marginBottom: spacing[4] }}>
        Write an engaging opening to your story. Make it interesting enough for
        others to continue!
      </p>
      <Input
        multiline
        rows={4}
        value={story}
        onChange={(e) => {
          setStory(e.target.value);
          setError("");
        }}
        placeholder="Once upon a time..."
        style={{ marginBottom: error ? spacing[2] : spacing[4] }}
      />
      {error && (
        <p
          style={{
            color: colors.error,
            marginBottom: spacing[4],
            fontSize: typography.fontSize.sm,
          }}
        >
          {error}
        </p>
      )}
      <Button
        onClick={handleSubmit}
        disabled={!story.trim() || isSubmitting}
        loading={isSubmitting}
        style={{ width: "100%" }}
      >
        {isSubmitting ? "Generating Variations..." : "Submit Story"}
      </Button>
    </Card>
  );
};

const ForkingPhase = ({ currentStory, submitFork, forks }) => {
  const [selectedFork, setSelectedFork] = React.useState(null);
  const [modifiedFork, setModifiedFork] = React.useState("");

  return (
    <Card>
      <h2 style={{ ...typography.heading2, marginBottom: spacing[4] }}>
        Create Your Fork
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

      <div style={{ marginBottom: spacing[4] }}>
        <h3 style={{ ...typography.heading3, marginBottom: spacing[3] }}>
          AI Suggestions
        </h3>
        <p style={{ color: colors.neutral.gray600, marginBottom: spacing[4] }}>
          Select a suggestion to modify, or write your own fork from scratch.
        </p>
        {forks.map((fork) => (
          <div
            key={fork.id}
            onClick={() => {
              setSelectedFork(fork.id);
              setModifiedFork(fork.text);
            }}
            style={{
              padding: spacing[4],
              marginBottom: spacing[2],
              border: `2px solid ${selectedFork === fork.id ? colors.primary[500] : colors.neutral.gray200}`,
              borderRadius: spacing[2],
              cursor: "pointer",
              backgroundColor:
                selectedFork === fork.id ? colors.primary[50] : colors.white,
            }}
          >
            {fork.text}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: spacing[4] }}>
        <h3 style={{ ...typography.heading3, marginBottom: spacing[3] }}>
          Your Fork
        </h3>
        <Input
          multiline
          rows={4}
          value={modifiedFork}
          onChange={(e) => setModifiedFork(e.target.value)}
          placeholder="Write your own fork or modify the selected suggestion..."
          style={{ marginBottom: spacing[4] }}
        />
      </div>

      <Button
        onClick={() => submitFork(modifiedFork)}
        disabled={!modifiedFork.trim()}
        style={{ width: "100%" }}
      >
        Submit Fork
      </Button>
    </Card>
  );
};

const VotingPhase = ({ currentStory, forks, submitVote }) => {
  const [selectedFork, setSelectedFork] = React.useState(null);

  return (
    <Card>
      <h2 style={{ ...typography.heading2, marginBottom: spacing[4] }}>
        Vote for the Best Fork
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
        disabled={!selectedFork}
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
        return <WritingPhase submitStory={submitStory} />;
      case "forking":
        return (
          <ForkingPhase
            currentStory={currentStory}
            submitFork={submitFork}
            forks={forks}
          />
        );
      case "voting":
        return (
          <VotingPhase
            currentStory={currentStory}
            forks={forks}
            submitVote={submitVote}
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
