import { useEffect, useState } from "react";
import { generateStoryForks } from "../openaiService";
import {
  createRoom,
  joinRoom,
  subscribeToRoom,
  castVoteInRoom,
} from "../firebase";

type UseStoryReturn = {
  loading: boolean;
  error: string | null;
  story: string[];
  forks: Fork[];
  addFork: () => Promise<void>;
  selectFork: (forkId: string) => void;
  castVote: (forkId: string) => Promise<void>;
  nextRound: () => void;
};

const useStory = (roomId: string): UseStoryReturn => {
  const [story, setStory] = useState<string[]>([]);
  const [forks, setForks] = useState<Fork[]>([]);
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const [players, setPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = subscribeToRoom(roomId, (roomData) => {
      setStory(roomData.story);
      setForks(roomData.forks);
      setVotes(roomData.votes);
      setPlayers(roomData.players);
    });

    return unsubscribe;
  }, [roomId]);

  const castVote = async (forkId: string): Promise<void> => {
    try {
      await castVoteInRoom(roomId, forkId);
    } catch (err) {
      console.error("Error casting vote:", err);
      setError("Failed to cast vote");
    }
  };

  const addFork = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const context = story.join(" ");
      const generatedForks = await generateStoryForks(context);
      setForks(
        generatedForks.map((content: string, index: number) => ({
          id: `${Date.now()}-${index}`, // Unique ID for each fork
          content,
          votes: 0,
        })),
      );
    } catch (err) {
      console.error("Error generating forks:", err);
      setError("Failed to generate story forks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectFork = (forkId: string): void => {
    const selectedFork = forks.find((fork) => fork.id === forkId);
    if (selectedFork) {
      setStory((prevStory) => [...prevStory, selectedFork.content]);
      setForks([]); // Clear forks after selection
    }
  };

  const nextRound = (): void => {
    if (forks.length === 0) {
      setError("No forks available to select.");
      return;
    }

    // Identify the fork with the highest votes
    const winningFork = forks.reduce((topFork, currentFork) =>
      currentFork.votes > topFork.votes ? currentFork : topFork,
    );

    if (winningFork) {
      selectFork(winningFork.id);
    } else {
      setError("No votes cast this round. Cannot proceed.");
    }
  };

  return {
    loading,
    error,
    story,
    forks,
    addFork,
    selectFork,
    castVote,
    nextRound,
  };
};

export default useStory;
