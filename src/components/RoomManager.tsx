import React from "react";

interface RoomManagerProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  nickname: string;
  setNickname: (nickname: string) => void;
}

export const RoomManager: React.FC<RoomManagerProps> = ({
  onCreateRoom,
  onJoinRoom,
  nickname,
  setNickname,
}) => (
  <div className="room-manager">
    <input
      type="text"
      placeholder="Enter nickname"
      value={nickname}
      onChange={(e) => setNickname(e.target.value)}
      className="room-manager-input"
    />
    <div className="room-manager-actions">
      <button onClick={onCreateRoom} className="room-manager-button">
        Create Room
      </button>
      <button onClick={onJoinRoom} className="room-manager-button">
        Join Room
      </button>
    </div>
  </div>
);
