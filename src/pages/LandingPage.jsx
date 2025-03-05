import { Link } from "react-router-dom";
import AnimatedSection from "../components/AnimatedSection";

const contentSections = [
  {
    header: "Why Choose Us?",
    text: "We understand that seeking therapy is a big step, and finding the right therapist can be overwhelming. Our platform makes it easy to connect with licensed professionals who are tailored to your unique needs. Whether you're dealing with stress, anxiety, depression, or simply looking for personal growth, we're here to help.",
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
    text: "Therapy is for everyone – whether you're feeling overwhelmed, navigating life transitions, or simply in need of a supportive conversation, our platform connects you with experienced therapists ready to guide you.",
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
          className="text-black font-bold hover:underline border-b-2 border-black hover:border-opacity-50 transition-all duration-300"
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
      <section className="bg-white text-black min-h-screen flex items-center justify-center py-12">
        <AnimatedSection
          direction="left"
          className="container flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-16 max-w-7xl mx-auto"
        >
          <div className="flex flex-col justify-center text-center lg:text-left lg:max-w-xl space-y-6 mt-8 lg:mt-0">
            <h1 className="text-5xl font-bold leading-none sm:text-6xl tracking-tight">
              Your Journey to{" "}
              <span className="text-black border-b-4 border-black pb-1">
                Better Mental Health
              </span>
            </h1>
            <p className="text-xl text-black leading-relaxed">
              Finding the right therapist has never been easier. Our platform
              connects you with licensed professionals who understand your
              unique challenges. Find Your Perfect Therapist with AI-Powered
              Matchmaking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center lg:justify-start pt-4">
              <Link
                to="/signin"
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-md bg-black text-white hover:bg-opacity-80 transition-all duration-300 hover:scale-105"
              >
                Get Matched Now
              </Link>
              <button
                onClick={scrollToLearnMore}
                className="w-full sm:w-auto px-8 py-3.5 text-lg font-semibold rounded-md border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 hover:scale-105"
              >
                Learn More
              </button>
            </div>
            {/* Therapist Side Button */}
            <div className="text-sm">
              Are you a licensed therapist passionate about making a difference?
              <br />
              Join our growing community of mental health professionals
              dedicated to providing support and care to those in need. Sign up
              today to connect with clients, expand your practice, and make a
              meaningful impact.{" "}
              <Link to="/therapist-signin" className="link italic">
                Sign up as a Therapist
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center h-full w-full lg:w-1/2 lg:pl-12">
            <img
              src="https://i.pinimg.com/736x/36/7e/d0/367ed0c12a3baf81a146785d2f181de3.jpg"
              alt="Therapy Illustration"
              className="object-contain max-h-[70vh] w-auto rounded-lg transform hover:scale-105 transition-transform duration-300 ml-40"
            />
          </div>
        </AnimatedSection>
      </section>

      {/* Learn More Section */}
      <section id="learn-more" className="bg-white text-black py-24">
        <div className="container mx-auto px-6 lg:px-16 space-y-16 max-w-7xl">
          <AnimatedSection direction="left">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 inline-block border-b-2 border-black pb-2">
                Find the Right Therapist for You
              </h2>
              <p className="text-2xl">
                Your Journey to Mental Wellness Starts Here
              </p>
            </div>
          </AnimatedSection>

          {contentSections.map((section, index) => {
            const direction = index % 2 === 0 ? "left" : "right";
            return (
              <AnimatedSection key={index} direction={direction}>
                <div className="max-w-4xl mx-auto px-6 py-8 bg-white rounded-lg border-2 border-black hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-5 pb-2 border-b-2 border-black">
                    {section.header}
                  </h3>
                  <div className="text-lg leading-relaxed">{section.text}</div>
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
