// // components/MouseGlow.jsx
// import { useEffect } from "react";

// const MouseGlow = () => {
//   useEffect(() => {
//     const glow = document.getElementById("mouse-glow");

//     const move = (e) => {
//       glow.style.left = `${e.clientX}px`;
//       glow.style.top = `${e.clientY}px`;
//     };

//     window.addEventListener("mousemove", move);
//     return () => window.removeEventListener("mousemove", move);
//   }, []);

//   return (
//     <div
//       id="mouse-glow"
//       className="pointer-events-none fixed top-0 left-0 w-96 h-96 rounded-full 
//                  bg-indigo-500/20 blur-3xl -translate-x-1/2 -translate-y-1/2 z-0"
//     />
//   );
// };

// export default MouseGlow;


import { useEffect } from "react";

const MouseGlow = () => {
  useEffect(() => {
    const trailContainer = document.getElementById("trail-container");

    const createTrail = (e) => {
      const trail = document.createElement("span");

      trail.className =
        "pointer-events-none fixed w-8 h-8 rounded-full bg-gradient-to-r from-indigo-950/20 via-indigo-900/50 to-transparent blur-lg animate-trail";

      trail.style.left = `${e.clientX - 20}px`;
      trail.style.top = `${e.clientY - 20}px`;

      trailContainer.appendChild(trail);

      setTimeout(() => {
        trail.remove();
      }, 1000);
    };

    window.addEventListener("mousemove", createTrail);
    return () => window.removeEventListener("mousemove", createTrail);
  }, []);

  return <div id="trail-container" className="fixed inset-0 z-0" />;
};

export default MouseGlow;
