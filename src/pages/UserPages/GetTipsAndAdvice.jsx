import React, { useContext, useState, useEffect } from "react";
import { AdviceContext } from "../../context/AdviceContext";
import DOMPurify from "dompurify"; // Import DOMPurify

function GetTipsAndAdvice() {
  const { advice, fetchAdvice, loading } = useContext(AdviceContext);
  const [displayedAdvice, setDisplayedAdvice] = useState("");

  useEffect(() => {
    if (advice) {
      const cleanAdvice = advice?.trim(); // Clean up the advice
      const sanitizedAdvice = DOMPurify.sanitize(cleanAdvice); // Sanitize the HTML
      setDisplayedAdvice(sanitizedAdvice); // Set the sanitized HTML
    }
  }, [advice]);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)] px-4 bg-gray-100 dark:bg-gray-800">
      <div className="flex flex-col items-center">
        {/* Heading positioned in the top right */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Tips and Advice
        </h1>

        {/* Advice Card with max height and scroll */}
        <div className="card card-side bg-base-100 dark:bg-gray-700 shadow-xl max-w-3xl w-full max-h-[60vh] overflow-auto p-4">
          <div className="card-body p-6">
            {loading ? (
              <div>
                <h2 className="text-gray-800 dark:text-gray-200">
                  Hold on tight, the AI is doing its magic!
                </h2>
                <div className="w-full h-24 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
              </div>
            ) : advice ? (
              <div
                className="prose max-w-full overflow-y-auto text-lg"
                dangerouslySetInnerHTML={{ __html: displayedAdvice }}
              ></div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Click the button to get advice.
              </p>
            )}
          </div>
        </div>

        {/* Button (hidden while loading) */}
        {!loading && (
          <button
            onClick={fetchAdvice}
            className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300"
          >
            Generate Advice
          </button>
        )}
      </div>
    </div>
  );
}

export default GetTipsAndAdvice;
