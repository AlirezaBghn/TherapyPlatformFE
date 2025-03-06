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
import { toast } from "react-hot-toast"; // Import toast

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
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-3 sm:px-4 md:px-6 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 mt-16 sm:mt-20 py-8">
      <div className="flex flex-col items-center w-full max-w-4xl">
        {/* Heading with Icon - Responsive sizing */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-6 sm:mb-8 text-center sm:text-left">
          <FaLightbulb className="text-4xl sm:text-5xl md:text-6xl text-gray-800 dark:text-gray-200 animate-pulse" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200">
            Tips and Advice
          </h1>
        </div>

        {/* Advice Card with Max Height and Scroll - Responsive sizing and padding */}
        <div className="card bg-white dark:bg-gray-700 shadow-xl sm:shadow-2xl rounded-lg w-full max-w-3xl max-h-[50vh] sm:max-h-[60vh] overflow-hidden transform hover:scale-102 sm:hover:scale-105 transition-transform duration-300">
          <div className="card-body p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white to-gray-100 dark:from-gray-600 dark:to-gray-700 rounded-lg shadow-inner w-full max-h-[50vh] sm:max-h-[60vh] overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center">
                <h2 className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200 mb-4 sm:mb-6 text-center">
                  Hold on tight, the AI is doing its magic!
                </h2>
                <div className="flex justify-center items-center mt-3 sm:mt-5">
                  <RingLoader />
                </div>
              </div>
            ) : advice ? (
              <div className="prose max-w-full overflow-y-auto text-base sm:text-lg md:text-xl text-gray-800 dark:text-gray-200">
                <FaQuoteLeft className="text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 text-2xl sm:text-3xl" />
                <div dangerouslySetInnerHTML={{ __html: displayedAdvice }} />
                <FaQuoteRight className="text-gray-800 dark:text-gray-200 mt-3 sm:mt-4 text-2xl sm:text-3xl ml-auto" />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-200 text-center mb-4 sm:mb-6">
                  Ready for some wisdom? Click the button below!
                </p>
                <div className="animate-bounce">
                  <FaMagic className="text-3xl sm:text-4xl text-gray-800 dark:text-gray-200" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Button (Hidden While Loading) - Responsive sizing and padding */}
        {!loading && (
          <button
            onClick={() =>
              toast.promise(fetchAdvice(), {
                loading: "Summoning ancient wisdom...",
                success: "Your wisdom has been generated!",
                error: "Alas, magic failed. Please try again!",
              })
            }
            className="mt-6 sm:mt-8 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-gray-800 text-white rounded-lg text-base sm:text-lg md:text-xl font-semibold hover:bg-gray-900 transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl"
          >
            <FaMagic className="text-xl sm:text-2xl" />
            <span>Generate Advice</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default GetTipsAndAdvice;
