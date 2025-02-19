import { Link } from "react-router-dom";
import { useEffect } from "react";

const LandingPage = () => {
  // Custom smooth scroll function (2 sec duration)
  const scrollToLearnMore = (e) => {
    e.preventDefault();
    const target = document.getElementById("learn-more");
    if (!target) return;
    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let startTime = null;

    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };
    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white text-gray-900 h-screen flex items-center justify-center">
        <div className="container flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-12">
          {/* Text Section */}
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
                className="px-8 py-3 text-lg font-semibold rounded border border-gray-900 text-gray-900 hover:text-gray-700 hover:border-gray-700 transition duration-200"
              >
                Let's Start
              </Link>
              <button
                onClick={scrollToLearnMore}
                className="px-8 py-3 text-lg font-semibold rounded bg-gray-900 text-white hover:bg-gray-700 transition duration-200"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex items-center justify-center h-full w-full lg:w-1/2">
            <img
              src="https://i.pinimg.com/736x/36/7e/d0/367ed0c12a3baf81a146785d2f181de3.jpg"
              alt="Therapy Illustration"
              className="object-contain max-h-[70vh] w-auto"
            />
          </div>
        </div>
      </section>

      {/* Learn More Section */}
      <section id="learn-more" className="relative bg-gray-100 py-16">
        {/* Slanted Divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none"></div>
        <div className="container mx-auto px-6 lg:px-12 relative">
          <h2 className="text-3xl font-bold text-center mb-4">
            Find the Right Therapist for You
          </h2>
          <p className="text-center text-xl mb-8">
            Your Journey to Mental Wellness Starts Here
          </p>
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Why Choose Us?</h3>
              <p className="text-lg text-gray-700">
                We understand that seeking therapy is a big step, and finding
                the right therapist can be overwhelming. Our platform makes it
                easy to connect with licensed professionals who are tailored to
                your unique needs. Whether you're dealing with stress, anxiety,
                depression, or simply looking for personal growth, we’re here to
                help.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">How It Works</h3>
              <p className="text-lg text-gray-700">
                Tell Us About Yourself – Answer a few simple questions about
                your emotional well-being and therapy preferences. Get Matched –
                Our smart matching system connects you with a therapist suited
                to your needs. Start Your Sessions – Book online or in-person
                therapy sessions at a time that works for you.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">What We Offer</h3>
              <p className="text-lg text-gray-700">
                Personalized Therapy Matching – We match you with therapists
                based on your concerns and preferences. Online & In-Person
                Sessions – Flexible options to fit your schedule. Confidential &
                Secure – Your privacy and well-being are our top priorities.
                Expert Therapists – Work with licensed professionals
                specializing in anxiety, depression, relationships, and more.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Who Is Therapy For?
              </h3>
              <p className="text-lg text-gray-700">
                Therapy is for everyone. Whether you’re feeling overwhelmed,
                struggling with life transitions, or just need someone to talk
                to, our platform connects you with experienced therapists who
                can guide you through it.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Start Your Healing Journey Today
              </h3>
              <p className="text-lg text-gray-700">
                Ready to take the first step? Find your therapist in just a few
                minutes.{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 font-bold hover:underline"
                >
                  Sign up now!
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
