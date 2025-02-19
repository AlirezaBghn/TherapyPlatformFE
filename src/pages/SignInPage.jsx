import { Link } from "react-router-dom";

const SignInPage = () => {
  return (
    <div className="h-screen md:flex">
      {/* Left Section with Image Background */}
      <div
        className="relative overflow-hidden md:flex w-1/2 justify-around items-center hidden"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/melancholic-black-white-shot-forest_181624-1380.jpg?t=st=1739963557~exp=1739967157~hmac=4e10dc2b670400cbaf78dfa12b4a8662e88a7cc0448fc82fc82a31160f732655&w=1380')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for Transparency */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative text-center text-white z-10 px-10 mt-[-290px] max-w-[85%]">
          <h1 className="font-bold text-5xl mb-4">Welcome Back</h1>
          <p className="text-xl font-light">
            Reconnect with expert therapists and continue your journey toward
            mental well-being.
          </p>
          <p className="text-xl font-light mt-2">
            Sign in now and take the next step toward a healthier, happier you.
          </p>
        </div>
      </div>

      {/* Right Section with Form */}
      <div className="flex md:w-1/2 justify-center items-center bg-white">
        <form className="bg-white w-96 p-8 rounded-lg shadow-lg">
          <h1 className="text-gray-900 font-bold text-3xl mb-2 text-center">
            Welcome Back!
          </h1>
          <p className="text-md font-normal text-gray-600 mb-6 text-center">
            Sign in to continue
          </p>

          {/* Username Field */}
          <div className="flex items-center border-2 border-gray-300 py-3 px-4 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Username"
              className="pl-3 w-full outline-none border-none bg-white text-lg"
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center border-2 border-gray-300 py-3 px-4 rounded-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2-2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              placeholder="Password"
              className="pl-3 w-full outline-none border-none bg-white text-lg"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="block w-full border-2 border-black mt-6 py-3 rounded-2xl text-black font-semibold text-lg hover:bg-gray-100 transition"
          >
            Sign In
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-black font-bold hover:underline">
              Sign up now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
