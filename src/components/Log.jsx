function Log({ program, currentStep }) {
  return (
    <ol className="mt-4 bg-gray-100 rounded p-2 w-full max-w-md">
      {program.map((cmd, idx) => (
        <li
          key={idx}
          className={`py-1 px-2 rounded ${
            idx === currentStep ? "bg-yellow-300 font-bold" : ""
          }`}
        >
          Step {idx + 1}: {cmd}
        </li>
      ))}
    </ol>
  );
}

export default Log;
