import { useEffect, useState, useCallback } from "react";
import {
  createRoom,
  joinRoom,
  subscribeToRoom,
  castVoteInRoom,
} from "../services/firebase";
import { generateForks } from "../services/openai";

type Fork = {
  id: string;
  content: string;
  votes?: number; // Optional to align with Firestore updates
};

type UseStoryReturn = {
  loading: boolean;
  error: string | null;
  story: string[];
  forks: Fork[];
  players: string[];
  createRoom: (nickname: string) => Promise<string>;
  joinRoom: (roomId: string, nickname: string) => Promise<void>;
  addFork: () => Promise<void>;
  castVote: (forkId: string) => Promise<void>;
  selectFork: (forkId: string) => void;
  nextRound: () => void;
};

const useStory = (
  initialRoomId: string | null,
  nickname: string
): UseStoryReturn => {
  const [roomId, setRoomId] = useState<string | null>(initialRoomId);
  const [story, setStory] = useState<string[]>([]);
  const [forks, setForks] = useState<Fork[]>([]);
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const [players, setPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to room updates
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = subscribeToRoom(roomId, (roomData) => {
      if (roomData) {
        setStory(roomData.story || []);
        setForks(roomData.forks || []);
        setVotes(roomData.votes || {});
        setPlayers(roomData.players || []);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  // Function to create a room
  const createNewRoom = useCallback(
    async (nickname: string): Promise<string> => {
      setLoading(true);
      setError(null);
      try {
        const newRoomId = await createRoom(nickname);
        setRoomId(newRoomId);
        return newRoomId;
      } catch (err) {
        console.error("Error creating room:", err);
        setError("Failed to create room.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Function to join a room
  const joinExistingRoom = useCallback(
    async (roomIdToJoin: string, nickname: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await joinRoom(roomIdToJoin, nickname);
        setRoomId(roomIdToJoin);
      } catch (err) {
        console.error("Error joining room:", err);
        setError("Failed to join room. Check the room ID.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Function to cast a vote
  const castVote = useCallback(
    async (forkId: string): Promise<void> => {
      try {
        await castVoteInRoom(roomId as string, forkId);
      } catch (err) {
        console.error("Error casting vote:", err);
        setError("Failed to cast vote.");
      }
    },
    [roomId]
  );

  // Function to add forks
  const addFork = useCallback(async (): Promise<void> => {
    // setLoading(true);
    // setError(null);
    // try {
    //   const context = story.join(" ");
    //   const generatedForks = await generateForks(context);
    //   const formattedForks = generatedForks.map(
    //     (content: string, index: number) => ({
    //       id: `${Date.now()}-${index}`,
    //       content,
    //       votes: 0,
    //     })
    //   );
    //   setForks(formattedForks);
    // } catch (err) {
    //   console.error("Error generating forks:", err);
    //   setError("Failed to generate story forks. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  }, [story]);

  // Function to select a fork
  const selectFork = useCallback(
    (forkId: string): void => {
      const selectedFork = forks.find((fork) => fork.id === forkId);
      if (selectedFork) {
        setStory((prevStory) => [...prevStory, selectedFork.content]);
        setForks([]); // Clear forks after selection
      } else {
        setError("Selected fork not found.");
      }
    },
    [forks]
  );

  // Function to handle the next round
  const nextRound = useCallback((): void => {
    if (forks.length === 0) {
      setError("No forks available to select.");
      return;
    }

    const winningFork = forks.reduce((topFork, currentFork) =>
      (votes[currentFork.id] || 0) > (votes[topFork.id] || 0)
        ? currentFork
        : topFork
    );

    if (winningFork) {
      selectFork(winningFork.id);
    } else {
      setError("No votes cast this round. Cannot proceed.");
    }
  }, [forks, votes, selectFork]);

  return {
    loading,
    error,
    story,
    forks,
    players,
    createRoom: createNewRoom,
    joinRoom: joinExistingRoom,
    addFork,
    castVote,
    selectFork,
    nextRound,
  };
};

export default useStory;
