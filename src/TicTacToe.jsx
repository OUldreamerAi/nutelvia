import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

  
  .ttt-root {
    min-height: 100vh;
    background: #0f0f0f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Mono', monospace;
  }

  .ttt-card {
    background: #1a1a1a;
    border: 1px solid #2e2e2e;
    border-radius: 12px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
    box-shadow: 0 0 60px rgba(0,0,0,0.6);
  }

  .ttt-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 42px;
    letter-spacing: 6px;
    color: #f0f0f0;
    margin: 0;
  }

  .ttt-status {
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #888;
    height: 20px;
  }

  .ttt-status.win {
    color: #e8c84a;
    font-weight: 700;
  }

  .ttt-board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .ttt-square {
    width: 90px;
    height: 90px;
    background: #242424;
    border: 1px solid #333;
    border-radius: 8px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 40px;
    cursor: pointer;
    color: #f0f0f0;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ttt-square:hover:not(:disabled) {
    background: #2e2e2e;
    border-color: #555;
    transform: scale(1.04);
  }

  .ttt-square:disabled {
    cursor: default;
  }

  .ttt-square.x {
    color: #e05c5c;
  }

  .ttt-square.o {
    color: #5c9ae0;
  }

  .ttt-square.win-highlight {
    border-color: #e8c84a;
    background: #2a2600;
  }

  .ttt-reset {
    margin-top: 4px;
    padding: 10px 32px;
    background: transparent;
    border: 1px solid #444;
    border-radius: 6px;
    color: #888;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
  }

  .ttt-reset:hover {
    border-color: #f0f0f0;
    color: #f0f0f0;
  }
`;

function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function Square({ value, onSquareClick, isWin }) {
  return (
    <button
      className={`ttt-square${value === "X" ? " x" : value === "O" ? " o" : ""}${isWin ? " win-highlight" : ""}`}
      onClick={onSquareClick}
      disabled={!!value}
    >
      {value}
    </button>
  );
}

export default function TicTacToe() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  const result = calculateWinner(squares);
  const isDraw = !result && squares.every(Boolean);

  function handleClick(i) {
    if (squares[i] || result) return;
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  function reset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  let statusText;
  if (result) statusText = `winner: ${result.winner}`;
  else if (isDraw) statusText = "draw — try again";
  else statusText = `next: ${xIsNext ? "X" : "O"}`;

  return (
    <>
      <style>{styles}</style>
      <div className="ttt-root">
        <div className="ttt-card">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <div className={`ttt-status${result ? " win" : ""}`}>{statusText}</div>
          <div className="ttt-board">
            {squares.map((val, i) => (
              <Square
                key={i}
                value={val}
                onSquareClick={() => handleClick(i)}
                isWin={result?.line.includes(i)}
              />
            ))}
          </div>
          <button className="ttt-reset" onClick={reset}>Reset</button>
        </div>
      </div>
    </>
  );
}