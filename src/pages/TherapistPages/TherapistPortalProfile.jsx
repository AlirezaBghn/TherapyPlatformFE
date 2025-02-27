import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../services/api";
import { useTherapistAuth } from "../../context/TherapistAuthContext";
import ProfileSkeleton from "../../components/loadings/ProfileSkeleton";
const TherapistPortalProfile = () => {
  const { therapist, setTherapist } = useTherapistAuth();
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
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setEditedTherapist({ ...therapist });
    setEmailError("");
    setUsernameError("");
  };

  const handleProfileSave = async () => {
    try {
      setProfileLoading(true);
      setEmailError("");
      setUsernameError("");
      setProfileError(null);

      const updatedFields = {};
      if (editedTherapist.name !== therapist.name)
        updatedFields.name = editedTherapist.name;
      if (editedTherapist.username !== therapist.username)
        updatedFields.username = editedTherapist.username;
      if (editedTherapist.email !== therapist.email)
        updatedFields.email = editedTherapist.email;
      if (editedTherapist.phone !== therapist.phone)
        updatedFields.phone = editedTherapist.phone;
      if (editedTherapist.image && editedTherapist.image !== therapist.image)
        updatedFields.image = editedTherapist.image;

      const res = await axiosClient.put(
        `/therapists/${therapist._id}`,
        updatedFields,
        { withCredentials: true }
      );
      setTherapist(res.data);
      setIsEditingProfile(false);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedTherapist((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    alert("Account deleted");
    navigate("/", { replace: true });
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
      return;
    }
    setQaLocalError("");
    if (currentIndex < questionsList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setQaLocalError("");
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
      return;
    }
    setQaLoading(true);
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
    } catch (err) {
      console.error(
        "Failed to update answers:",
        err.response?.data || err.message
      );
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
      <div className="min-h-screen flex flex-col justify-center items-center">
        {/* Skeleton loader remains below */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex justify-center">
            <div
              className="w-full max-w-sm"
              style={{ transform: "scale(1.2)" }}
            >
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-12">
      {/* Profile Card */}
      <div className="container mx-auto px-4 mt-16">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative">
              <img
                src={
                  displayTherapist.image || "https://via.placeholder.com/150"
                }
                alt={displayTherapist.name}
                className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-full m-6 border border-gray-300 dark:border-gray-600"
              />
              {isEditingProfile && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-white text-sm font-medium"
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
            <div className="flex-1 p-6">
              <div className="space-y-2">
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="name"
                    value={displayTherapist.name}
                    onChange={handleProfileChange}
                    className="w-full text-3xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
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
                      className="w-full text-xl text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                    {usernameError && (
                      <p className="text-red-500 text-sm">{usernameError}</p>
                    )}
                  </>
                ) : (
                  <p className="text-xl text-gray-900 dark:text-white">
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
                      className="w-full text-xl text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm">{emailError}</p>
                    )}
                  </>
                ) : (
                  <p className="text-xl text-gray-900 dark:text-white">
                    {displayTherapist.email}
                  </p>
                )}
                {isEditingProfile ? (
                  <input
                    type="tel"
                    name="phone"
                    value={displayTherapist.phone}
                    onChange={handleProfileChange}
                    className="w-full text-xl text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                ) : (
                  <p className="text-xl text-gray-900 dark:text-white">
                    {displayTherapist.phone}
                  </p>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                {isEditingProfile ? (
                  <>
                    <button
                      onClick={handleProfileCancel}
                      className="px-6 py-2 border border-red-600 text-red-600 rounded hover:text-red-500 hover:border-red-500 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProfileSave}
                      disabled={profileLoading}
                      className="px-6 py-2 border border-green-700 text-green-700 rounded hover:text-green-600 hover:border-green-600 transition duration-200"
                    >
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleProfileEdit}
                      className="px-6 py-2 border border-blue-500 text-blue-500 rounded hover:text-blue-400 hover:border-blue-600 transition duration-200"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={toggleQaMode}
                      className="px-6 py-2 border border-blue-500 text-blue-500 rounded hover:text-blue-400 hover:border-blue-600 transition duration-200"
                    >
                      {qaMode ? "Cancel Edit Answers" : "Edit Answers"}
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-6 py-2 border border-red-600 text-red-600 rounded hover:text-red-500 hover:border-red-600 transition duration-200"
                    >
                      Delete Account
                    </button>
                  </>
                )}
              </div>
              {profileError && (
                <p className="mt-4 text-red-500">{profileError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Either display the List View or the QA (questionnaire) View */}
        {!qaMode ? (
          // List View: show questions & answers as a card
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden mt-10">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your Questions & Answers
              </h2>
              {therapistAnswers.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">
                  No answers available.
                </p>
              ) : (
                therapistAnswers.map((answer) => {
                  const questionObj = getQuestionByAnswer(answer);
                  return (
                    <div
                      key={answer._id}
                      className="border-b border-gray-300 dark:border-gray-700 py-4"
                    >
                      <p className="font-semibold text-lg text-gray-900 dark:text-white">
                        {questionObj
                          ? questionObj.question
                          : answer.question_id.question}
                      </p>
                      <div className="mt-2">
                        <p className="text-gray-800 dark:text-gray-200">
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
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden mt-10 relative">
            {/* X button to cancel QA mode */}
            <button
              onClick={() => setShowQAModal(true)}
              className="absolute top-4 right-4 text-3xl font-bold text-gray-900 dark:text-white"
            >
              &times;
            </button>
            <div className="p-6">
              {questionsList.length > 0 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {questionsList[currentIndex].question}
                  </h2>
                  <div>
                    {questionsList[currentIndex].choices?.map((choice) => {
                      const isSingle = questionsList[currentIndex].question
                        .toLowerCase()
                        .includes("experience");
                      if (choice === "Other (please specify)") {
                        return (
                          <div key={choice} className="mb-3">
                            <label className="flex items-center text-lg">
                              <input
                                type={isSingle ? "radio" : "checkbox"}
                                name={`qa-question-${currentIndex}`}
                                value={choice}
                                onChange={(e) =>
                                  handleQAChange(choice, e.target.checked)
                                }
                                className="mr-3 w-6 h-6"
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
                                className="mt-2 w-full p-2 border bg-white border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                              />
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <label
                            key={choice}
                            className="flex items-center mb-3 text-lg"
                          >
                            <input
                              type={isSingle ? "radio" : "checkbox"}
                              name={`qa-question-${currentIndex}`}
                              value={choice}
                              onChange={(e) =>
                                handleQAChange(choice, e.target.checked)
                              }
                              className="mr-3 w-6 h-6"
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
                    <p className="text-red-500 mt-2 text-sm">{qaLocalError}</p>
                  )}
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={goPrevious}
                      disabled={currentIndex === 0 || qaLoading}
                      className={`px-8 py-3 text-lg font-semibold rounded border border-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200 ${
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
                        className="px-8 py-3 text-lg font-semibold rounded border border-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleQASubmit}
                        disabled={qaLoading}
                        className="px-8 py-3 text-lg font-semibold rounded border border-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
                      >
                        {qaLoading ? "Submitting..." : "Submit Answers"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showQAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-auto shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Confirm Cancellation
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to cancel editing your answers? All unsaved
              changes will be lost.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  handleQASubmit();
                  setShowQAModal(false);
                }}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setQaMode(false);
                  setShowQAModal(false);
                }}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition duration-200"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistPortalProfile;
