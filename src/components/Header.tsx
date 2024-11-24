import React from "react";

interface HeaderProps {
  roomId?: string;
  nickname: string;
}
export const Header: React.FC<HeaderProps> = ({ roomId, nickname }) => (
  <header className="header">
    <h1 className="header-title">Fork-Off Game</h1>
    <div className="header-info">
      Room ID: {roomId || "N/A"} | Player: {nickname}
    </div>
  </header>
);
