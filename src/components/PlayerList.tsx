import React from "react";

interface PlayerListProps {
  players: string[];
}

export const PlayerList: React.FC<PlayerListProps> = ({ players }) => (
  <div className="player-list">
    <h2 className="player-list-title">Players in Room:</h2>
    <ul className="player-list-content">
      {players.map((player) => (
        <li key={player} className="player-list-item">
          {player}
        </li>
      ))}
    </ul>
  </div>
);
