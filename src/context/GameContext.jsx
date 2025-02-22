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
          }));
        }
      }
    );

    return () => unsubscribe();
  }, [gameState.roomId]);

  const createRoom = async (nickname) => {
    try {
      // Generate a random room ID
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const roomRef = doc(db, "rooms", roomId);

      // Create the room document
      await setDoc(roomRef, {
        createdAt: new Date(),
        gameStarted: false,
        players: [
          {
            id: Date.now(),
            nickname,
            isHost: true,
          },
        ],
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
      });

      return roomId;
    } catch (error) {
      console.error("Error creating room:", error);
      throw new Error("Failed to create room");
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
      });
    } catch (error) {
      console.error("Error leaving room:", error);
      throw error;
    }
  };

  return (
    <GameContext.Provider
      value={{ gameState, createRoom, joinRoom, leaveRoom }}
    >
      {children}
    </GameContext.Provider>
  );
};
