import React from "react";
import "./firebaseConfig";
import useStory from "./hooks/useStory";

const StoryApp = () => {
  const { story, forks, addFork, selectFork, loading, error } = useStory();

  return (
    <div>
      <h1>Fork-Off</h1>
      <div>
        <p>{story.join(" ")}</p>
        <button onClick={addFork} disabled={loading}>
          {loading ? "Generating..." : "Generate Forks"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {forks.length > 0 && (
        <div>
          {forks.map((fork, index) => (
            <button key={index} onClick={() => selectFork(fork)}>
              {fork}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryApp;
