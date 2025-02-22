import React from "react";
import Home from "./components/Home";
import Game from "./pages/Game";
import { GameProvider, useGame } from "./context/GameContext";

const AppContent = () => {
  const { gameState } = useGame();
  return gameState.roomId ? <Game /> : <Home />;
};

const App = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
