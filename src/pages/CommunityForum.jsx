import { Link } from "react-router-dom";
import Layout from "../components/Layout";

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
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Community Forum
          </h2>
        </div>
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-300 dark:border-gray-700 p-4 rounded bg-[#f3f4f6] dark:bg-black text-black dark:text-white"
            >
              <h3 className="text-xl font-bold">{post.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                by {post.author}
              </p>
              <p className="mt-2">{post.content}</p>
              <div className="mt-2">
                <button className="text-blue-500 hover:underline">Reply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CommunityForum;
