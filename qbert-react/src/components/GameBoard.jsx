import React, { useState, useEffect, useMemo } from 'react';
import Cube from './Cube';
import Qbert from './Qbert';
import Coily from './Coily';
import GameOver from './GameOver';
import './GameBoard.css';

const GameBoard = () => {
  const [qbertPosition, setQbertPosition] = useState({ row: 0, col: 0 });
  const [coilyPosition, setCoilyPosition] = useState({ row: 1, col: 0 });
  const [cubeColors, setCubeColors] = useState(
    Array(4)
      .fill(null)
      .map((_, i) => Array(i + 1).fill('blue'))
  );
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const jumpSound = useMemo(() => new Audio('/sounds/jump.mp3'), []);
  const gameOverSound = useMemo(() => new Audio('/sounds/gameover.mp3'), []);

  const rows = 4;

  const restartGame = () => {
    setQbertPosition({ row: 0, col: 0 });
    setCoilyPosition({ row: 1, col: 0 });
    setCubeColors(
      Array(4)
        .fill(null)
        .map((_, i) => Array(i + 1).fill('blue'))
    );
    setScore(0);
    setLives(3);
    setGameOver(false);
  };

  useEffect(() => {
    if (lives === 0) {
      setGameOver(true);
      gameOverSound.play();
    }
  }, [lives, gameOverSound]);

  useEffect(() => {
    if (gameOver) return;
    const handleKeyDown = (e) => {
      setQbertPosition((prevPosition) => {
        let newRow = prevPosition.row;
        let newCol = prevPosition.col;

        switch (e.key) {
          case 'ArrowUp':
            newRow -= 1;
            break;
          case 'ArrowDown':
            newRow += 1;
            break;
          case 'ArrowLeft':
            newCol -= 1;
            break;
          case 'ArrowRight':
            newCol += 1;
            break;
          default:
            return prevPosition;
        }

        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol <= newRow
        ) {
          jumpSound.play();
          if (cubeColors[newRow][newCol] !== 'yellow') {
            const newCubeColors = [...cubeColors];
            newCubeColors[newRow][newCol] = 'yellow';
            setCubeColors(newCubeColors);
            setScore((prevScore) => prevScore + 25);
          }
          return { row: newRow, col: newCol };
        }

        return prevPosition;
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cubeColors, gameOver, jumpSound]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setCoilyPosition((prevPosition) => {
        if (prevPosition.row === qbertPosition.row && prevPosition.col === qbertPosition.col) {
          setLives((prevLives) => prevLives - 1);
          setQbertPosition({ row: 0, col: 0 });
          return { row: 1, col: 0 };
        }

        const moves = [
          { row: prevPosition.row + 1, col: prevPosition.col },
          { row: prevPosition.row + 1, col: prevPosition.col + 1 },
          { row: prevPosition.row - 1, col: prevPosition.col },
          { row: prevPosition.row - 1, col: prevPosition.col - 1 },
        ];

        const validMoves = moves.filter(
          (move) =>
            move.row >= 0 &&
            move.row < rows &&
            move.col >= 0 &&
            move.col <= move.row
        );

        if (validMoves.length > 0) {
          let bestMove = validMoves[0];
          let minDistance = Math.sqrt(
            Math.pow(bestMove.row - qbertPosition.row, 2) +
              Math.pow(bestMove.col - qbertPosition.col, 2)
          );

          for (let i = 1; i < validMoves.length; i++) {
            const distance = Math.sqrt(
              Math.pow(validMoves[i].row - qbertPosition.row, 2) +
                Math.pow(validMoves[i].col - qbertPosition.col, 2)
            );

            if (distance < minDistance) {
              minDistance = distance;
              bestMove = validMoves[i];
            }
          }
          return bestMove;
        }

        return prevPosition;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [qbertPosition, gameOver]);

  const getQbertStyle = () => {
    const top = qbertPosition.row * 40;
    const left = qbertPosition.col * 55 + (rows - qbertPosition.row -1) * 28;
    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  };

  const getCoilyStyle = () => {
    const top = coilyPosition.row * 40;
    const left = coilyPosition.col * 55 + (rows - coilyPosition.row - 1) * 28;
    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  };

  const pyramid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j <= i; j++) {
      row.push(<Cube key={`${i}-${j}`} color={cubeColors[i][j]} />);
    }
    pyramid.push(<div key={i} className="row">{row}</div>);
  }

  return (
    <div className="game-board">
      {gameOver && <GameOver score={score} onRestart={restartGame} />}
      <div className="game-info">
        <span>Score: {score}</span>
        <span>Lives: {lives}</span>
      </div>
      {pyramid}
      <Qbert style={getQbertStyle()} />
      <Coily style={getCoilyStyle()} />
    </div>
  );
};

export default GameBoard;
