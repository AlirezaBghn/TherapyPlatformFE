import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  FaExclamationTriangle,
  FaBolt,
  FaFrown,
  FaSmile,
  FaPencilAlt,
  FaLightbulb,
  FaUserMd,
  FaPlusCircle,
  FaSearch,
} from "react-icons/fa";

// Skeleton component for loading states
const Skeleton = ({ height = "100px", width = "100%" }) => (
  <div
    className="bg-gray-300 dark:bg-gray-600 animate-pulse rounded-lg"
    style={{ height, width }}
  ></div>
);

const motivationalQuotes = [
  "Nothing lasts forever – even the worst moments pass.",
  "Today is a new beginning; just take one step forward.",
  "Every challenge is an opportunity in disguise.",
  "Keep going, you’re stronger than you think!",
];

const HomePage = () => {
  const { user } = useAuth();

  // States for Mood Activity section
  const [currentQuote, setCurrentQuote] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodActivity, setMoodActivity] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(true); // Loading state for motivational quote
  const [moodActivityLoading, setMoodActivityLoading] = useState(false); // Loading state for mood activity

  // State for Daily Article Recommendation section
  const [dailyArticle, setDailyArticle] = useState(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleError, setArticleError] = useState("");

  // State for Video Recommendation section
  const [videoData, setVideoData] = useState({ videoUrl: "", explanation: "" });
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState("");

  // On mount, select a random motivational quote
  useEffect(() => {
    setQuoteLoading(true); // Start loading
    const randomQuote =
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
    setQuoteLoading(false); // Stop loading after quote is set
  }, []);

  // Handle mood selection and call the mood activity endpoint
  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setMoodActivity(null); // reset previous activity
    setMoodActivityLoading(true); // Start loading

    if (!user?._id) {
      console.error("User not found in context");
      setMoodActivityLoading(false); // Stop loading
      return;
    }

    try {
      const res = await axiosClient.post(`/mood-activity/${user._id}`, {
        mood,
      });
      setMoodActivity(res.data);
      localStorage.setItem("moodActivity", JSON.stringify(res.data));
    } catch (error) {
      console.error("Error fetching mood activity recommendation:", error);
    } finally {
      setMoodActivityLoading(false); // Stop loading
    }
  };

  // Fetch daily article recommendation
  useEffect(() => {
    const fetchDailyArticle = async () => {
      if (!user?._id) return;

      // Check if articles are already stored in localStorage
      const storedArticles = localStorage.getItem("dailyArticle");
      const storedTimestamp = localStorage.getItem("dailyArticleTimestamp");

      // If articles are stored and less than 24 hours old, use them
      if (storedArticles && storedTimestamp) {
        const ageInHours =
          (Date.now() - parseInt(storedTimestamp)) / (1000 * 60 * 60);
        if (ageInHours < 24) {
          setDailyArticle(JSON.parse(storedArticles));
          return;
        }
      }

      // Otherwise, fetch new articles
      setArticleLoading(true);
      try {
        const res = await axiosClient.get(`/daily-article/${user._id}`);
        setDailyArticle(res.data);
        localStorage.setItem("dailyArticle", JSON.stringify(res.data));
        localStorage.setItem("dailyArticleTimestamp", Date.now().toString());
      } catch (error) {
        console.error("Error fetching daily article recommendation:", error);
        setArticleError("Failed to load daily article recommendation");
      } finally {
        setArticleLoading(false);
      }
    };
    fetchDailyArticle();
  }, [user]);

  // Fetch video recommendation
  useEffect(() => {
    const fetchVideoRecommendation = async () => {
      if (!user?._id) return;

      // Check if video is already stored in localStorage
      const storedVideo = localStorage.getItem("recommendedVideo");
      const storedTimestamp = localStorage.getItem("recommendedVideoTimestamp");

      // If video is stored and less than 24 hours old, use it
      if (storedVideo && storedTimestamp) {
        const ageInHours =
          (Date.now() - parseInt(storedTimestamp)) / (1000 * 60 * 60);
        if (ageInHours < 24) {
          setVideoData(JSON.parse(storedVideo));
          return;
        }
      }

      // Otherwise, fetch new video
      setVideoLoading(true);
      try {
        const res = await axiosClient.get(`/video-recommendation/${user._id}`);
        setVideoData(res.data);
        localStorage.setItem("recommendedVideo", JSON.stringify(res.data));
        localStorage.setItem(
          "recommendedVideoTimestamp",
          Date.now().toString()
        );
      } catch (error) {
        console.error("Error fetching video recommendation:", error);
        setVideoError("Failed to load video recommendation");
      } finally {
        setVideoLoading(false);
      }
    };
    fetchVideoRecommendation();
  }, [user]);

  return (
    <div className="mt-20 min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Top Section: Motivational Quote and Mood Selection */}
      <section className="py-20 px-8 md:px-16 bg-white dark:bg-gray-900 shadow-2xl rounded-3xl">
        <div className="max-w-3xl mx-auto text-center">
          {/* Motivational Quote Skeleton */}
          {quoteLoading ? (
            <Skeleton height="48px" width="80%" className="mx-auto mb-8" />
          ) : (
            <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-900 dark:text-white drop-shadow">
              {currentQuote}
            </h1>
          )}
          <p className="mb-10 text-xl text-gray-800 dark:text-gray-300">
            How are you feeling today? Choose your mood below:
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              {
                mood: "stressed",
                icon: <FaExclamationTriangle size={20} />,
                label: "Stressed",
              },
              {
                mood: "energetic",
                icon: <FaBolt size={20} />,
                label: "Energetic",
              },
              { mood: "sad", icon: <FaFrown size={20} />, label: "Sad" },
              { mood: "calm", icon: <FaSmile size={20} />, label: "Calm" },
            ].map(({ mood, icon, label }) => (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                  selectedMood === mood
                    ? "bg-white text-gray-900 border-gray-900 shadow-lg dark:bg-white dark:text-gray-900 dark:border-white"
                    : "bg-transparent text-gray-900 border-gray-900 hover:bg-white hover:text-gray-900 shadow-md hover:shadow-xl dark:text-white dark:border-white"
                } transform hover:scale-105`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
          {/* Mood Activity Skeleton */}
          {moodActivityLoading ? (
            <div className="mt-10 p-8 bg-white dark:bg-gray-700 rounded-2xl animate-fadeIn shadow-2xl">
              <Skeleton height="28px" width="60%" className="mb-6" />
              <Skeleton height="20px" width="80%" className="mb-4" />
              <Skeleton height="20px" width="70%" className="mb-6" />
              <Skeleton height="220px" width="100%" />
            </div>
          ) : moodActivity ? (
            <div className="mt-10 p-8 bg-white dark:bg-gray-700 rounded-2xl animate-fadeIn shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2">
                Recommended Activity
              </h3>
              <p className="text-lg text-gray-800 dark:text-gray-300">
                {moodActivity.activity}
              </p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
                {moodActivity.explanation}
              </p>
              {moodActivity.imageUrl && (
                <img
                  src={moodActivity.imageUrl}
                  alt="Uplifting Visual"
                  className="mt-6 mx-auto rounded-xl shadow-xl"
                />
              )}
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How things work on Therapy AI:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                to: "/add-journal",
                icon: <FaPencilAlt size={40} />,
                hoverIcon: <FaPlusCircle size={40} />,
                title: "Create a Journal",
                description:
                  "Click the New Journal button to record your feelings and track your progress.",
              },
              {
                to: "/tips",
                icon: <FaLightbulb size={40} />,
                hoverIcon: <FaBolt size={40} />,
                title: "Tips & Advice",
                description:
                  "Our AI analyzes your data to provide personalized tips and advice.",
              },
              {
                to: "/find-therapist",
                icon: <FaUserMd size={40} />,
                hoverIcon: <FaSearch size={40} />,
                title: "Find a Therapist",
                description:
                  "Get matched with a therapist who best suits your needs based on your data.",
              },
            ].map(({ to, icon, hoverIcon, title, description }, index) => (
              <Link
                key={index}
                to={to}
                className="relative group flex flex-col items-center p-8 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-200 transform hover:-translate-y-1 bg-white dark:bg-gray-900"
              >
                <div className="mb-4 w-16 h-16 flex items-center justify-center relative">
                  <div className="absolute transition-opacity duration-300 group-hover:opacity-0">
                    {icon}
                  </div>
                  <div className="absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {hoverIcon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
                  {title}
                </h3>
                <div className="w-52 border-b-2 border-gray-300 dark:border-gray-600 mb-3"></div>
                <p className="text-center text-gray-700 dark:text-gray-300 text-sm">
                  {description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Article Recommendation Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-50 dark:bg-gray-800 shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
            Daily Article Recommendations
          </h2>
          {articleLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                >
                  <Skeleton height="24px" width="80%" className="mb-4" />
                  <Skeleton height="16px" width="100%" className="mb-2" />
                  <Skeleton height="16px" width="90%" className="mb-2" />
                  <Skeleton height="16px" width="70%" className="mb-4" />
                  <Skeleton height="16px" width="50%" />
                </div>
              ))}
            </div>
          ) : articleError ? (
            <p className="text-red-500">{articleError}</p>
          ) : dailyArticle && dailyArticle.articles ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyArticle.articles.map((article, index) => (
                <div
                  key={index}
                  className="flex flex-col h-full p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:scale-105 bg-white dark:bg-gray-700"
                >
                  <div className="flex-1">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {article.snippet}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      {article.explanation}
                    </p>
                  </div>
                  {article.learnMore && (
                    <a
                      href={article.learnMore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-auto pt-4 border-t border-gray-300 dark:border-gray-600 text-base font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Learn More
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">
              No article recommendations available at the moment.
            </p>
          )}
        </div>
      </section>

      {/* Video Recommendation Section */}
      <section className="py-20 px-8 md:px-16 bg-gray-50 dark:bg-gray-800 shadow-2xl rounded-3xl">
        <div className="max-w-3xl mx-auto text-center ">
          <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white pb-2 border-b-2 border-gray-300 dark:border-gray-600">
            Recommended Video
          </h2>
          {videoLoading ? (
            <Skeleton height="300px" />
          ) : videoError ? (
            <p className="text-red-500">{videoError}</p>
          ) : videoData.videoUrl ? (
            <>
              <div className="relative w-full aspect-video mx-auto rounded-3xl overflow-hidden shadow-2xl transition-transform transform hover:scale-105">
                <iframe
                  src={videoData.videoUrl}
                  title="Recommended Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <p className="mt-6 text-lg italic text-gray-700 dark:text-gray-300 border-l-4 border-gray-300 dark:border-gray-600 pl-4">
                {videoData.explanation}
              </p>
            </>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">
              No video recommendation available at the moment.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
