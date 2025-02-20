import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const FindATherapist = () => {
  const [visibleDoctors, setVisibleDoctors] = useState(8);
  const [filters, setFilters] = useState({
    specialization: "",
    experience: "",
  });

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
    image: `https://i.pravatar.cc/100?img=${i + 10}`,
    details: "Experienced therapist with a compassionate approach.",
    specialties: ["Anxiety", "Depression"],
  }));

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialization =
      !filters.specialization ||
      doctor.specialization === filters.specialization;
    const matchesExperience =
      !filters.experience || doctor.experience === filters.experience;
    return matchesSpecialization && matchesExperience;
  });

  const handleReadMore = () => setVisibleDoctors((prev) => prev + 8);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <Layout>
      {/* Header and Filters */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">Find a Therapist</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              name="specialization"
              value={filters.specialization}
              onChange={handleFilterChange}
              className="p-3 border text-black border-gray-300 rounded-lg bg-white shadow-sm"
            >
              <option value="">All Specializations</option>
              <option value="Psychologist">Psychologist</option>
              <option value="Therapist">Therapist</option>
              <option value="Mental Health Expert">Mental Health Expert</option>
            </select>
            <select
              name="experience"
              value={filters.experience}
              onChange={handleFilterChange}
              className="p-3 border text-black border-gray-300 rounded-lg bg-white shadow-sm"
            >
              <option value="">All Experience Levels</option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={`${5 + i}+ years experience`}>
                  {5 + i}+ years
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDoctors.slice(0, visibleDoctors).map((doctor) => (
            <Link
              to={`/therapist/${doctor.id}`}
              key={doctor.id}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center transform transition duration-300 hover:scale-105"
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 rounded-full object-cover shadow-md"
              />
              <h3 className="text-xl font-bold mt-4 text-black">
                {doctor.name}
              </h3>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="text-gray-500">{doctor.experience}</p>
            </Link>
          ))}
        </div>

        {/* "Read More" Button */}
        {visibleDoctors < filteredDoctors.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleReadMore}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              Read More
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FindATherapist;
