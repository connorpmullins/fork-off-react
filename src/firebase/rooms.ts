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

// Create a new room
export const createRoom = async (hostNickname: string): Promise<string> => {
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
};

// Join an existing room
export const joinRoom = async (
  roomId: string,
  nickname: string,
): Promise<void> => {
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
};

// Subscribe to room updates
export const subscribeToRoom = (
  roomId: string,
  onUpdate: (data: RoomData) => void,
): Unsubscribe => {
  const roomRef = doc(db, "rooms", roomId);
  return onSnapshot(roomRef, (docSnap) => {
    onUpdate(docSnap.data() as RoomData);
  });
};

// Update votes
export const castVoteInRoom = async (
  roomId: string,
  forkId: string,
): Promise<void> => {
  const roomRef = doc(db, "rooms", roomId);
  await updateDoc(roomRef, {
    [`votes.${forkId}`]: increment(1),
  });
};