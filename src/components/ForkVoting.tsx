import React from "react";

interface ForkVotingProps {
  forks: { id: string; content: string }[];
  votes: Record<string, number>;
  castVote: (forkId: string) => void;
}

export const ForkVoting: React.FC<ForkVotingProps> = ({
  forks,
  votes,
  castVote,
}) => {
  console.log("CONNOR - forks: ", forks);
  return (
    <div className="fork-voting">
      <h2 className="fork-voting-title">Choose the Next Fork:</h2>
      {forks.map((fork) => (
        <div key={fork.id} className="fork-voting-option">
          <p className="fork-voting-content">{fork.content}</p>
          <button
            onClick={() => castVote(fork.id)}
            className="fork-voting-button"
          >
            Vote ({votes[fork.id] || 0})
          </button>
        </div>
      ))}
    </div>
  );
};
