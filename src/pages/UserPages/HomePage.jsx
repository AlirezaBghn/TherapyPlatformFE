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
    setTimeout(() => {
      const randomQuote =
        motivationalQuotes[
          Math.floor(Math.random() * motivationalQuotes.length)
        ];
      setCurrentQuote(randomQuote);
      setQuoteLoading(false); // Stop loading after quote is set
    }, 1000); // Simulate a delay for loading
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
      <section className="py-16 px-6 md:px-12 bg-gray-400 dark:bg-gray-800 shadow-xl">
        <div className="max-w-3xl mx-auto text-center">
          {/* Motivational Quote Skeleton */}
          {quoteLoading ? (
            <Skeleton height="40px" width="80%" className="mx-auto mb-6" />
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white dark:text-white">
              {currentQuote}
            </h1>
          )}
          <p className="mb-8 text-lg text-white dark:text-gray-300">
            How are you feeling today? Choose your mood below:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
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
                className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedMood === mood
                    ? "bg-white text-black border-white shadow-lg"
                    : "bg-transparent text-white border-white hover:bg-white hover:text-black shadow-md hover:shadow-lg"
                } transform hover:scale-105`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
          {/* Mood Activity Skeleton */}
          {moodActivityLoading ? (
            <div className="mt-8 p-6 bg-white dark:bg-gray-700 rounded-lg animate-fadeIn shadow-2xl">
              <Skeleton height="24px" width="60%" className="mb-4" />
              <Skeleton height="16px" width="80%" className="mb-2" />
              <Skeleton height="16px" width="70%" className="mb-4" />
              <Skeleton height="200px" width="100%" />
            </div>
          ) : moodActivity ? (
            <div className="mt-8 p-6 bg-white dark:bg-gray-700 rounded-lg animate-fadeIn shadow-2xl">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Recommended Activity
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {moodActivity.activity}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {moodActivity.explanation}
              </p>
              {moodActivity.imageUrl && (
                <img
                  src={moodActivity.imageUrl}
                  alt="Uplifting Visual"
                  className="mt-4 mx-auto rounded-lg shadow-lg"
                />
              )}
            </div>
          ) : null}
        </div>
      </section>

      {/* Quick Guide Section */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How things work on Therapy AI:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaPencilAlt size={40} />,
                title: "Create a Journal",
                description:
                  "Click the New Journal button to record your feelings and track your progress.",
              },
              {
                icon: <FaLightbulb size={40} />,
                title: "Tips & Advice",
                description:
                  "Our AI analyzes your data to provide personalized tips and advice.",
              },
              {
                icon: <FaUserMd size={40} />,
                title: "Find a Therapist",
                description:
                  "Get matched with a therapist who best suits your needs based on your data.",
              },
            ].map(({ icon, title, description }, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:scale-105"
              >
                <div className="mb-4 text-gray-900 dark:text-white">{icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-center text-gray-700 dark:text-gray-300">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Buttons Section */}
      <section className="py-12 px-6 md:px-12 bg-gray-50 dark:bg-gray-800 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-around md:justify-center md:gap-10">
            {[
              {
                to: "/add-journal",
                icon: <FaPlusCircle size={28} />,
                label: "Write Journal",
              },
              {
                to: "/find-therapist",
                icon: <FaSearch size={28} />,
                label: "Find Therapist",
              },
              { to: "/tips", icon: <FaLightbulb size={28} />, label: "Advise" },
            ].map(({ to, icon, label }, index) => (
              <Link
                key={index}
                to={to}
                className="flex flex-col items-center p-4  bg-gray-400  dark:bg-gray-700 text-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              >
                {icon}
                <span className="font-semibold mt-2">{label}</span>
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
                  className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:scale-105 bg-white dark:bg-gray-700"
                >
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {article.snippet}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    {article.explanation}
                  </p>
                  {article.learnMore && (
                    <a
                      href={article.learnMore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400"
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
      <section className="py-16 px-6 md:px-12 bg-gray-50 dark:bg-gray-800 shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
            Recommended Video
          </h2>
          {videoLoading ? (
            <Skeleton height="300px" />
          ) : videoError ? (
            <p className="text-red-500">{videoError}</p>
          ) : videoData.videoUrl ? (
            <div className="w-full aspect-video mx-auto">
              <iframe
                src={videoData.videoUrl}
                title="Recommended Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-2xl"
              ></iframe>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                {videoData.explanation}
              </p>
            </div>
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
