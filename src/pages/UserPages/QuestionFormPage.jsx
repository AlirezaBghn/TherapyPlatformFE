import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../services/api";
import { useAuth } from "../../context/AuthContext.jsx";
import RingLoader from "../../components/loadings/RingLoader.jsx";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaCheck,
  FaCircle,
  FaRegCircle,
  FaBrain,
  FaQuestionCircle,
} from "react-icons/fa";

const QuestionFormPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [animation, setAnimation] = useState("fade-in");
  const navigate = useNavigate();
  const {
    user,
    questionsSubmitted,
    setQuestionsSubmitted,
    setIsAuthenticated,
    setUserRole,
  } = useAuth();

  // All existing logic remains unchanged
  useEffect(() => {
    if (!user) {
      navigate("/signin", { replace: true });
      return;
    }
    if (questionsSubmitted) {
      navigate("/home", { replace: true });
      return;
    }
    const fetchQuestions = async () => {
      try {
        const res = await axiosClient.get("/user-questions");
        setQuestions(res.data);
        setResponses(new Array(res.data.length).fill(null));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [navigate, user, questionsSubmitted]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-bold mb-10 text-gray-900 dark:text-white drop-shadow-lg">
          Loading your questions...
        </h2>
        <div
          style={{ transform: "scale(2)" }}
          className="filter drop-shadow-xl"
        >
          <RingLoader />
        </div>
      </div>
    );
  if (!questions.length) return <div>No questions available.</div>;

  const currentQuestion = questions[currentIndex];
  const isSingleAnswer = currentQuestion.question
    .toLowerCase()
    .includes("distressing thoughts");

  const handleAnswerChange = (choice, checked) => {
    let updatedResponse;
    if (isSingleAnswer) {
      updatedResponse = choice;
    } else {
      const currentResponse = responses[currentIndex] || [];
      updatedResponse = checked
        ? [...currentResponse, choice]
        : currentResponse.filter((item) => item !== choice);
    }
    const newResponses = [...responses];
    newResponses[currentIndex] = updatedResponse;
    setResponses(newResponses);
    setLocalError(null);
  };

  const goNext = () => {
    const currentResponse = responses[currentIndex];
    if (
      currentResponse === null ||
      (Array.isArray(currentResponse) && currentResponse.length === 0)
    ) {
      setLocalError("Please select an answer before proceeding");
      return;
    }
    setLocalError(null);
    if (currentIndex < questions.length - 1) {
      setAnimation("fade-out");
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setAnimation("fade-in");
      }, 300);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setAnimation("fade-out");
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setAnimation("fade-in");
        setLocalError(null);
      }, 300);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const jumpToQuestion = (index) => {
    if (responses[index] !== null || index < currentIndex) {
      setAnimation("fade-out");
      setTimeout(() => {
        setCurrentIndex(index);
        setAnimation("fade-in");
      }, 300);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      responses.some(
        (response) =>
          response === null ||
          (Array.isArray(response) && response.length === 0)
      )
    ) {
      setSubmitError("Please answer all questions before submitting");
      return;
    }

    setSubmitting(true);
    try {
      const requests = questions.map((q, idx) => {
        const answerData = responses[idx];
        const payload = {
          question_id: q._id,
          answer: Array.isArray(answerData) ? answerData : [answerData],
          user_id: user._id,
        };
        return axiosClient.post(`/users/${user._id}/user-answers`, payload);
      });
      await Promise.all(requests);
      setQuestionsSubmitted(true);
      setIsAuthenticated(true);
      setUserRole("user");
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Error submitting answers:", err);
      setSubmitError("Failed to submit answers. Please try again");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate progress percentage
  const progress = Math.round(
    (responses.filter((r) => r !== null && (!Array.isArray(r) || r.length > 0))
      .length /
      questions.length) *
      100
  );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900 p-2 sm:p-4">
      {/* Background Accents with enhanced shadows */}
      <div className="absolute top-0 left-0 w-40 sm:w-64 h-40 sm:h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-40 sm:w-80 h-40 sm:h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

      {/* Main Content Card */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl sm:rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] sm:dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-700">
        {/* Progress Bar - Horizontal on mobile, vertical on desktop */}
        <div className="w-full md:w-24 bg-gray-100 dark:bg-gray-850 p-2 sm:p-4 flex flex-col items-center justify-start md:border-r border-t md:border-t-0 border-gray-100 dark:border-gray-700 shadow-[inset_0_5px_10px_rgba(0,0,0,0.05)] md:shadow-[inset_-5px_0_10px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_5px_10px_rgba(0,0,0,0.2)] md:dark:shadow-[inset_-5px_0_10px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-3 sm:mb-6 shadow-[0_4px_10px_rgba(0,0,0,0.2)] sm:shadow-[0_8px_15px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.4)] sm:dark:shadow-[0_8px_15px_rgba(0,0,0,0.4)]">
            <FaBrain className="text-base sm:text-xl drop-shadow-md" />
          </div>

          {/* Progress Steps */}
          <div className="relative flex-grow w-full flex flex-row md:flex-col items-center justify-between">
            {/* Line - horizontal on mobile, vertical on desktop */}
            <div className="absolute left-0 right-0 md:left-1/2 md:-translate-x-1/2 top-1/2 md:top-0 -translate-y-1/2 md:translate-y-0 h-0.5 md:h-full md:w-0.5 md:bottom-0 bg-gray-300 dark:bg-gray-600 z-0 shadow-[0_0_5px_rgba(0,0,0,0.1)]"></div>

            {/* Progress Steps with equal spacing */}
            <div className="relative z-10 flex flex-row md:flex-col items-center w-full justify-between md:h-full overflow-x-auto pb-2 md:pb-0 md:overflow-visible px-2 md:px-0 md:py-3">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpToQuestion(idx)}
                  disabled={responses[idx] === null && idx > currentIndex}
                  className={`flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all text-xs sm:text-sm
                    ${
                      idx === currentIndex
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 scale-110 shadow-[0_2px_8px_rgba(0,0,0,0.3)] sm:shadow-[0_4px_12px_rgba(0,0,0,0.3)] dark:shadow-[0_2px_8px_rgba(255,255,255,0.2)] sm:dark:shadow-[0_4px_12px_rgba(255,255,255,0.2)]"
                        : responses[idx] !== null
                        ? "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 shadow-sm"
                    } ${
                    responses[idx] === null && idx > currentIndex
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="mt-3 sm:mt-6 text-center">
            <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white drop-shadow-lg">
              {progress}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Complete
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-grow p-4 sm:p-6 md:p-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]">
          <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="h-full flex flex-col"
          >
            {/* Question Header */}
            <div className="mb-2 flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium drop-shadow-sm">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Rest of the content remains unchanged */}
            <div
              className={`transition-opacity duration-300 flex-grow ${
                animation === "fade-in" ? "opacity-100" : "opacity-0"
              }`}
            >
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 drop-shadow-lg">
                {currentQuestion.question}
              </h1>

              {/* Answer Options */}
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {currentQuestion.choices.map((choice) => (
                  <label
                    key={choice}
                    className={`flex items-center p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer hover:shadow-lg
                      ${
                        isSingleAnswer
                          ? responses[currentIndex] === choice
                            ? "bg-gray-100 dark:bg-gray-700 shadow-md"
                            : "hover:bg-gray-50 dark:hover:bg-gray-750"
                          : responses[currentIndex]?.includes(choice)
                          ? "bg-gray-100 dark:bg-gray-700 shadow-md"
                          : "hover:bg-gray-50 dark:hover:bg-gray-750"
                      }`}
                  >
                    <div className="mr-2 sm:mr-3 drop-shadow-md">
                      {isSingleAnswer ? (
                        responses[currentIndex] === choice ? (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 dark:text-white shadow-sm">
                            <FaCircle className="text-xs sm:text-sm filter drop-shadow-sm" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500">
                            <FaRegCircle className="text-xs sm:text-sm" />
                          </div>
                        )
                      ) : (
                        <div
                          className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded border-2 shadow-sm
                          ${
                            responses[currentIndex]?.includes(choice)
                              ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white shadow-inner"
                              : "border-gray-400 dark:border-gray-500"
                          }`}
                        >
                          {responses[currentIndex]?.includes(choice) && (
                            <FaCheck className="text-white dark:text-gray-900 text-[0.6rem] sm:text-xs filter drop-shadow-sm" />
                          )}
                        </div>
                      )}
                    </div>

                    <input
                      type={isSingleAnswer ? "radio" : "checkbox"}
                      name={`question-${currentIndex}`}
                      value={choice}
                      onChange={(e) =>
                        handleAnswerChange(choice, e.target.checked)
                      }
                      checked={
                        isSingleAnswer
                          ? responses[currentIndex] === choice
                          : responses[currentIndex]?.includes(choice) || false
                      }
                      className="sr-only"
                    />

                    <span className="text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-200 drop-shadow-sm">
                      {choice}
                    </span>
                  </label>
                ))}
              </div>

              {/* Error Message */}
              {localError && (
                <div className="flex items-start sm:items-center gap-1.5 sm:gap-2 text-red-500 mb-4 sm:mb-6 p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg sm:rounded-xl text-xs sm:text-sm shadow-lg">
                  <FaExclamationCircle className="flex-shrink-0 mt-0.5 sm:mt-0 drop-shadow-md" />
                  <p className="drop-shadow-sm">{localError}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-2 sm:gap-0 mt-auto">
                <button
                  type="button"
                  onClick={goPrevious}
                  disabled={currentIndex === 0}
                  className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700
                    ${
                      currentIndex === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md sm:hover:shadow-lg"
                    }`}
                >
                  <FaChevronLeft className="mr-1 text-[0.6rem] sm:text-xs" />
                  <span className="hidden xs:inline">Previous</span>
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs sm:text-sm font-medium shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-900 dark:border-white"
                  >
                    <span className="hidden xs:inline">Next</span>
                    <FaChevronRight className="ml-1 text-[0.6rem] sm:text-xs" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs sm:text-sm font-medium shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-900 dark:border-white disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Complete"}
                    <FaCheck className="ml-1.5 text-[0.6rem] sm:text-xs" />
                  </button>
                )}
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="flex items-start sm:items-center gap-1.5 sm:gap-2 text-red-500 mt-4 sm:mt-6 p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg sm:rounded-xl text-xs sm:text-sm shadow-lg">
                  <FaExclamationCircle className="flex-shrink-0 mt-0.5 sm:mt-0 drop-shadow-md" />
                  <p className="drop-shadow-sm">{submitError}</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionFormPage;
