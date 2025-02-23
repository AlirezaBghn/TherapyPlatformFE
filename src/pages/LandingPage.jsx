import { Link } from "react-router-dom";
import AnimatedSection from "../components/AnimatedSection";

const contentSections = [
  {
    header: "Why Choose Us?",
    text: "We understand that seeking therapy is a big step, and finding the right therapist can be overwhelming. Our platform makes it easy to connect with licensed professionals who are tailored to your unique needs. Whether you're dealing with stress, anxiety, depression, or simply looking for personal growth, we’re here to help.",
  },
  {
    header: "How It Works",
    text: "Tell us about yourself – answer a few simple questions about your emotional well-being and therapy preferences. Get matched with a therapist who truly understands your needs. Start your sessions at a time that works for you, be it online or in-person.",
  },
  {
    header: "What We Offer",
    text: "Experience personalized therapy matching that considers your unique concerns and preferences. Enjoy flexible online and in-person sessions, all while knowing your privacy is our top priority. Work with expert therapists specializing in anxiety, depression, relationships, and more.",
  },
  {
    header: "Who Is Therapy For?",
    text: "Therapy is for everyone – whether you’re feeling overwhelmed, navigating life transitions, or simply in need of a supportive conversation, our platform connects you with experienced therapists ready to guide you.",
  },
  {
    header: "Start Your Healing Journey Today",
    text: (
      <>
        <span>
          Ready to take the first step? Imagine a path to wellness just waiting
          to be discovered. In just a few minutes, you could be on your way to
          finding the perfect therapist.
        </span>{" "}
        <Link
          to="/signup"
          className="text-blue-600 font-bold text-sm hover:underline"
        >
          Sign up now
        </Link>{" "}
        <span>and begin your journey toward a brighter tomorrow.</span>
      </>
    ),
  },
];

const LandingPage = () => {
  const scrollToLearnMore = (e) => {
    e.preventDefault();
    const target = document.getElementById("learn-more");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white text-gray-900 h-screen flex items-center justify-center">
        <AnimatedSection
          direction="left"
          className="container flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-12"
        >
          <div className="flex flex-col justify-center text-center lg:text-left lg:max-w-lg">
            <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
              Your Journey to{" "}
              <span className="text-gray-900">Better Mental Health</span>
            </h1>
            <p className="mt-6 mb-8 text-lg text-gray-700">
              Finding the right therapist has never been easier. Our platform
              connects you with licensed professionals who understand your
              unique challenges.
            </p>
            <div className="flex flex-col sm:flex-row sm:space-x-4 items-center lg:justify-start">
              <Link
                to="/signin"
                className="px-8 py-3 text-lg font-semibold rounded border border-gray-900 text-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-300"
              >
                Patients
              </Link>
              <button
                onClick={scrollToLearnMore}
                className="px-8 py-3 text-lg font-semibold rounded bg-gray-900 text-white hover:bg-gray-700 transition duration-300"
              >
                Learn More
              </button>
              {/* Therapist Side Button */}
              <Link
                to="/therapist-signin"
                className="mt-4 sm:mt-0 px-8 py-3 text-lg font-semibold rounded bg-green-500 text-white hover:bg-blue-500 transition duration-300"
              >
                Therapists
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center h-full w-full lg:w-1/2">
            <img
              src="https://i.pinimg.com/736x/36/7e/d0/367ed0c12a3baf81a146785d2f181de3.jpg"
              alt="Therapy Illustration"
              className="object-contain max-h-[70vh] w-auto"
            />
          </div>
        </AnimatedSection>
      </section>

      {/* Learn More Section */}
      <section id="learn-more" className="bg-gray-100 text-gray-900 py-16">
        <div className="container mx-auto px-6 lg:px-12 space-y-12">
          <AnimatedSection direction="left">
            <h2 className="text-3xl font-bold mb-4">
              Find the Right Therapist for You
            </h2>
            <p className="text-xl mb-8">
              Your Journey to Mental Wellness Starts Here
            </p>
          </AnimatedSection>

          {contentSections.map((section, index) => {
            const direction = index % 2 === 0 ? "left" : "right";
            return (
              <AnimatedSection key={index} direction={direction}>
                <div className="max-w-4xl mx-auto text-left">
                  <h3 className="text-2xl font-semibold mb-4">
                    {section.header}
                  </h3>
                  {typeof section.text === "string" ? (
                    <p className="text-lg text-gray-700 mb-4">{section.text}</p>
                  ) : (
                    <p className="text-lg text-gray-700 mb-4">{section.text}</p>
                  )}
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default LandingPage;
