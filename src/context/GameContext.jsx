import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";

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
    roundTimer: null,
    config: {
      numberOfRounds: 3,
      storyStyle: "",
      basePrompt: "",
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
            roundTimer: data.roundTimer || prev.roundTimer,
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
        roundTimer: null,
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
          basePrompt: "",
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
        roundTimer: null,
        config: {
          numberOfRounds: 3,
          storyStyle: "",
          basePrompt: "",
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
      if (roomData.gameStarted) {
        throw new Error("Game has already started");
      }

      const newPlayer = {
        id: Date.now(),
        nickname,
        isHost: false,
      };

      // Add the new player to the room
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
        roundTimer: roomData.roundTimer || null,
        config: roomData.config || {
          numberOfRounds: 3,
          storyStyle: "",
          basePrompt: "",
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
      const currentPlayer = gameState.players.find(
        (p) => p.nickname === gameState.nickname
      );

      if (currentPlayer) {
        await updateDoc(roomRef, {
          players: arrayRemove(currentPlayer),
        });
      }

      // If the leaving player is the host and there are other players,
      // make the next player the host
      if (gameState.isHost) {
        const roomSnap = await getDoc(roomRef);
        const roomData = roomSnap.data();
        const remainingPlayers = roomData.players.filter(
          (p) => p.nickname !== gameState.nickname
        );

        if (remainingPlayers.length > 0) {
          const newPlayers = remainingPlayers.map((p, i) => ({
            ...p,
            isHost: i === 0,
          }));

          await updateDoc(roomRef, { players: newPlayers });
        }
      }

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
        roundTimer: null,
        config: {
          numberOfRounds: 3,
          storyStyle: "",
          basePrompt: "",
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

      // Get a random player to be the first story writer
      const storyWriter =
        gameState.players[Math.floor(Math.random() * gameState.players.length)];

      await updateDoc(roomRef, {
        gameStarted: true,
        phase: "writing",
        currentStory: "",
        forks: [],
        votes: {},
        roundTimer: Date.now() + 120000, // 2 minutes for writing phase
        currentRound: 1,
        storyWriter: storyWriter.nickname,
      });
    } catch (error) {
      console.error("Error starting game:", error);
      throw error;
    }
  };

  const submitStory = async (story) => {
    if (!gameState.roomId || gameState.phase !== "writing") return;

    try {
      const roomRef = doc(db, "rooms", gameState.roomId);
      await updateDoc(roomRef, {
        currentStory: story,
        phase: "forking",
        roundTimer: Date.now() + 90000, // 1.5 minutes for forking phase
      });
    } catch (error) {
      console.error("Error submitting story:", error);
      throw error;
    }
  };

  const submitFork = async (fork) => {
    if (!gameState.roomId || gameState.phase !== "forking") return;

    try {
      const roomRef = doc(db, "rooms", gameState.roomId);
      await updateDoc(roomRef, {
        forks: arrayUnion({
          id: Date.now(),
          text: fork,
          author: gameState.nickname,
        }),
      });

      // If all players have submitted forks, move to voting phase
      const roomSnap = await getDoc(roomRef);
      const roomData = roomSnap.data();
      if (roomData.forks.length === roomData.players.length - 1) {
        // -1 because story writer doesn't fork
        await updateDoc(roomRef, {
          phase: "voting",
          roundTimer: Date.now() + 60000, // 1 minute for voting phase
        });
      }
    } catch (error) {
      console.error("Error submitting fork:", error);
      throw error;
    }
  };

  const submitVote = async (forkId) => {
    if (!gameState.roomId || gameState.phase !== "voting") return;

    try {
      const roomRef = doc(db, "rooms", gameState.roomId);
      const votes = { ...gameState.votes };
      votes[gameState.nickname] = forkId;

      await updateDoc(roomRef, { votes });

      // If all players have voted, move to results phase
      const roomSnap = await getDoc(roomRef);
      const roomData = roomSnap.data();
      if (Object.keys(roomData.votes).length === roomData.players.length - 1) {
        // -1 because story writer doesn't vote
        await updateDoc(roomRef, {
          phase: "results",
          gameStarted: false, // End the game
        });
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
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
