const GetTipsAndAdvice = () => {
  const tips = [
    { id: 1, tip: "Remember to take deep breaths.", status: "Success" },
    { id: 2, tip: "Stay positive and keep moving forward.", status: "Neutral" },
  ];

  return (
    <div className="container mx-auto p-6 pt-24">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Daily Tips and Advice
        </h2>
      </div>

      <div className="space-y-4 mb-8">
        {tips.map((item) => (
          <div
            key={item.id}
            className="bg-[#f3f4f6] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-4 rounded flex justify-between items-center shadow-sm hover:shadow-md transition duration-300"
          >
            <p className="text-black dark:text-white">{item.tip}</p>
            <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300">
              {item.status}
            </button>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
          Personalized Advice
        </h3>
        <textarea
          placeholder="Type your question or area you'd like advice on..."
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          rows="4"
        ></textarea>
        <button className="px-6 py-2 text-lg font-semibold rounded border border-white-900 text-gray-900 dark:text-white hover:text-gray-700 hover:border-gray-700 transition duration-200 mt-2">
          Submit
        </button>
      </div>
    </div>
  );
};

export default GetTipsAndAdvice;
