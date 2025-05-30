import React from "react";

const ProgrBoard = ({ board, headings, heading }) => {
  // Determine rotation based on heading
  const getRotation = () => {
    switch (heading) {
      case headings.E:
        return "rotate-0";
      case headings.S:
        return "rotate-90";
      case headings.W:
        return "rotate-180";
      case headings.N:
        return "-rotate-90";
      default:
        return "";
    }
  };

  const rotationClass = getRotation();

  return (
    <ol className="mt-4 grid grid-cols-6">
      {board.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((sym, colIndex) => (
              <li key={colIndex}>
                <button
                  className={`border border-amber-600 w-16 h-16 flex items-center justify-center`}
                >
                  {sym === "B" ? (
                    <img
                      src="bee.png"
                      alt="Bee"
                      className={rotationClass + " w-10 h-10"}
                    />
                  ) : sym === "F" ? (
                    <img src="flower.png" alt="Flower" className="w-10 h-10" />
                  ) : sym === "T" ? (
                    <img src="teddy.png" alt="Teddy" className="w-10 h-10" />
                  ) : sym === "H" ? (
                    <img src="hive.png" alt="Hive" className="w-10 h-10" />
                  ) : (
                    sym
                  )}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
};

export default ProgrBoard;
