import Reveal from "../components/Reveal";

const AboutPage = () => {
  return (
    <div className="w-full bg-slate-50 overflow-hidden font-sans text-slate-800">

      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full bg-indigo-950 text-white pt-32 pb-48 px-6 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          {/* Right top circle */}
          <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 blur-3xl"></div>
          <div className="absolute top-[40%] left-[10%] w-[200px] h-[200px] rounded-full bg-teal-500 blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-indigo-300">Students</span> <br /> to Learn Together.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl md:text-2xl text-indigo-100 font-light leading-relaxed max-w-3xl mx-auto">
              We believe that knowledge grows when shared. Our platform connects students to collaborate, resolve doubts, and succeed as a community.
            </p>
          </Reveal>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-[100px] w-[calc(100%+1.3px)] fill-slate-50">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      {/* ================= MISSION & VISION ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-100 to-indigo-100 rounded-3xl transform rotate-2"></div>
              <div className="relative bg-white p-10 rounded-2xl shadow-xl border border-indigo-50">
                <h3 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-4">Our Mission</h3>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Breaking Down Learning Barriers</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Ideally, every student should have access to help when they're stuck. We're building a space where asking questions is encouraged, and answering them is rewarding.
                </p>
                <div className="flex gap-4">
                  <div className="h-12 w-1 bg-indigo-500 rounded-full"></div>
                  <div>
                    <p className="font-bold text-slate-900">400+ Students</p>
                    <p className="text-sm text-slate-500">Joined so far</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div>
              <h3 className="text-sm font-bold tracking-widest text-teal-600 uppercase mb-4">Our Vision</h3>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6">A Global Classroom Without Walls</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                We envision a world where no student feels isolated in their academic journey. By fostering a culture of peer-to-peer mentorship, we aim to make high-quality education support accessible to everyone, everywhere.
              </p>
              <ul className="space-y-4">
                {['Collaborative Environment', 'Resource Sharing', 'Peer Mentorship'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs">
                      <i className="bi bi-check-lg"></i>
                    </span>
                    <span className="font-medium text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= CORE VALUES ================= */}
      <div className="bg-indigo-950 text-white py-32 relative overflow-hidden">
        {/* Bg Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Guided by Principles</h2>
              <p className="text-indigo-200 max-w-2xl mx-auto text-lg">
                Our core values shape every feature we build and every interaction on our platform.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'bi-people-fill', title: "Community First", desc: "We prioritize safe, inclusive, and supportive interactions above all else." },
              { icon: 'bi-lightbulb-fill', title: "Curiosity Driven", desc: "No question is too small. We celebrate the courage to ask and the desire to know." },
              { icon: 'bi-shield-check', title: "Quality & Trust", desc: "We strive to ensure shared knowledge is accurate, helpful, and reliable." }
            ].map((val, idx) => (
              <Reveal key={idx} delay={idx * 150}>
                <div className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-800 p-8 rounded-2xl hover:bg-indigo-800/60 transition-colors duration-300">
                  <div className="w-14 h-14 bg-indigo-500 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-indigo-500/30">
                    <i className={`bi ${val.icon} text-white`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{val.title}</h3>
                  <p className="text-indigo-200 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CTA SECTION ================= */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-950 to-purple-950 rounded-3xl p-12 md:p-20 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-white/20 transition duration-700"></div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 relative z-10">
              Ready to start learning better?
            </h2>
            <p className="text-lg md:text-xl text-teal-100 mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of students who are already sharing notes, asking questions, and topping the leaderboards.
            </p>
            <button className="relative z-10 bg-white text-indigo-950 font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-300">
              Join the Community
            </button>
          </div>
        </Reveal>
      </section>

      {/* ================= FOOTER (Simple) ================= */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800">
        <p className="mb-4 text-lg font-medium text-slate-200">Learn Together</p>
        <p className="text-sm">© {new Date().getFullYear()} All rights reserved.</p>
      </footer>

    </div>
  );
};

export default AboutPage;
