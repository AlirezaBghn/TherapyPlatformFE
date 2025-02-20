import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";

const TherapistProfile = () => {
  const { id } = useParams();

  const doctors = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Dr. ${
      [
        "Smith",
        "Johnson",
        "Brown",
        "Davis",
        "Miller",
        "Wilson",
        "Moore",
        "Taylor",
        "Anderson",
        "Thomas",
        "Jackson",
        "White",
        "Harris",
        "Martin",
        "Thompson",
        "Garcia",
        "Martinez",
        "Robinson",
        "Clark",
        "Rodriguez",
      ][i % 20]
    }`,
    specialization: ["Psychologist", "Therapist", "Mental Health Expert"][
      i % 3
    ],
    experience: `${5 + (i % 10)}+ years experience`,
    image: `https://i.pravatar.cc/300?img=${i + 10}`,
    details: "Experienced therapist with a compassionate approach.",
    specialties: ["Anxiety", "Depression"],
    education: "PhD in Clinical Psychology",
    approach: "Cognitive Behavioral Therapy (CBT)",
    languages: ["English", "Spanish"],
  }));

  const therapist = doctors.find((doc) => doc.id === parseInt(id));

  if (!therapist) {
    return <Layout>Doctor not found</Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-8">
          <Link
            to="/therapist-dashboard"
            className="mr-4 px-4 py-2 bg-white/10 dark:bg-black/10 border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition duration-300"
          >
            ← Back
          </Link>
          <h2 className="text-3xl font-bold text-black dark:text-white">
            Therapist Profile
          </h2>
        </div>

        {/* Card Container uses #f3f4f6 in light mode */}
        <div className="bg-[#f3f4f6] dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <img
                src={therapist.image}
                alt={therapist.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
              />
              <div className="space-y-4 flex-1">
                <h1 className="text-3xl font-bold text-black dark:text-white">
                  {therapist.name}
                </h1>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                    <span className="text-blue-600 dark:text-blue-400">
                      {therapist.specialization}
                    </span>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/20 px-4 py-2 rounded-full">
                    <span className="text-green-600 dark:text-green-400">
                      {therapist.experience}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Specialties
                    </h3>
                    <p className="text-black dark:text-gray-200">
                      {therapist.specialties.join(", ")}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Education
                    </h3>
                    <p className="text-black dark:text-gray-200">
                      {therapist.education}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Therapeutic Approach
                    </h3>
                    <p className="text-black dark:text-gray-200">
                      {therapist.approach}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Languages
                    </h3>
                    <p className="text-black dark:text-gray-200">
                      {therapist.languages.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                      About Me
                    </h3>
                    <p className="text-black dark:text-gray-300">
                      {therapist.details}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                      Send Message
                    </h3>
                    <textarea
                      placeholder="Write your message..."
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
                      rows="4"
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TherapistProfile;
