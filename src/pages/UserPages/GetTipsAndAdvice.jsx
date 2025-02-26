import React, { useContext } from "react";
import { AdviceContext } from "../../context/AdviceContext";
import { useParams } from "react-router-dom";

function GetTipsAndAdvice() {
  const { advice, fetchAdvice } = useContext(AdviceContext);
  const { id } = useParams();

  const handleGenerateAdvice = () => {
    fetchAdvice(id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-2xl font-bold mb-4">Advice and Tips</h1>
      {advice ? (
        <div>
          <p>{advice.advice}</p> {/* Display the fetched advice message */}
        </div>
      ) : (
        <p>Loading advice...</p>
      )}
      <button
        onClick={handleGenerateAdvice}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
      >
        Generate Advice
      </button>
    </div>
  );
}

export default GetTipsAndAdvice;
