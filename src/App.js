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

  const { story, forks, players, votes, castVote, createRoom, joinRoom } =
    useStory(roomId, nickname);

  const handleCreateRoom = async () => {
    const newRoomId = await createRoom(nickname);
    setRoomId(newRoomId);
    setIsHost(true);
  };

  const handleJoinRoom = async () => {
    const roomIdToJoin = prompt("Enter Room ID:");
    await joinRoom(roomIdToJoin, nickname);
    setRoomId(roomIdToJoin);
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
          <PlayerList players={players} />
          <StoryViewer story={story} />
          <ForkVoting forks={forks} votes={votes} castVote={castVote} />
        </>
      )}
    </div>
  );
};

export default App;
