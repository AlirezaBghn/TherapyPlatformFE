import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../services/api";
import { useTherapistAuth } from "../../context/TherapistAuthContext";

const TherapistPortalQuestionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();
  const { therapist, questionsSubmitted, setQuestionsSubmitted } =
    useTherapistAuth();

  useEffect(() => {
    if (!therapist) {
      navigate("/therapist-signin", { replace: true });
      return;
    }
    if (questionsSubmitted) {
      navigate("/therapist/dashboard", { replace: true });
      return;
    }
    const fetchQuestions = async () => {
      try {
        const res = await axiosClient.get("/therapist-questions");
        setQuestions(res.data);
        // Initialize responses with null so we know nothing is selected
        setResponses(new Array(res.data.length).fill(null));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching therapist questions:", err);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [navigate, therapist, questionsSubmitted]);

  if (loading) return <div>Loading questions...</div>;
  if (!questions.length) return <div>No questions available.</div>;

  const currentQuestion = questions[currentIndex];
  // Single-answer if the question contains "experience"
  const isSingleAnswer = currentQuestion.question
    .toLowerCase()
    .includes("experience");

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
    // Clear error immediately if a valid answer is selected.
    if (
      updatedResponse &&
      (typeof updatedResponse === "string" || updatedResponse.length > 0)
    ) {
      setLocalError(null);
    }
  };

  const goNext = () => {
    const currentResponse = responses[currentIndex];
    if (
      currentResponse === null ||
      (Array.isArray(currentResponse) && currentResponse.length === 0)
    ) {
      setLocalError("Please select an answer before proceeding.");
      return;
    }
    setLocalError(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setLocalError(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
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
      setSubmitError("Please answer all questions before submitting.");
      return;
    }
    try {
      const requests = questions.map((q, idx) => {
        const answerData = responses[idx];
        const payload = {
          question_id: q._id,
          answer: Array.isArray(answerData) ? answerData : [answerData],
        };
        return axiosClient.post(
          `/therapists/${therapist._id}/therapist-answers`,
          payload
        );
      });
      await Promise.all(requests);
      setQuestionsSubmitted(true);
      navigate("/therapist/dashboard", { replace: true });
    } catch (err) {
      console.error("Error submitting therapist answers:", err);
      setSubmitError("Failed to submit answers. Please try again.");
    }
  };

  return (
    <div className="h-screen md:flex">
      <div
        className="relative overflow-hidden md:flex w-1/2 justify-around items-center hidden"
        style={{
          backgroundImage: "url('https://example.com/therapist-questions.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative text-center text-white z-10 px-10 mt-[-290px] max-w-[80%]">
          <h1 className="font-bold text-5xl mb-4">Therapist Questionnaire</h1>
          <p className="text-xl font-light">
            Please answer all questions to complete your profile.
          </p>
        </div>
      </div>

      <div className="flex md:w-1/2 justify-center items-center bg-white">
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="bg-white w-[600px] min-h-[400px] p-10 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
        >
          <h1 className="text-gray-900 font-bold text-4xl mb-8 text-center">
            {currentQuestion.question}
          </h1>
          <div>
            {currentQuestion.choices.map((choice) => (
              <label key={choice} className="flex items-center mb-3 text-xl">
                <input
                  type={isSingleAnswer ? "radio" : "checkbox"}
                  name={`question-${currentIndex}`}
                  value={choice}
                  onChange={(e) => handleAnswerChange(choice, e.target.checked)}
                  className="mr-3 w-6 h-6"
                  checked={
                    isSingleAnswer
                      ? responses[currentIndex] === choice
                      : responses[currentIndex]?.includes(choice) || false
                  }
                />
                {choice}
              </label>
            ))}
          </div>
          {localError && <p className="text-red-500 mt-2">{localError}</p>}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={goPrevious}
              disabled={currentIndex === 0}
              className={`px-10 py-4 text-xl font-semibold rounded text-gray-900 border border-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200 ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="px-10 py-4 text-xl font-semibold rounded text-gray-900 border border-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-10 py-4 text-xl font-semibold rounded text-gray-900 border border-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
              >
                Submit Answers
              </button>
            )}
          </div>
          {submitError && <p className="text-red-500 mt-4">{submitError}</p>}
        </form>
      </div>
    </div>
  );
};

export default TherapistPortalQuestionnaire;
