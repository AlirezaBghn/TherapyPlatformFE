// import { useContext, useState, useEffect } from "react";
// import { AdviceContext } from "../../context/AdviceContext";
// import DOMPurify from "dompurify"; // Import DOMPurify
// import RingLoader from "../../components/loadings/RingLoader";

// function GetTipsAndAdvice() {
//   const { advice, fetchAdvice, loading } = useContext(AdviceContext);
//   const [displayedAdvice, setDisplayedAdvice] = useState("");

//   useEffect(() => {
//     if (advice) {
//       const cleanAdvice = advice?.trim(); // Clean up the advice
//       const sanitizedAdvice = DOMPurify.sanitize(cleanAdvice); // Sanitize the HTML
//       setDisplayedAdvice(sanitizedAdvice); // Set the sanitized HTML
//     }
//   }, [advice]);

//   return (
//     <div className="flex items-center justify-center h-[calc(100vh-8rem)] px-4 bg-gray-100 dark:bg-gray-800 mt-12">
//       <div className="flex flex-col items-center">
//         {/* Heading positioned in the top right */}
//         <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 mt-4">
//           Tips and Advice
//         </h1>

//         {/* Advice Card with max height and scroll */}
//         <div className="card card-side p-4 bg-gray-200  dark:bg-gray-600 shadow-xl max-w-3xl w-full max-h-[60vh] overflow-auto ">
//           <div className="card-body p-8 bg-gray-100 dark:bg-gray-500 shadow-xl max-w-3xl w-full max-h-[60vh] overflow-auto">
//             {loading ? (
//               <div>
//                 <h2 className="text-gray-800 dark:text-gray-200">
//                   Hold on tight, the AI is doing its magic!
//                 </h2>
//                 <div
//                   className="flex justify-center items-center mt-5"
//                   style={{ transform: "scale(1.2)" }}
//                 >
//                   <RingLoader />
//                 </div>
//               </div>
//             ) : advice ? (
//               <div
//                 className="prose max-w-full overflow-y-auto text-lg"
//                 dangerouslySetInnerHTML={{ __html: displayedAdvice }}
//               ></div>
//             ) : (
//               <p className="text-gray-500 dark:text-gray-200 text-lg">
//                 Click the button to get advice.
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Button (hidden while loading) */}
//         {!loading && (
//           <button
//             onClick={fetchAdvice}
//             className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300"
//           >
//             Generate Advice
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default GetTipsAndAdvice;
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
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 mt-16">
      <div className="flex flex-col items-center w-full max-w-4xl">
        {/* Heading with Icon */}
        <div className="flex items-center gap-3 mb-8">
          <FaLightbulb className="text-5xl text-yellow-500 dark:text-yellow-400 animate-pulse" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
            Tips and Advice
          </h1>
        </div>

        {/* Advice Card with Max Height and Scroll */}
        <div className="card bg-white dark:bg-gray-700 shadow-2xl rounded-lg w-full max-w-3xl max-h-[60vh] overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <div className="card-body p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-600 dark:to-gray-700 rounded-lg shadow-inner w-full max-h-[60vh] overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center">
                <h2 className="text-gray-800 dark:text-gray-200 text-xl mb-4">
                  Hold on tight, the AI is doing its magic!
                </h2>
                <div className="flex justify-center items-center mt-5">
                  <RingLoader />
                </div>
              </div>
            ) : advice ? (
              <div className="prose max-w-full overflow-y-auto text-lg text-gray-800 dark:text-gray-200">
                <FaQuoteLeft className="text-gray-400 dark:text-gray-300 mb-2" />
                <div dangerouslySetInnerHTML={{ __html: displayedAdvice }} />
                <FaQuoteRight className="text-gray-400 dark:text-gray-300 mt-2" />
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-200 text-lg text-center">
                Click the button to get advice.
              </p>
            )}
          </div>
        </div>

        {/* Button (Hidden While Loading) */}
        {!loading && (
          <button
            onClick={fetchAdvice}
            className="mt-8 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg text-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FaMagic className="text-xl animate-spin-slow" />
            <span>Generate Advice</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default GetTipsAndAdvice;
