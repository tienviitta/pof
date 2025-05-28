import React, { useState } from "react";
import "./App.css";
import Progr from "./components/Progr";
import ProgrBoard from "./components/ProgrBoard";
import Log from "./components/Log";

const INITIAL_BEE_POSITION = { row: 0, col: 0 };

const HEADINGS = {
  N: "North",
  S: "South",
  E: "East",
  W: "West",
};

const INITIAL_PROGR_BOARD = [
  ["B", " ", " ", " ", "F", "T"], // Bee starts at (0, 0)
  [" ", " ", "T", " ", "T", " "], // Column vectors
  [" ", "F", " ", " ", " ", " "],
  [" ", " ", " ", "F", " ", "T"],
  [" ", "T", "F", "T", " ", " "],
  [" ", " ", " ", " ", " ", "H"],
];

const INITIAL_PROGRAM = Array.from({ length: 36 }, (_, i) =>
  (i + 1).toString()
);

function App() {
  const [beePosition, setBeePosition] = useState(INITIAL_BEE_POSITION);
  const [heading, setHeading] = useState(HEADINGS.E);
  const [board, setBoard] = useState(INITIAL_PROGR_BOARD);
  const [programIndex, setProgramIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [userProgram, setUserProgram] = useState([...INITIAL_PROGRAM]);
  const [points, setPoints] = useState(0);
  const [gameOver, setGameOver] = useState("false");

  // Handle click on program step to change it
  const handleProgramStepClick = (index) => {
    if (isRunning) return; // Prevent changes while running
    const options = ["L", "R", "F"];
    const current = userProgram[index];
    const next = options[(options.indexOf(current) + 1) % options.length];
    const updated = [...userProgram];
    updated[index] = next;
    setUserProgram(updated);
  };

  // Heading order for rotation
  const headingOrder = ["N", "E", "S", "W"];

  // Get heading key from value
  const getHeadingKey = (val) =>
    Object.keys(HEADINGS).find((k) => HEADINGS[k] === val);

  // Update heading based on direction
  const rotateHeading = (current, dir) => {
    let idx = headingOrder.indexOf(getHeadingKey(current));
    if (dir === "R") idx = (idx + 1) % 4;
    else if (dir === "L") idx = (idx - 1) % 4;
    return HEADINGS[headingOrder[idx]];
  };

  // Move Bee forward
  const moveForward = (board, heading) => {
    const pos = beePosition;
    if (!pos) return board;
    let { row, col } = pos;
    let nextRow = row,
      nextCol = col;
    if (heading === HEADINGS.N) nextRow--;
    if (heading === HEADINGS.S) nextRow++;
    if (heading === HEADINGS.E) nextCol++;
    if (heading === HEADINGS.W) nextCol--;
    if (
      nextCol < 0 ||
      nextCol >= board.length ||
      nextRow < 0 ||
      nextRow >= board[0].length ||
      board[nextCol][nextRow] === undefined
    )
      return board; // Out of bounds, don't move

    // Check if the next position is a flower, honey, or teddy bear
    if (board[nextCol][nextRow] === "F") {
      // If it's a flower, remove it from the board and add points
      setPoints((p) => p + 1);
      board[nextCol][nextRow] = "•";
    } else if (board[nextCol][nextRow] === "T") {
      // } else if (board[col][row] === "T") {
      // If it's a teddy bear, stop the program and end the game
      setGameOver("teddy");
      setIsRunning(false);
      return board;
    } else if (board[nextCol][nextRow] === "H") {
      // } else if (board[col][row] === "H") {
      // If it's honey, stop the program (win condition)
      setGameOver("honey");
      setIsRunning(false);
      return board;
    }

    const newBoard = board.map((row) => [...row]);
    newBoard[col][row] = "•";
    newBoard[nextCol][nextRow] = "B";
    setBeePosition({ row: nextRow, col: nextCol });
    return newBoard;
  };

  // Run one step of the program
  const stepProgram = () => {
    if (programIndex >= userProgram.length) {
      setIsRunning(false);
      return;
    }
    const cmd = userProgram[programIndex];
    if (cmd === "R" || cmd === "L") {
      setHeading((prev) => rotateHeading(prev, cmd));
    } else if (cmd === "F") {
      setBoard((prev) => moveForward(prev, heading));
    }
    setProgramIndex((i) => i + 1);
  };

  // Start running the program
  const handleStart = () => {
    if (isRunning) return;
    setBoard(INITIAL_PROGR_BOARD.map((row) => [...row]));
    setHeading(HEADINGS.E);
    setProgramIndex(0);
    setBeePosition(INITIAL_BEE_POSITION);
    setPoints(0);
    setGameOver(false);
    setIsRunning(true);
  };

  // Run program automatically
  React.useEffect(() => {
    if (!isRunning || gameOver) return;
    if (programIndex >= userProgram.length) {
      setIsRunning(false);
      return;
    }
    const timer = setTimeout(stepProgram, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [isRunning, programIndex, heading, userProgram, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="font-bold text-3xl text-center mb-4">Programming</h1>
      <p className="max-w-xl">
        Programming is the process of creating a set of instructions that tell a
        computer how to perform a task. It involves writing code in various
        programming languages, such as JavaScript, Python, or C++. Programming
        is essential for developing software applications, websites, and systems
        that power modern technology. Make a program to move the Bee to the
        Honey and collect as many flowers as possible. Beware of the Teddy Bear,
        which will end the game if you reach it!
      </p>
      <div className="my-2 text-xl font-semibold">
        Points: {points}
        {gameOver === "teddy" && (
          <span className="ml-4 text-red-600 font-bold">Game Over 🧸!</span>
        )}
        {gameOver === "honey" && (
          <span className="ml-4 text-green-600 font-bold">
            Congratulations 🍯!
          </span>
        )}
      </div>
      <ProgrBoard board={board} headings={HEADINGS} heading={heading} />
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleStart}
          className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-blue-700 transition ${
            isRunning ? "animate-pulse" : ""
          }`}
        >
          Start
        </button>
        <button
          onClick={() => setIsRunning(false)}
          className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition ${
            !isRunning ? "animate-pulse" : ""
          }`}
          disabled={!isRunning}
        >
          Stop
        </button>
      </div>
      <Progr program={userProgram} onStepClick={handleProgramStepClick} />
    </div>
  );
}

export default App;
