import { db } from "./config";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  increment,
  Unsubscribe,
} from "firebase/firestore";

// Define the RoomData type explicitly if not already defined
interface RoomData {
  story: string[];
  forks: Fork[];
  votes: Record<string, number>;
  players: string[];
  host: string;
  status: "waiting" | "in-progress" | "finished";
}

// Define the Fork type explicitly if not already defined
interface Fork {
  id: string;
  content: string;
}

// Create a new room
export const createRoom = async (hostNickname: string): Promise<string> => {
  try {
    const roomId: string = Math.random().toString(36).substr(2, 6); // Generate a 6-character room ID
    const roomRef = doc(db, "rooms", roomId);
    const initialData: RoomData = {
      story: ["Once upon a time..."],
      forks: [],
      votes: {},
      players: [hostNickname],
      host: hostNickname,
      status: "waiting",
    };
    await setDoc(roomRef, initialData);
    return roomId;
  } catch (error) {
    console.error("Error creating room:", error);
    throw new Error("Could not create room. Please try again.");
  }
};

// Join an existing room
export const joinRoom = async (
  roomId: string,
  nickname: string,
): Promise<void> => {
  try {
    const roomRef = doc(db, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      throw new Error("Room not found");
    }

    const roomData = roomSnap.data() as RoomData;
    if (roomData.players.includes(nickname)) {
      throw new Error("Nickname already taken in this room");
    }

    await updateDoc(roomRef, {
      players: arrayUnion(nickname),
    });
  } catch (error) {
    console.error("Error joining room:", error);
    throw new Error("Could not join the room. Please try again.");
  }
};

// Subscribe to room updates
export const subscribeToRoom = (
  roomId: string,
  onUpdate: (data: RoomData) => void,
): Unsubscribe => {
  try {
    const roomRef = doc(db, "rooms", roomId);
    return onSnapshot(roomRef, (docSnap) => {
      if (!docSnap.exists()) {
        console.warn(`Room with ID ${roomId} no longer exists.`);
        onUpdate(null as unknown as RoomData); // Pass null or handle gracefully
        return;
      }
      onUpdate(docSnap.data() as RoomData);
    });
  } catch (error) {
    console.error("Error subscribing to room:", error);
    throw new Error("Could not subscribe to room updates. Please try again.");
  }
};

// Update votes
export const castVoteInRoom = async (
  roomId: string,
  forkId: string,
): Promise<void> => {
  try {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      [`votes.${forkId}`]: increment(1),
    });
  } catch (error) {
    console.error("Error casting vote:", error);
    throw new Error("Could not cast your vote. Please try again.");
  }
};
