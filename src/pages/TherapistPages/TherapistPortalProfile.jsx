import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../services/api";
import { useTherapistAuth } from "../../context/TherapistAuthContext";
import ProfileSkeleton from "../../components/loadings/ProfileSkeleton";
import toast from "react-hot-toast";

const TherapistPortalProfile = () => {
  const {
    therapist,
    setTherapist,
    setIsTherapistAuthenticated,
    setQuestionsSubmitted,
    setTherapistRole,
  } = useTherapistAuth();
  const navigate = useNavigate();

  // Redirect if therapist is not signed in
  if (!therapist) {
    navigate("/therapist-signin", { replace: true });
    return null;
  }

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [qaLoading, setQaLoading] = useState(false);

  // States for profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedTherapist, setEditedTherapist] = useState({ ...therapist });
  const [profileError, setProfileError] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  // States for therapist answers and questions (list view)
  const [therapistAnswers, setTherapistAnswers] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  // For in-place editing (list view) [not used in QA mode]
  const [isEditingAnswers, setIsEditingAnswers] = useState(false);
  const [editingAnswers, setEditingAnswers] = useState({});

  // States for QA (questionnaire) editing mode
  const [qaMode, setQaMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [qaResponses, setQaResponses] = useState([]);
  const [qaLocalError, setQaLocalError] = useState("");
  // State to hold "Other" text for each question in QA mode
  const [qaOther, setQaOther] = useState([]);
  // State for showing the confirmation modal when cancelling QA mode
  const [showQAModal, setShowQAModal] = useState(false);
  // NEW: State for showing the delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch therapist answers and questions on mount
  useEffect(() => {
    let completedRequests = 0;
    const checkLoading = () => {
      completedRequests++;
      if (completedRequests === 2) {
        setInitialLoading(false);
      }
    };

    axiosClient
      .get(`/therapists/${therapist._id}/therapist-answers`, {
        withCredentials: true,
      })
      .then((res) => {
        setTherapistAnswers(res.data);
        // For list editing: preserve answers as arrays
        const initialEdits = {};
        res.data.forEach((ans) => {
          initialEdits[ans._id] = ans.answer || [];
        });
        setEditingAnswers(initialEdits);
      })
      .catch((err) => console.error("Error fetching therapist answers:", err))
      .finally(checkLoading);

    axiosClient
      .get("/therapist-questions")
      .then((res) => {
        setQuestionsList(res.data);
        // Initialize QA responses as empty arrays so therapist must choose each answer
        const initialQA = res.data.map(() => []);
        setQaResponses(initialQA);
        // Initialize qaOther for each question as an empty string.
        const initialOther = res.data.map(() => "");
        setQaOther(initialOther);
      })
      .catch((err) => console.error("Error fetching therapist questions:", err))
      .finally(checkLoading);
  }, [therapist._id]);

  // Profile editing handlers
  const handleProfileEdit = () => {
    setEditedTherapist({ ...therapist });
    setIsEditingProfile(true);
    setEmailError("");
    setUsernameError("");
    toast("You are now editing your profile", { icon: "✏️" });
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setEditedTherapist({ ...therapist });
    setEmailError("");
    setUsernameError("");
    toast("Profile editing cancelled", { icon: "🚫" });
  };

  const handleProfileSave = async () => {
    const toastId = toast.loading("Saving profile changes...");
    try {
      setProfileLoading(true);
      setEmailError("");
      setUsernameError("");
      setProfileError(null);

      const formData = new FormData();
      if (editedTherapist.name !== therapist.name)
        formData.append("name", editedTherapist.name);
      if (editedTherapist.username !== therapist.username)
        formData.append("username", editedTherapist.username);
      if (editedTherapist.email !== therapist.email)
        formData.append("email", editedTherapist.email);
      if (editedTherapist.phone !== therapist.phone)
        formData.append("phone", editedTherapist.phone);
      if (editedTherapist.image && editedTherapist.image !== therapist.image)
        formData.append("image", editedTherapist.image);

      const res = await axiosClient.put(
        `/therapists/${therapist._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTherapist(res.data);
      setIsEditingProfile(false);
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (err) {
      console.error(
        "Profile update failed:",
        err.response?.data || err.message
      );
      if (err.response && err.response.status === 413) {
        setProfileError("Payload too large. Please reduce the file size.");
      } else if (err.response?.data?.error === "Email is already taken") {
        setEmailError("This email is already in use.");
      } else if (err.response?.data?.error === "Username is already taken") {
        setUsernameError("This username is already taken.");
      } else {
        setProfileError(err.response?.data?.error || "Update failed");
      }
      toast.error("Failed to update profile", { id: toastId });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditedTherapist((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedTherapist((prev) => ({ ...prev, image: file }));
    }
  };

  // Function to handle account deletion when confirmed in the modal
  const handleConfirmDelete = async () => {
    const toastId = toast.loading("Deleting account...");
    try {
      await axiosClient.delete(`/therapists/${therapist._id}`, {
        withCredentials: true,
      });
      setTherapist(null);
      setIsTherapistAuthenticated(false);
      setQuestionsSubmitted(false);
      setTherapistRole("");
      setShowDeleteModal(false);
      navigate("/", { replace: true });
      toast.success("Account deleted successfully!", { id: toastId });
    } catch (err) {
      console.error(
        "Failed to delete account:",
        err.response?.data || err.message
      );
      toast.error("Failed to delete account", { id: toastId });
    }
  };

  // Toggle between list view and QA mode for editing answers.
  // When canceling QA mode, open the confirmation modal.
  const toggleQaMode = () => {
    if (qaMode) {
      setShowQAModal(true);
    } else {
      // When entering QA mode, reinitialize qaResponses and qaOther as empty
      if (questionsList.length > 0) {
        const initialQA = questionsList.map(() => []);
        const initialOther = questionsList.map(() => "");
        setQaResponses(initialQA);
        setQaOther(initialOther);
        setCurrentIndex(0);
        setQaLocalError("");
      }
      setQaMode(true);
      toast("Entered QA mode", { icon: "📝" });
    }
  };

  // In QA mode: handle answer change (radio for single, checkbox for multi)
  const handleQAChange = (choice, checked) => {
    const currentQuestion = questionsList[currentIndex];
    const isSingle = currentQuestion.question
      .toLowerCase()
      .includes("experience");
    let updatedResponse;
    if (isSingle) {
      updatedResponse = [choice];
    } else {
      const currentResponse = qaResponses[currentIndex] || [];
      updatedResponse = checked
        ? [...currentResponse, choice]
        : currentResponse.filter((item) => item !== choice);
    }
    const newResponses = [...qaResponses];
    newResponses[currentIndex] = updatedResponse;
    setQaResponses(newResponses);
  };

  const goNext = () => {
    if (
      !qaResponses[currentIndex] ||
      (Array.isArray(qaResponses[currentIndex]) &&
        qaResponses[currentIndex].length === 0)
    ) {
      setQaLocalError("You must choose at least one answer.");
      toast.error("Please select an answer before proceeding", { icon: "⚠️" });
      return;
    }
    setQaLocalError("");
    if (currentIndex < questionsList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      toast("Moved to next question", { icon: "➡️" });
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setQaLocalError("");
      toast("Moved to previous question", { icon: "⬅️" });
    }
  };

  const handleQASubmit = async () => {
    // Validate current response
    if (
      !qaResponses[currentIndex] ||
      (Array.isArray(qaResponses[currentIndex]) &&
        qaResponses[currentIndex].length === 0)
    ) {
      setQaLocalError("You must choose at least one answer.");
      toast.error("Please select an answer before submitting", { icon: "⚠️" });
      return;
    }
    setQaLoading(true);
    const toastId = toast.loading("Submitting your answers...");
    // Before sending, check if "Other (please specify)" is chosen and append the custom text.
    const finalAnswers = qaResponses.map((resp, idx) => {
      if (
        resp.includes("Other (please specify)") &&
        qaOther[idx].trim() !== ""
      ) {
        return [`Other (please specify): ${qaOther[idx].trim()}`];
      }
      return resp;
    });
    try {
      const updateRequests = questionsList.map((q, idx) => {
        // Find the corresponding answer object by matching question _id
        const answerObj = therapistAnswers.find((a) => {
          if (a.question_id._id) return a.question_id._id === q._id;
          return a.question_id === q._id;
        });
        if (answerObj) {
          return axiosClient.put(
            `/therapists/${therapist._id}/therapist-answers/${answerObj._id}`,
            { answer: finalAnswers[idx] },
            { withCredentials: true }
          );
        } else {
          return axiosClient.post(
            `/therapists/${therapist._id}/therapist-answers`,
            { question_id: q._id, answer: finalAnswers[idx] },
            { withCredentials: true }
          );
        }
      });
      const responses = await Promise.all(updateRequests);
      const updatedAnswers = therapistAnswers.slice();
      responses.forEach((res) => {
        const updated = res.data;
        const index = updatedAnswers.findIndex((a) => a._id === updated._id);
        if (index !== -1) {
          updatedAnswers[index] = updated;
        }
      });
      setTherapistAnswers(updatedAnswers);
      setQaMode(false);
      toast.success("Your answers have been submitted successfully!", {
        id: toastId,
      });
    } catch (err) {
      console.error(
        "Failed to update answers:",
        err.response?.data || err.message
      );
      toast.error("Failed to submit answers", { id: toastId });
    } finally {
      setQaLoading(false);
    }
  };

  // Helper to match answer to question details (for list view)
  const getQuestionByAnswer = (answer) => {
    if (!answer || !answer.question_id) return null;
    return questionsList.find(
      (q) => q._id === answer.question_id._id || q._id === answer.question_id
    );
  };

  const displayTherapist = isEditingProfile ? editedTherapist : therapist;

  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-3 sm:px-6">
        {/* Responsive skeleton loader */}
        <div className="w-full max-w-md">
          <div className="flex justify-center">
            <div className="w-full">
              <ProfileSkeleton
                skeletonColor="bg-gray-200"
                count={1}
                linesOnly={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-4 sm:py-8 md:py-12">
      {/* Profile Card */}
      <div className="container mx-auto px-3 sm:px-4 mt-12 sm:mt-16">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md sm:shadow-xl md:shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Profile Image - Centered on mobile, left-aligned on md+ */}
            <div className="relative flex justify-center md:justify-start pt-6 md:pt-0">
              <img
                src={
                  displayTherapist.image ||
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3Ctext x='50' y='50' font-size='18' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23ffffff'%3ENo Image%3C/text%3E%3C/svg%3E"
                }
                alt={displayTherapist.name}
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-full mx-auto md:mx-6 md:my-6 border border-gray-300 dark:border-gray-600"
              />
              {isEditingProfile && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-white text-sm font-medium p-2"
                  >
                    Change
                  </label>
                  <input
                    type="file"
                    id="image-upload"
                    name="profileImage"
                    autoComplete="off"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1 p-4 sm:p-6">
              <div className="space-y-2">
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="name"
                    value={displayTherapist.name}
                    onChange={handleProfileChange}
                    className="w-full text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                ) : (
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {displayTherapist.name}
                  </h1>
                )}
                {isEditingProfile ? (
                  <>
                    <input
                      type="text"
                      name="username"
                      value={displayTherapist.username}
                      onChange={handleProfileChange}
                      className="w-full text-base sm:text-lg md:text-xl text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                    {usernameError && (
                      <p className="text-red-500 text-xs sm:text-sm">
                        {usernameError}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-white">
                    {displayTherapist.username}
                  </p>
                )}
                {isEditingProfile ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={displayTherapist.email}
                      onChange={handleProfileChange}
                      className="w-full text-base sm:text-lg md:text-xl text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                    {emailError && (
                      <p className="text-red-500 text-xs sm:text-sm">
                        {emailError}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-white break-words">
                    {displayTherapist.email}
                  </p>
                )}
                {isEditingProfile ? (
                  <input
                    type="tel"
                    name="phone"
                    value={displayTherapist.phone}
                    onChange={handleProfileChange}
                    className="w-full text-base sm:text-lg md:text-xl text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                ) : (
                  <p className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-white">
                    {displayTherapist.phone}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
                {isEditingProfile ? (
                  <>
                    <button
                      onClick={handleProfileCancel}
                      className="w-full sm:w-auto px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base border border-red-600 text-red-600 rounded hover:text-red-500 hover:border-red-500 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProfileSave}
                      disabled={profileLoading}
                      className="w-full sm:w-auto px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base border border-green-700 text-green-700 rounded hover:text-green-600 hover:border-green-600 transition duration-200"
                    >
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleProfileEdit}
                      className="w-full sm:w-auto px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base border border-blue-500 text-blue-500 rounded hover:text-blue-400 hover:border-blue-600 transition duration-200"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={toggleQaMode}
                      className="w-full sm:w-auto px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base border border-blue-500 text-blue-500 rounded hover:text-blue-400 hover:border-blue-600 transition duration-200"
                    >
                      {qaMode ? "Cancel Edit" : "Edit Answers"}
                    </button>
                    {/* Delete Account button */}
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full sm:w-auto px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base border border-red-600 text-red-600 rounded hover:text-red-500 hover:border-red-600 transition duration-200"
                    >
                      Delete Account
                    </button>
                  </>
                )}
              </div>
              {profileError && (
                <p className="mt-3 sm:mt-4 text-red-500 text-xs sm:text-sm">
                  {profileError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Either display the List View or the QA (questionnaire) View */}
        {!qaMode ? (
          // List View: show questions & answers as a card
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md sm:shadow-xl md:shadow-2xl overflow-hidden mt-6 sm:mt-8 md:mt-10">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Your Questions & Answers
              </h2>
              {therapistAnswers.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  No answers available.
                </p>
              ) : (
                therapistAnswers.map((answer) => {
                  const questionObj = getQuestionByAnswer(answer);
                  return (
                    <div
                      key={answer._id}
                      className="border-b border-gray-300 dark:border-gray-700 py-3 sm:py-4"
                    >
                      <p className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                        {questionObj
                          ? questionObj.question
                          : answer.question_id.question}
                      </p>
                      <div className="mt-1 sm:mt-2">
                        <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                          {answer.answer.join(", ")}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          // QA Mode: display one question at a time
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md sm:shadow-xl md:shadow-2xl overflow-hidden mt-6 sm:mt-8 md:mt-10 relative">
            {/* X button to cancel QA mode - more touch-friendly */}
            <button
              onClick={() => setShowQAModal(true)}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white p-2 -m-2"
              aria-label="Cancel editing"
            >
              &times;
            </button>
            <div className="p-4 sm:p-6">
              {questionsList.length > 0 && (
                <>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 pr-8">
                    {questionsList[currentIndex].question}
                  </h2>
                  <div className="mt-3 sm:mt-4">
                    {questionsList[currentIndex].choices?.map((choice) => {
                      const isSingle = questionsList[currentIndex].question
                        .toLowerCase()
                        .includes("experience");
                      if (choice === "Other (please specify)") {
                        return (
                          <div key={choice} className="mb-3">
                            <label className="flex items-center text-base sm:text-lg">
                              <input
                                type={isSingle ? "radio" : "checkbox"}
                                name={`qa-question-${currentIndex}`}
                                value={choice}
                                onChange={(e) =>
                                  handleQAChange(choice, e.target.checked)
                                }
                                className="mr-3 w-5 h-5 sm:w-6 sm:h-6"
                                checked={
                                  isSingle
                                    ? qaResponses[currentIndex]?.[0] === choice
                                    : qaResponses[currentIndex]?.includes(
                                        choice
                                      ) || false
                                }
                              />
                              {choice}
                            </label>
                            {((isSingle &&
                              qaResponses[currentIndex]?.[0] === choice) ||
                              (!isSingle &&
                                qaResponses[currentIndex]?.includes(
                                  choice
                                ))) && (
                              <textarea
                                placeholder="Please specify (max 100 words)"
                                value={qaOther[currentIndex] || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const words = value.trim().split(/\s+/);
                                  if (
                                    words.filter((w) => w !== "").length <= 100
                                  ) {
                                    const newQaOther = [...qaOther];
                                    newQaOther[currentIndex] = value;
                                    setQaOther(newQaOther);
                                  }
                                }}
                                className="mt-2 w-full p-2 border bg-white border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded text-sm sm:text-base"
                                rows={3}
                              />
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <label
                            key={choice}
                            className="flex items-center mb-3 text-base sm:text-lg"
                          >
                            <input
                              type={isSingle ? "radio" : "checkbox"}
                              name={`qa-question-${currentIndex}`}
                              value={choice}
                              onChange={(e) =>
                                handleQAChange(choice, e.target.checked)
                              }
                              className="mr-3 w-5 h-5 sm:w-6 sm:h-6"
                              checked={
                                isSingle
                                  ? qaResponses[currentIndex]?.[0] === choice
                                  : qaResponses[currentIndex]?.includes(
                                      choice
                                    ) || false
                              }
                            />
                            {choice}
                          </label>
                        );
                      }
                    })}
                  </div>
                  {qaLocalError && (
                    <p className="text-red-500 mt-2 text-xs sm:text-sm">
                      {qaLocalError}
                    </p>
                  )}
                  <div className="flex justify-between mt-6 sm:mt-8">
                    <button
                      type="button"
                      onClick={goPrevious}
                      disabled={currentIndex === 0 || qaLoading}
                      className={`px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium sm:font-semibold rounded border border-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200 ${
                        currentIndex === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Previous
                    </button>
                    {currentIndex < questionsList.length - 1 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={qaLoading}
                        className="px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium sm:font-semibold rounded border border-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleQASubmit}
                        disabled={qaLoading}
                        className="px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium sm:font-semibold rounded border border-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
                      >
                        {qaLoading ? "Submitting..." : "Submit"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for QA cancellation */}
      {showQAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm mx-auto shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
              Confirm Cancellation
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-5 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to cancel editing your answers? All unsaved
              changes will be lost.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => {
                  handleQASubmit();
                  setShowQAModal(false);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition duration-200 text-sm sm:text-base"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  toast("Changes discarded", { icon: "🚫" });
                  setQaMode(false);
                  setShowQAModal(false);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition duration-200 text-sm sm:text-base"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm mx-auto shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
              Confirm Account Deletion
            </h2>
            <p className="text-red-500 mb-5 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition duration-200 text-sm sm:text-base"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistPortalProfile;
