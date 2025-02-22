import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { generateForks } from "../services/openai";

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    roomId: null,
    nickname: null,
    isHost: false,
    players: [],
    gameStarted: false,
    phase: "lobby", // 'lobby', 'writing', 'forking', 'voting', 'results'
    currentStory: "",
    forks: [],
    votes: {},
    config: {
      numberOfRounds: 3,
      storyStyle: "",
      variance: 5,
    },
  });

  // Subscribe to room updates when in a room
  useEffect(() => {
    if (!gameState.roomId) return;

    const unsubscribe = onSnapshot(
      doc(db, "rooms", gameState.roomId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setGameState((prev) => ({
            ...prev,
            players: data.players,
            gameStarted: data.gameStarted,
            config: data.config,
            phase: data.phase || prev.phase,
            currentStory: data.currentStory || prev.currentStory,
            forks: data.forks || prev.forks,
            votes: data.votes || prev.votes,
          }));
        }
      }
    );

    return () => unsubscribe();
  }, [gameState.roomId]);

  const createRoom = async (nickname) => {
    try {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const roomRef = doc(db, "rooms", roomId);

      // Create the room document with default config
      await setDoc(roomRef, {
        createdAt: new Date(),
        gameStarted: false,
        phase: "lobby",
        currentStory: "",
        forks: [],
        votes: {},
        players: [
          {
            id: Date.now(),
            nickname,
            isHost: true,
          },
        ],
        config: {
          numberOfRounds: 3,
          storyStyle: "",
          variance: 5,
        },
      });

      setGameState({
        roomId,
        nickname,
        isHost: true,
        players: [
          {
            id: Date.now(),
            nickname,
            isHost: true,
          },
        ],
        gameStarted: false,
        phase: "lobby",
        currentStory: "",
        forks: [],
        votes: {},
        config: {
          numberOfRounds: 3,
          storyStyle: "",
          variance: 5,
        },
      });

      return roomId;
    } catch (error) {
      console.error("Error creating room:", error);
      throw new Error("Failed to create room");
    }
  };

  const updateRoomConfig = async (config) => {
    if (!gameState.isHost || !gameState.roomId) return;

    try {
      const roomRef = doc(db, "rooms", gameState.roomId);
      await updateDoc(roomRef, { config });
      setGameState((prev) => ({
        ...prev,
        config,
      }));
    } catch (error) {
      console.error("Error updating room config:", error);
      throw error;
    }
  };

  const joinRoom = async (nickname, roomId) => {
    try {
      const roomRef = doc(db, "rooms", roomId);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        throw new Error("Room not found");
      }

      const roomData = roomSnap.data();
      // Check if player already exists in the room
      const existingPlayer = roomData.players.find(
        (p) => p.nickname === nickname
      );

      if (roomData.gameStarted && !existingPlayer) {
        throw new Error("Game has already started");
      }

      if (existingPlayer) {
        // If player exists, just update the local state
        setGameState({
          roomId,
          nickname,
          isHost: existingPlayer.isHost,
          players: roomData.players,
          gameStarted: roomData.gameStarted,
          phase: roomData.phase || "lobby",
          currentStory: roomData.currentStory || "",
          forks: roomData.forks || [],
          votes: roomData.votes || {},
          config: roomData.config || {
            numberOfRounds: 3,
            storyStyle: "",
            variance: 5,
          },
        });
        return;
      }

      // If player doesn't exist and game hasn't started, add them as new
      const newPlayer = {
        id: Date.now(),
        nickname,
        isHost: false,
      };

      await updateDoc(roomRef, {
        players: arrayUnion(newPlayer),
      });

      setGameState({
        roomId,
        nickname,
        isHost: false,
        players: [...roomData.players, newPlayer],
        gameStarted: roomData.gameStarted,
        phase: roomData.phase || "lobby",
        currentStory: roomData.currentStory || "",
        forks: roomData.forks || [],
        votes: roomData.votes || {},
        config: roomData.config || {
          numberOfRounds: 3,
          storyStyle: "",
          variance: 5,
        },
      });
    } catch (error) {
      console.error("Error joining room:", error);
      throw error;
    }
  };

  const leaveRoom = async () => {
    if (!gameState.roomId) return;

    try {
      const roomRef = doc(db, "rooms", gameState.roomId);

      // Only update host if current player is host
      if (gameState.isHost) {
        const roomSnap = await getDoc(roomRef);
        const roomData = roomSnap.data();
        const remainingPlayers = roomData.players.filter(
          (p) => p.nickname !== gameState.nickname
        );

        if (remainingPlayers.length > 0) {
          const newPlayers = roomData.players.map((p) => ({
            ...p,
            isHost: p.nickname === remainingPlayers[0].nickname,
          }));

          await updateDoc(roomRef, { players: newPlayers });
        }
      }

      // Reset local state
      setGameState({
        roomId: null,
        nickname: null,
        isHost: false,
        players: [],
        gameStarted: false,
        phase: "lobby",
        currentStory: "",
        forks: [],
        votes: {},
        config: {
          numberOfRounds: 3,
          storyStyle: "",
          variance: 5,
        },
      });
    } catch (error) {
      console.error("Error leaving room:", error);
      throw error;
    }
  };

  const startGame = async () => {
    if (!gameState.isHost || !gameState.roomId) return;

    try {
      const roomRef = doc(db, "rooms", gameState.roomId);

      // In single player, the player is always the story writer
      await updateDoc(roomRef, {
        gameStarted: true,
        phase: "writing",
        currentStory: "",
        forks: [],
        votes: {},
        currentRound: 1,
        storyWriter: gameState.nickname,
      });
    } catch (error) {
      console.error("Error starting game:", error);
      throw error;
    }
  };

  const submitStory = async (story) => {
    console.log("[GameContext] Submitting story:", {
      phase: gameState.phase,
      storyLength: story?.length,
      roomId: gameState.roomId,
      config: gameState.config,
    });

    if (!gameState.roomId || gameState.phase !== "writing") {
      console.warn("[GameContext] Invalid state for story submission:", {
        roomId: gameState.roomId,
        phase: gameState.phase,
      });
      return;
    }

    if (!story || !story.trim()) {
      console.error("[GameContext] Empty story submitted");
      throw new Error("Story cannot be empty");
    }

    try {
      const roomRef = doc(db, "rooms", gameState.roomId);
      console.log("[GameContext] Updating story in Firestore");

      // First update the story to ensure it's saved
      await updateDoc(roomRef, {
        currentStory: story,
      });
      console.log("[GameContext] Story saved successfully");

      // Generate more forks in single player mode
      const forkCount = Math.max(3, gameState.players.length - 1);
      console.log("[GameContext] Generating forks:", {
        forkCount,
        storyStyle: gameState.config.storyStyle,
        variance: gameState.config.variance,
      });

      // Then generate forks based on the story and game config
      const forkOptions = {
        tone: gameState.config.storyStyle,
        temperature: Math.max(0.1, Math.min(1, gameState.config.variance / 10)),
        forksCount: forkCount,
      };
      console.log("[GameContext] Calling generateForks with:", {
        story: story.trim(),
        options: forkOptions,
      });

      const forks = await generateForks(story.trim(), forkOptions);
      console.log("[GameContext] Forks generated successfully:", {
        forkCount: forks.length,
        forks: forks,
      });

      if (!Array.isArray(forks) || forks.length === 0) {
        console.error("[GameContext] No forks were generated");
        throw new Error("No forks were generated");
      }

      // Update the room with the generated forks and move to forking phase
      console.log("[GameContext] Updating room with forks");
      await updateDoc(roomRef, {
        phase: "forking",
        forks: forks.map((text) => ({
          id: Date.now() + Math.random(),
          text,
          author: "AI",
        })),
      });
      console.log(
        "[GameContext] Room updated successfully, moving to forking phase"
      );
    } catch (error) {
      console.error("[GameContext] Error in submitStory:", {
        error: error.message,
        stack: error.stack,
      });
      if (error.message.includes("context")) {
        throw new Error(
          "Failed to generate story variations. Please try again with a longer story."
        );
      }
      throw error;
    }
  };

  const submitFork = async (fork) => {
    console.log("[GameContext] Submitting fork:", {
      phase: gameState.phase,
      forkLength: fork?.length,
      roomId: gameState.roomId,
    });

    if (!gameState.roomId || gameState.phase !== "forking") {
      console.warn("[GameContext] Invalid state for fork submission:", {
        roomId: gameState.roomId,
        phase: gameState.phase,
      });
      return;
    }

    try {
      const roomRef = doc(db, "rooms", gameState.roomId);
      await updateDoc(roomRef, {
        forks: arrayUnion({
          id: Date.now(),
          text: fork,
          author: gameState.nickname,
        }),
      });
      console.log("[GameContext] Fork submitted successfully");

      // Move to voting phase immediately in single player mode
      await updateDoc(roomRef, {
        phase: "voting",
      });
      console.log("[GameContext] Moving to voting phase");
    } catch (error) {
      console.error("[GameContext] Error in submitFork:", {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };

  const submitVote = async (forkId) => {
    console.log("[GameContext] Submitting vote:", {
      phase: gameState.phase,
      forkId,
      roomId: gameState.roomId,
    });

    if (!gameState.roomId || gameState.phase !== "voting") {
      console.warn("[GameContext] Invalid state for vote submission:", {
        roomId: gameState.roomId,
        phase: gameState.phase,
      });
      return;
    }

    try {
      const roomRef = doc(db, "rooms", gameState.roomId);
      const votes = { ...gameState.votes };
      votes[gameState.nickname] = forkId;

      // In single player, move to results immediately after voting
      await updateDoc(roomRef, {
        votes,
        phase: "results",
        gameStarted: false,
      });
      console.log("[GameContext] Vote submitted and moved to results phase");
    } catch (error) {
      console.error("[GameContext] Error in submitVote:", {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        createRoom,
        joinRoom,
        leaveRoom,
        startGame,
        submitStory,
        submitFork,
        submitVote,
        updateRoomConfig,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
