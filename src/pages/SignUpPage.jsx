import { useState } from "react";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    profileImage: null,
    emotionalState: [],
    challenges: [],
    distressingThoughts: "",
    therapyGoals: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profileImage: e.target.files[0],
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    let updatedValues = [...formData[name]];
    if (checked) {
      updatedValues.push(value);
    } else {
      updatedValues = updatedValues.filter((item) => item !== value);
    }
    setFormData({
      ...formData,
      [name]: updatedValues,
    });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the form data to your backend or handle it as needed
    console.log("Form Data:", formData);
  };

  return (
    <div className="h-screen md:flex">
      {/* Left Section with Image Background */}
      <div
        className="relative overflow-hidden md:flex w-1/2 justify-around items-center hidden"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/greyscale-shot-wooden-dog-near-sea-with-foggy-background_181624-12858.jpg?t=st=1739962919~exp=1739966519~hmac=30a345bdb057f1a29af5318afcf3ed793b5d72082901fb0b03f5c52fdedb8e74&w=1380')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for Transparency */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Text Content */}
        <div className="relative text-center text-white z-10 px-10 mt-[-290px] max-w-[80%]">
          <h1 className="font-bold text-5xl mb-4">Join Us Today</h1>
          <p className="text-xl font-light">
            Take control of your mental well-being.
          </p>
          <p className="text-xl font-light mt-2">
            Sign up now and connect with experienced therapists who understand
            your needs.
          </p>
        </div>
      </div>

      {/* Right Section with Form */}
      <div className="flex md:w-1/2 justify-center items-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-[600px] min-h-[400px] p-10 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:scale-[1.01]"
        >
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <>
              <h1 className="text-gray-900 font-bold text-4xl mb-4 text-center">
                Hello Again!
              </h1>
              <p className="text-xl font-normal text-gray-600 mb-8 text-center">
                Create an account to get started
              </p>

              {/* Full Name Field */}
              <div className="flex items-center border-2 border-gray-300 py-4 px-5 rounded-2xl mb-6">
                <input
                  className="pl-4 w-full outline-none border-none bg-white text-xl"
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="flex items-center border-2 border-gray-300 py-4 px-5 rounded-2xl mb-6">
                <input
                  className="pl-4 w-full outline-none border-none bg-white text-xl"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="flex items-center border-2 border-gray-300 py-4 px-5 rounded-2xl mb-6">
                <input
                  className="pl-4 w-full outline-none border-none bg-white text-xl"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone Number Field */}
              <div className="flex items-center border-2 border-gray-300 py-4 px-5 rounded-2xl mb-6">
                <input
                  className="pl-4 w-full outline-none border-none bg-white text-xl"
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Profile Image Upload */}
              <div className="flex items-center border-2 border-gray-300 py-4 px-5 rounded-2xl mb-8">
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xl"
                  required
                />
              </div>

              {/* Next Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-10 py-4 text-xl font-semibold rounded text-gray-900 hover:text-gray-700 transition duration-200 border border-gray-900 hover:border-gray-700"
                >
                  Next
                </button>
              </div>
              {/* Link to Sign In (only shown in step 1) */}
              <p className="text-center text-gray-600 mt-6 text-xl">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-black font-bold hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </>
          )}

          {/* Step 2: Emotional State */}
          {step === 2 && (
            <>
              <h1 className="text-gray-900 font-bold text-4xl mb-4 text-center">
                Tell Us More About Yourself
              </h1>
              <p className="text-xl font-normal text-gray-600 mb-8 text-center">
                How would you describe your current emotional state?
              </p>

              {/* Emotional State Checkboxes */}
              {[
                "Stressed",
                "Anxious",
                "Depressed",
                "Overwhelmed",
                "Lonely",
                "Numb",
                "Hopeful",
              ].map((state) => (
                <label key={state} className="flex items-center mb-3 text-xl">
                  <input
                    type="checkbox"
                    name="emotionalState"
                    value={state}
                    onChange={handleCheckboxChange}
                    className="mr-3 w-6 h-6"
                  />
                  {state}
                </label>
              ))}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-10 py-4 text-xl font-semibold rounded text-gray-900 hover:text-gray-700 transition duration-200 border border-gray-900 hover:border-gray-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-10 py-4 text-xl font-semibold rounded text-gray-900 hover:text-gray-700 transition duration-200 border border-gray-900 hover:border-gray-700"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 3: Main Challenges */}
          {step === 3 && (
            <>
              <h1 className="text-gray-900 font-bold text-4xl mb-8 text-center">
                What are the main challenges you are facing?
              </h1>

              {/* Challenges Checkboxes */}
              {[
                "Work or academic stress",
                "Relationship issues",
                "Anxiety or panic attacks",
                "Depression or low mood",
                "Trauma or past experiences",
                "Self-esteem and confidence",
                "Life transitions",
              ].map((challenge) => (
                <label
                  key={challenge}
                  className="flex items-center mb-3 text-xl"
                >
                  <input
                    type="checkbox"
                    name="challenges"
                    value={challenge}
                    onChange={handleCheckboxChange}
                    className="mr-3 w-6 h-6"
                  />
                  {challenge}
                </label>
              ))}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-10 py-4 text-xl font-semibold rounded text-gray-900 hover:text-gray-700 transition duration-200 border border-gray-900 hover:border-gray-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-10 py-4 text-xl font-semibold rounded text-gray-900 hover:text-gray-700 transition duration-200 border border-gray-900 hover:border-gray-700"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 4: Distressing Thoughts */}
          {step === 4 && (
            <>
              <h1 className="text-gray-900 font-bold text-4xl mb-14 text-center">
                How often do you experience distressing thoughts or emotions?
              </h1>

              {/* Distressing Thoughts Radio Buttons */}
              {[
                "Rarely",
                "Occasionally",
                "Frequently",
                "Almost all the time",
              ].map((frequency) => (
                <label
                  key={frequency}
                  className="flex items-center mb-3 text-xl"
                >
                  <input
                    type="radio"
                    name="distressingThoughts"
                    value={frequency}
                    onChange={handleChange}
                    className="mr-3 w-6 h-6"
                    required
                  />
                  {frequency}
                </label>
              ))}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="mt-8 px-10 py-4 text-xl font-semibold rounded text-gray-900 hover:text-gray-700 transition duration-200 border border-gray-900 hover:border-gray-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="mt-8 px-10 py-4 text-xl font-semibold rounded text-gray-900 hover:text-gray-700 transition duration-200 border border-gray-900 hover:border-gray-700"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 5: Therapy Goals */}
          {step === 5 && (
            <>
              <h1 className="text-gray-900 font-bold text-4xl mb-8 text-center">
                What are you hoping to achieve through therapy?
              </h1>

              {/* Therapy Goals Checkboxes */}
              {[
                "Managing stress and anxiety",
                "Improving relationships",
                "Healing from past trauma",
                "Building self-confidence",
                "Finding purpose and direction",
                "Coping with depression",
              ].map((goal) => (
                <label key={goal} className="flex items-center mb-3 text-xl">
                  <input
                    type="checkbox"
                    name="therapyGoals"
                    value={goal}
                    onChange={handleCheckboxChange}
                    className="mr-3 w-6 h-6"
                  />
                  {goal}
                </label>
              ))}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-10 py-4 text-xl font-semibold rounded text-gray-900 hover:text-gray-700 transition duration-200 border border-gray-900 hover:border-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-10 py-4 text-xl font-semibold rounded text-gray-900 hover:text-gray-700 transition duration-200 border border-gray-900 hover:border-gray-700"
                >
                  Register
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
