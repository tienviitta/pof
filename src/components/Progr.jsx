import React from "react";

const Progr = ({ program, onStepClick }) => {
  const getImageForStep = (step) => {
    switch (step) {
      case "L":
        return "pof/src/assets/left.png";
      case "R":
        return "pof/src/assets/right.png";
      case "F":
        return "pof/src/assets/forward.png";
      default:
        return null;
    }
  };

  return (
    <ol className="mt-4 grid grid-cols-6">
      {program.map((step, index) => (
        <li key={index}>
          <button
            className="border border-amber-600 w-16 h-16 flex items-center justify-center"
            onClick={() => onStepClick && onStepClick(index)}
            type="button"
          >
            {["L", "R", "F"].includes(step) ? (
              <img src={getImageForStep(step)} alt={step} className="w-8 h-8" />
            ) : (
              step
            )}
          </button>
        </li>
      ))}
    </ol>
  );
};

export default Progr;
