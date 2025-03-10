import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../services/api";
import { useTherapistAuth } from "../../context/TherapistAuthContext";
import ProfileSkeleton from "../../components/loadings/ProfileSkeleton";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { FaImage } from "react-icons/fa";

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
  // State for showing the delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Helper to match answer to question details (for list view)
  const getQuestionByAnswer = (answer) => {
    if (!answer || !answer.question_id) return null;
    return questionsList.find(
      (q) => q._id === answer.question_id._id || q._id === answer.question_id
    );
  };

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
      // Update the original therapist data only on save
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

  // For the header, always use the original therapist data so that live typing does not affect it.
  // In the edit form, we use editedTherapist.
  // Also, add "rounded-full" and "overflow-hidden" to the image container.
  if (initialLoading) {
    return (
      <div className="container mx-auto px-6 py-12 mt-24">
        <div className="flex justify-start">
          <div
            className="w-full max-w-sm ml-5"
            style={{ transform: "scale(1.2)" }}
          >
            <ProfileSkeleton
              profile={true}
              skeletonColor="bg-gray-200"
              count={1}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
              Delete Account
            </h3>
            <p className="mb-5 sm:mb-6 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2 bg-white text-gray-500 border-2 border-gray-300 rounded-full hover:bg-gray-50  dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto order-1 sm:order-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 "
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QA Cancellation Confirmation Modal */}
      {showQAModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Confirm Cancellation
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              Are you sure you want to cancel editing your answers? All unsaved
              changes will be lost.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() => {
                  toast("Changes discarded", { icon: "🚫" });
                  setQaMode(false);
                  setShowQAModal(false);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600  text-sm"
              >
                Discard Changes
              </button>
              <button
                onClick={() => setShowQAModal(false)}
                className="w-full sm:w-auto px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-600  text-sm"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-12 sm:mt-10 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 mt-12 rounded-xl shadow-lg p-4 sm:p-8">
          {/* Profile Header (always using original therapist data) */}
          <div className="flex flex-col sm:flex-row items-center border-b border-gray-200 dark:border-gray-700 pb-5 sm:pb-6 mb-5 sm:mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden relative mb-4 sm:mb-0 flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={
                    therapist.image ||
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3Ctext x='50' y='50' font-size='18' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23ffffff'%3ENo Image%3C/text%3E%3C/svg%3E"
                  }
                  alt={therapist.name}
                  className="min-w-full min-h-full object-cover rounded-full border border-gray-200 dark:border-gray-700 shadow-sm"
                />
              </div>
            </div>
            <div className="ml-0 sm:ml-8 text-base sm:text-lg space-y-1 sm:space-y-2 text-center sm:text-left w-full">
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Name:</span> {therapist.name}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Username:</span>{" "}
                <span className="break-words">{therapist.username}</span>
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Email:</span>{" "}
                <span className="break-words">{therapist.email}</span>
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Phone:</span>{" "}
                {therapist.phone || "Not provided"}
              </p>
            </div>
          </div>

          {/* Edit Form / Action Buttons */}
          {isEditingProfile ? (
            <div className="animate-fade-in">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                Edit Profile
              </h2>
              <div className="grid gap-4 sm:gap-6">
                {/* Form Fields using editedTherapist */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editedTherapist.name}
                      onChange={handleProfileChange}
                      className="w-full bg-white px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white "
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={editedTherapist.username}
                      onChange={handleProfileChange}
                      className="w-full bg-white px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white "
                    />
                    {usernameError && (
                      <p className="text-red-500 text-xs mt-1">
                        {usernameError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editedTherapist.email}
                      onChange={handleProfileChange}
                      className="w-full bg-white px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white "
                    />
                    {emailError && (
                      <p className="text-red-500 text-xs mt-1">{emailError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editedTherapist.phone || ""}
                      onChange={handleProfileChange}
                      className="w-full bg-white px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white "
                    />
                  </div>
                  <div className="pt-1">
                    <label className="flex items-center gap-2 border-2 border-gray-300 dark:border-gray-600 py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl cursor-pointer hover:border-gray-500 dark:hover:border-gray-400 ">
                      <FaImage className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 " />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-grow truncate">
                        {editedTherapist.image?.name ||
                          "Upload profile picture"}
                      </span>
                      <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <span className="bg-gray-200 dark:bg-gray-700 px-3 sm:px-4 py-1 rounded-lg text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-medium whitespace-nowrap">
                        Browse
                      </span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:space-x-4 mt-4 sm:mt-6">
                  <button
                    onClick={handleProfileCancel}
                    className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100  dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100  dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2">
              <button
                onClick={handleProfileEdit}
                className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Edit Profile
              </button>
              <button
                onClick={toggleQaMode}
                className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {qaMode ? "Cancel Edit" : "Edit Answers"}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Delete Account
              </button>
            </div>
          )}

          {/* Form Errors */}
          {profileError && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {profileError}
            </div>
          )}
        </div>
      </div>

      {/* Therapist Answers and Questions */}
      {!qaMode ? (
        <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-12 max-w-4xl -mt-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Questions & Answers
            </h2>
            {therapistAnswers.length === 0 ? (
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                No answers available.
              </p>
            ) : (
              therapistAnswers.map((answer) => {
                const questionObj = getQuestionByAnswer(answer);
                return (
                  <div
                    key={answer._id}
                    className="border-b border-gray-300 dark:border-gray-700 py-3"
                  >
                    <p className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                      {questionObj
                        ? questionObj.question
                        : answer.question_id.question}
                    </p>
                    <div className="mt-1">
                      <p className="text-gray-800 dark:text-gray-200 text-sm">
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
        <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-12 max-w-4xl -mt-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8">
            {/* X button visible only on larger screens */}
            <button
              onClick={() => setShowQAModal(true)}
              className="hidden sm:block absolute top-2 right-2 text-2xl font-bold text-gray-900 dark:text-white p-2"
              aria-label="Cancel editing"
            >
              &times;
            </button>
            {questionsList.length > 0 && (
              <>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {questionsList[currentIndex].question}
                </h2>
                <div className="mt-3">
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
                              qaResponses[currentIndex]?.includes(choice))) && (
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
                              className="mt-2 w-full p-2 border bg-white border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded text-sm"
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
                                : qaResponses[currentIndex]?.includes(choice) ||
                                  false
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
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mt-6">
                  <button
                    type="button"
                    onClick={goPrevious}
                    disabled={currentIndex === 0 || qaLoading}
                    className="w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100  dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  {currentIndex < questionsList.length - 1 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={qaLoading}
                      className="w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100  dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleQASubmit}
                      disabled={qaLoading}
                      className="w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100  dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
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
    </>
  );
};

export default TherapistPortalProfile;
