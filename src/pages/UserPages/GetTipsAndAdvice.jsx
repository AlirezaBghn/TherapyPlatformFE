import { useContext, useState, useEffect } from "react";
import { AdviceContext } from "../../context/AdviceContext";
import DOMPurify from "dompurify"; // Import DOMPurify
import RingLoader from "../../components/loadings/RingLoader";
import {
  FaLightbulb,
  FaMagic,
  FaQuoteLeft,
  FaQuoteRight,
} from "react-icons/fa"; // Import icons

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
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 mt-16">
      <div className="flex flex-col items-center w-full max-w-4xl">
        {/* Heading with Icon */}
        <div className="flex items-center gap-3 mb-8">
          <FaLightbulb className="text-6xl text-gray-800 dark:text-gray-200 animate-pulse" />
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-200">
            Tips and Advice
          </h1>
        </div>

        {/* Advice Card with Max Height and Scroll */}
        <div className="card bg-white dark:bg-gray-700 shadow-2xl rounded-lg w-full max-w-3xl max-h-[60vh] overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <div className="card-body p-8 bg-gradient-to-br from-white to-gray-100 dark:from-gray-600 dark:to-gray-700 rounded-lg shadow-inner w-full max-h-[60vh] overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center">
                <h2 className="text-gray-800 dark:text-gray-200 text-2xl mb-6">
                  Hold on tight, the AI is doing its magic!
                </h2>
                <div className="flex justify-center items-center mt-5">
                  <RingLoader />
                </div>
              </div>
            ) : advice ? (
              <div className="prose max-w-full overflow-y-auto text-xl text-gray-800 dark:text-gray-200">
                <FaQuoteLeft className="text-gray-800 dark:text-gray-200 mb-4 text-3xl" />
                <div dangerouslySetInnerHTML={{ __html: displayedAdvice }} />
                <FaQuoteRight className="text-gray-800 dark:text-gray-200 mt-4 text-3xl" />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-gray-500 dark:text-gray-200 text-2xl text-center mb-6">
                  Ready for some wisdom? Click the button below!
                </p>
                <div className="animate-bounce">
                  <FaMagic className="text-4xl text-gray-800 dark:text-gray-200" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Button (Hidden While Loading) */}
        {!loading && (
          <button
            onClick={fetchAdvice}
            className="mt-8 px-10 py-5 bg-gray-800 text-white rounded-lg text-xl font-semibold hover:bg-gray-900 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
          >
            <FaMagic className="text-2xl" />
            <span>Generate Advice</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default GetTipsAndAdvice;
