import { Link } from "react-router-dom";

const CommunityForum = () => {
  const posts = [
    {
      id: 1,
      title: "Coping with Anxiety",
      author: "Alice",
      content: "I've been struggling with anxiety lately. Any tips?",
    },
    {
      id: 2,
      title: "Meditation Techniques",
      author: "Bob",
      content: "I found these meditation techniques very helpful.",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12 mt-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Community Forum
        </h2>
      </div>
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border border-gray-300 dark:border-gray-700 p-6 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg transition duration-300 hover:shadow-xl"
          >
            <h3 className="text-xl font-bold">{post.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              by {post.author}
            </p>
            <p className="mt-4">{post.content}</p>
            <div className="mt-4">
              <button className="text-blue-500 hover:underline transition">
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityForum;
