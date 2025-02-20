import Layout from "../components/Layout";

const Chat = () => {
  const messages = [
    { id: 1, sender: "therapist", content: "Hello, how can I help you today?" },
    { id: 2, sender: "user", content: "I'm feeling a bit overwhelmed." },
  ];

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto border border-gray-300 dark:border-gray-700 p-4 rounded bg-[#f3f4f6] dark:bg-black text-black dark:text-white mb-4">
          <h2 className="text-2xl font-bold mb-2">Chat with Therapist</h2>
          <div className="max-h-64 overflow-y-auto mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <p className="inline-block p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
          <div>
            <textarea
              placeholder="Type your message..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
              rows="3"
            ></textarea>
            <div className="flex justify-between items-center mt-2">
              <input type="file" className="text-sm" />
              <button className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-300">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
