import React from 'react';
import './GameOver.css';

const GameOver = ({ score, onRestart }) => {
  return (
    <div className="game-over-container">
      <div className="game-over-content">
        <h1>Game Over</h1>
        <p>Your Score: {score}</p>
        <button onClick={onRestart}>Restart</button>
      </div>
    </div>
  );
};

export default GameOver;
