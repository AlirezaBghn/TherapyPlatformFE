import { useEffect, useRef, useState } from "react";

const AnimatedSection = ({ children, className = "", direction = "left" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update visibility continuously so the animation resets when scrolling out and in.
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  // Use a larger offset value for a more dramatic effect.
  const initialTranslate =
    direction === "left" ? "-translate-x-40" : "translate-x-40";

  return (
    <div
      ref={ref}
      style={{ transitionDuration: "1500ms" }}
      className={`${className} transform transition-all ${
        visible ? "opacity-100 translate-x-0" : `opacity-0 ${initialTranslate}`
      }`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
