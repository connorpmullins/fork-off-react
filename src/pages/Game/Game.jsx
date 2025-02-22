import React from "react";
import { useGame } from "../../context/GameContext";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import WaitingRoom from "../../components/WaitingRoom";
import { colors, typography, spacing } from "../../styles/theme";

const WritingPhase = ({ submitStory }) => {
  const [story, setStory] = React.useState("");
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const CHARACTER_LIMIT = 200;

  const handleSubmit = async () => {
    if (!story.trim()) {
      setError("Please write a story before submitting");
      return;
    }

    if (story.length > CHARACTER_LIMIT) {
      setError(`Your story must be ${CHARACTER_LIMIT} characters or less`);
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
      <h2 style={{ ...typography.heading2, marginBottom: spacing[2] }}>
        Start Your Story
      </h2>
      <div style={{ marginBottom: spacing[6] }}>
        <p style={{ color: colors.neutral.gray600, marginBottom: spacing[2] }}>
          Write the opening sentence that will kick off this story. Make it
          interesting - this is what everyone will build upon!
        </p>
        <p style={{ color: colors.neutral.gray600, marginBottom: spacing[2] }}>
          Your sentence will be used to generate the first set of story
          variations that players can vote on.
        </p>
      </div>
      <Input
        multiline
        rows={4}
        value={story}
        onChange={(e) => {
          setStory(e.target.value);
          setError("");
        }}
        placeholder="Once upon a time..."
        maxLength={CHARACTER_LIMIT}
        style={{ marginBottom: error ? spacing[2] : spacing[4] }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: error ? spacing[2] : spacing[4],
          color:
            story.length > CHARACTER_LIMIT * 0.8
              ? colors.error
              : colors.neutral.gray600,
          fontSize: typography.fontSize.sm,
        }}
      >
        {story.length}/{CHARACTER_LIMIT}
      </div>
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
        disabled={
          !story.trim() || isSubmitting || story.length > CHARACTER_LIMIT
        }
        loading={isSubmitting}
        style={{ width: "100%" }}
      >
        {isSubmitting ? "Generating Story Variations..." : "Submit Opening"}
      </Button>
    </Card>
  );
};

const StoryVariation = ({ fork, isSelected, onSelect, votes, onVote }) => {
  return (
    <div
      style={{
        padding: spacing[4],
        marginBottom: spacing[2],
        border: `2px solid ${isSelected ? colors.primary[500] : colors.neutral.gray200}`,
        borderRadius: spacing[2],
        backgroundColor: isSelected ? colors.primary[50] : colors.white,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: spacing[2],
        }}
      >
        <div style={{ flex: 1 }}>{fork.text}</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing[2],
            marginLeft: spacing[4],
            borderLeft: `1px solid ${colors.neutral.gray200}`,
            paddingLeft: spacing[4],
          }}
        >
          <Button
            variant="secondary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (votes > 0) onVote(fork.id, -1);
            }}
            disabled={!votes || votes === 0}
          >
            -
          </Button>
          <span
            style={{
              minWidth: "2rem",
              textAlign: "center",
              color: colors.neutral.gray600,
            }}
          >
            {votes || 0}
          </span>
          <Button
            variant="secondary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onVote(fork.id, 1);
            }}
            disabled={votes >= 3}
          >
            +
          </Button>
        </div>
      </div>
      <Button
        variant="secondary"
        size="small"
        onClick={() => onSelect(fork)}
        style={{ width: "100%" }}
      >
        Continue with this variation
      </Button>
    </div>
  );
};

const ForkingPhase = ({ currentStory, submitFork, forks }) => {
  const [selectedFork, setSelectedFork] = React.useState(null);
  const [modifiedFork, setModifiedFork] = React.useState("");
  const [votesByFork, setVotesByFork] = React.useState({});
  const totalVotes = Object.values(votesByFork).reduce(
    (sum, count) => sum + count,
    0
  );

  const handleVote = (forkId, change) => {
    if (totalVotes + change > 3) return; // Max 3 votes total
    if (change < 0 && (!votesByFork[forkId] || votesByFork[forkId] === 0))
      return;

    setVotesByFork((prev) => ({
      ...prev,
      [forkId]: Math.max(0, (prev[forkId] || 0) + change),
    }));
  };

  const handleSelectFork = (fork) => {
    setSelectedFork(fork.id);
    setModifiedFork(fork.text);
  };

  return (
    <Card>
      <h2 style={{ ...typography.heading2, marginBottom: spacing[4] }}>
        Continue the Story
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: spacing[3],
          }}
        >
          <h3 style={{ ...typography.heading3 }}>Story Variations</h3>
          <span
            style={{
              color: colors.neutral.gray600,
              fontSize: typography.fontSize.sm,
            }}
          >
            Votes remaining: {3 - totalVotes}
          </span>
        </div>
        <p style={{ color: colors.neutral.gray600, marginBottom: spacing[4] }}>
          Vote for your favorite variations (up to 3 votes) and choose one to
          continue with.
        </p>
        {forks.map((fork) => (
          <StoryVariation
            key={fork.id}
            fork={fork}
            isSelected={selectedFork === fork.id}
            onSelect={handleSelectFork}
            votes={votesByFork[fork.id]}
            onVote={handleVote}
          />
        ))}
      </div>

      <div style={{ marginBottom: spacing[4] }}>
        <h3 style={{ ...typography.heading3, marginBottom: spacing[3] }}>
          Your Continuation
        </h3>
        <Input
          multiline
          rows={4}
          value={modifiedFork}
          onChange={(e) => setModifiedFork(e.target.value)}
          placeholder="Continue the story in your own way..."
          style={{ marginBottom: spacing[4] }}
        />
      </div>

      <Button
        onClick={() => submitFork(modifiedFork)}
        disabled={!modifiedFork.trim()}
        style={{ width: "100%" }}
      >
        Submit Continuation
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
    display: "flex",
    flexDirection: "column",
  };

  const headerStyles = {
    width: "100%",
    padding: `${spacing[4]} ${spacing[8]}`,
    borderBottom: `1px solid ${colors.neutral.gray200}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
  };

  const headerInfoStyles = {
    display: "flex",
    flexDirection: "column",
    gap: spacing[1],
  };

  const roomIdStyles = {
    ...typography.heading3,
    color: colors.neutral.gray900,
  };

  const nicknameStyles = {
    ...typography.body,
    color: colors.neutral.gray600,
  };

  const contentStyles = {
    flex: 1,
    padding: spacing[8],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const mainContentStyles = {
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
      <div style={headerStyles}>
        <div style={headerInfoStyles}>
          <h1 style={roomIdStyles}>Game Room: {roomId}</h1>
          <p style={nicknameStyles}>Playing as {nickname}</p>
        </div>
        <Button onClick={leaveRoom} variant="secondary">
          Leave Room
        </Button>
      </div>
      <div style={contentStyles}>
        <div style={mainContentStyles}>{renderPhase()}</div>
      </div>
    </div>
  );
};

export default Game;
