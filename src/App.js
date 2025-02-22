import React, { useState } from "react";
import "./services/firebase";
import { useStory } from "./hooks";
import {
  Header,
  RoomManager,
  PlayerList,
  StoryViewer,
  ForkVoting,
} from "./components";

const App = () => {
  const [roomId, setRoomId] = useState(null);
  const [nickname, setNickname] = useState("");
  const [isHost, setIsHost] = useState(false);

  const {
    story,
    forks,
    players,
    votes,
    castVote,
    createRoom,
    joinRoom,
    error: storyError,
  } = useStory(roomId, nickname);

  // Handles creating a room
  const handleCreateRoom = async () => {
    try {
      const newRoomId = await createRoom(nickname);
      setRoomId(newRoomId);
      setIsHost(true);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    }
  };

  // Handles joining a room
  const handleJoinRoom = async () => {
    try {
      const roomIdToJoin = prompt("Enter Room ID:");
      if (!roomIdToJoin) {
        alert("Please enter a valid Room ID.");
        return;
      }
      await joinRoom(roomIdToJoin, nickname);
      setRoomId(roomIdToJoin);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room. Please check the Room ID and try again.");
    }
  };

  return (
    <div>
      <Header roomId={roomId} nickname={nickname} />
      {!roomId ? (
        <RoomManager
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          nickname={nickname}
          setNickname={setNickname}
        />
      ) : (
        <>
          {storyError && <p className="error">Error: {storyError}</p>}
          <PlayerList players={players} />
          <StoryViewer story={story} />
          <ForkVoting forks={forks} votes={votes} castVote={castVote} />
        </>
      )}
    </div>
  );
};

export default App;
