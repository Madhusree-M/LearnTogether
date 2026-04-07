import { Link } from "react-router";
import Reveal from "../components/Reveal";
import { useEffect, useState } from "react";
import MouseGlow from "./MouseGlow";
import AuthPage from "./AuthPage";

const images = [
  "/bg1.jpg",
  "/bg2.jpg",
  "/bg3.jpg",
  "/bg4.jpg",
];

const HomePage = () => {

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000); // slide every 4s

    return () => clearInterval(interval);
  }, []);


  return (

    <div className="w-full bg-gray-50 overflow-hidden">
      <MouseGlow />
      <Reveal>
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 text-white overflow-hidden bg-white p-8 shadow-lg">

          {/* SLIDER IMAGES */}
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out
          ${index === current ? "opacity-100 scale-105" : "opacity-0 scale-100"}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}

          {/* DARK GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/15 to-black"></div>

          {/* GLOW EFFECT */}
          <div className="absolute inset-0 bg-indigo-400/10 blur-3xl"></div>

          {/* CONTENT */}
          <div className="relative z-10 w-full">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Learn Together
            </h1>

            <p className="mt-6 text-lg md:text-xl text-indigo-200 max-w-2xl mx-auto px-4">
              Ask doubts. Share knowledge. Grow as a community.
            </p>

            <div className="mt-10 flex flex-col md:flex-row gap-4 md:gap-6 justify-center w-full px-10 md:px-0">
              <Link to="/questions">
                <button className="w-full md:w-auto px-8 py-3 bg-white text-indigo-950 font-bold rounded-xl hover:scale-105 transition">
                  Explore
                </button>
              </Link>

              <Link to="/signup">
                <button className="w-full md:w-auto px-8 py-3 border-2 border-white rounded-xl font-bold hover:bg-white hover:text-indigo-950 transition">
                  Join Free
                </button>
              </Link>
            </div>
          </div>

          {/* SCROLL INDICATOR */}
          <div className="absolute bottom-10 z-10 animate-bounce text-indigo-300">
            ↓ Scroll
          </div>

        </section>
      </Reveal>
      {/* ================= WHY ================= */}
      <Reveal>
        <section className="py-10 md:py-20 px-4 md:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-950">
            Studying Alone is Hard.
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg">
            Unanswered doubts. Scattered notes. No proper guidance.
            We fix that.
          </p>
        </section>
      </Reveal>

      {/* ================= FEATURES ================= */}
      <section className="px-4 md:px-10 pb-12 md:pb-20">
        <div className="grid md:grid-cols-3 gap-10">

          {[
            {
              title: "Ask Questions",
              desc: "Post doubts and get clear answers from peers."
            },
            {
              title: "Share Materials",
              desc: "Upload PDFs, notes and useful resources."
            },
            {
              title: "Grow Together",
              desc: "Upvotes, discussions and leaderboard."
            }
          ].map((item, i) => (
            <Reveal key={i} delay={i * 150}>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition">
                <h3 className="text-2xl font-bold text-indigo-950">
                  {item.title}
                </h3>
                <p className="mt-4 text-gray-600">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}

        </div>
      </section>

      {/* ================= STATS ================= */}
      {/* <Reveal>
        <section className="py-24 bg-indigo-100 text-center">
          <div className="flex flex-wrap justify-center gap-16">
            <div>
              <h1 className="text-5xl font-extrabold text-indigo-950">1K+</h1>
              <p className="text-gray-600 mt-2">Questions</p>
            </div>
            <div>
              <h1 className="text-5xl font-extrabold text-indigo-950">500+</h1>
              <p className="text-gray-600 mt-2">Materials</p>
            </div>
            <div>
              <h1 className="text-5xl font-extrabold text-indigo-950">300+</h1>
              <p className="text-gray-600 mt-2">Students</p>
            </div>
          </div>
        </section>
      </Reveal> */}

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-12 md:py-20 px-4 md:px-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-950">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6 md:gap-10 mt-8 md:mt-12 text-center">
          {[1, 2, 3].map((num, i) => (
            <Reveal key={i} delay={i * 200}>
              <div className="border-[1px] border-indigo-950/20 bg-indigo-200/20 rounded-lg py-5 shadow-lg
                              hover:scale-111 duration-300">
                <h1 className="text-6xl font-extrabold text-indigo-950">
                  {num}
                </h1>
                <p className="mt-4 text-gray-700 text-lg ">
                  {num === 1 && "Create an account"}
                  {num === 2 && "Ask or share content"}
                  {num === 3 && "Learn & help others"}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <Reveal>
        <section className="py-15 text-center">
          <h2 className="text-5xl font-extrabold text-indigo-950">
            Start Learning Today
          </h2>
          <p className="mt-6 text-gray-600 text-lg">
            Be part of something bigger.
          </p>

          <Link to="/signup">
            <button className="mt-8 px-10 py-3 md:px-14 md:py-4 bg-indigo-950 text-white text-lg md:text-xl font-bold rounded-2xl hover:scale-105 transition shadow-xl hover:shadow-2xl">
              Join Now
            </button>
          </Link>
        </section>
      </Reveal>


      {/* ================= TESTIMONIALS ================= */}
      <Reveal>
        <section className="py-12 px-4 md:px-10 bg-gray-50 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-950">
            What Students Say
          </h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
            {[
              {
                name: "Madhu",
                text: "I finally got answers to doubts that stayed unanswered for weeks."
              },
              {
                name: "Sandy",
                text: "Sharing my notes here helped others and boosted my confidence."
              },
              {
                name: "Rahul",
                text: "This feels like studying with friends, not alone."
              }
            ].map((t, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                  <p className="text-gray-600 italic">“{t.text}”</p>
                  <h4 className="mt-4 font-bold text-indigo-950">— {t.name}</h4>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>


      {/* ================= CATEGORIES ================= */}
      <section className="py-12 md:py-20 px-4 md:px-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-950">
          Explore by Subjects
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12">
          {[
            "Programming",
            "Data Structures",
            "Databases",
            "Web Development",
            "AI & ML",
            "Electronics",
            "Aptitude",
            "Exam Prep"
          ].map((cat, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="bg-indigo-950 text-white py-6 md:py-10 rounded-xl md:rounded-2xl text-center font-bold hover:scale-105 transition cursor-pointer text-sm md:text-base">
                {cat}
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ================= VALUES ================= */}
      <Reveal>
        <section className="py-12 md:py-20 px-4 md:px-10 bg-indigo-950 text-indigo-100">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Why Learn Together?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-8 md:mt-12 text-center">
            <div>
              <h3 className="text-2xl font-bold">Collaborative</h3>
              <p className="mt-4 text-indigo-300">
                Learning grows stronger when shared.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Reliable</h3>
              <p className="mt-4 text-indigo-300">
                Community-driven answers you can trust.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Accessible</h3>
              <p className="mt-4 text-indigo-300">
                Open to everyone, anytime, anywhere.
              </p>
            </div>
          </div>
        </section>
      </Reveal>


      {/* ================= ACTIVITY ================= */}
      <section className="py-12 md:py-20 px-4 md:px-10 bg-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-950">
          Happening Right Now
        </h2>

        <div className="max-w-3xl mx-auto mt-8 md:mt-10 space-y-4">
          {[
            "Someone asked a question on Binary Trees",
            "New PDF uploaded for DBMS",
            "A student earned 50 upvotes today",
            "New discussion started on React Hooks"
          ].map((item, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="bg-white p-4 md:p-6 rounded-xl shadow text-sm md:text-base">
                {item}
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ================= FINAL CTA ================= */}
      <Reveal>
        <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-950 to-cyan-950 text-white text-center px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold">
            You Don’t Have to Study Alone
          </h2>
          <p className="mt-6 text-lg md:text-xl text-indigo-200">
            Join thousands of learners helping each other succeed.
          </p>

          <Link to="/signup">
            <button className="mt-10 px-10 py-4 md:px-16 md:py-5 bg-white text-indigo-950 text-lg md:text-xl font-bold rounded-full hover:scale-110 transition">
              Create Free Account
            </button>
          </Link>
        </section>
      </Reveal>



      {/* ================= FOOTER ================= */}
      <footer className="bg-[#040124] text-indigo-200 py-6 text-center">
        © {new Date().getFullYear()} Learn Together • Built with ❤️
      </footer>

    </div>
  );
};

export default HomePage;