import React from "react";
import "./firebase/config";
import useStory from "./hooks/useStory";

const StoryGame = () => {
  const { loading, error, story, forks, addFork, castVote, nextRound } =
    useStory();

  return (
    <div>
      <h1>Fork-Off Game</h1>
      <div>
        <h2>Story So Far:</h2>
        <p>{story.join(" ")}</p>
      </div>

      <div>
        {forks.length === 0 && (
          <button onClick={addFork} disabled={loading}>
            Generate Forks
          </button>
        )}
        {forks.length > 0 && (
          <div>
            <h2>Choose the Next Fork:</h2>
            {forks.map((fork) => (
              <div key={fork.id}>
                <p>{fork.content}</p>
                <button onClick={() => castVote(fork.id)}>Vote</button>
              </div>
            ))}
            <button onClick={nextRound} disabled={loading}>
              Next Round
            </button>
          </div>
        )}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default StoryGame;
