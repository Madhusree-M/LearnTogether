import { useEffect, useRef, useState } from "react";

const Reveal = ({
  children,
  delay = 0,
  direction = "up"
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  const getTransform = () => {
    switch (direction) {
      case "left":
        return "-translate-x-24";
      case "right":
        return "translate-x-24";
      case "down":
        return "translate-y-24";
      default:
        return "translate-y-24";
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -100px 0px"
      }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`
        transition-all duration-700 ease-out
        ${visible
          ? "opacity-100 translate-x-0 translate-y-0 scale-100 blur-0"
          : `opacity-0 scale-80  ${getTransform()}`}
      `}
    >
      {children}
    </div>
  );
};

export default Reveal;
