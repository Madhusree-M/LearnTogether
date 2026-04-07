import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("mongo_id");

  // const [user, setUser] = useState({
  //   name: sessionStorage.getItem("username") || "Student",
  //   email: sessionStorage.getItem("email") || "student@mail.com",
  //   role: sessionStorage.getItem("role") || "Student",
  // });
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3000/auth/${userId}/profile`);
        const data = await res.json();
        // console.log("profile-----------------", data);

        setUser(data.user);
        setStats(data.stats);
        setActivity(data.activity);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);


  const [user, setUser] = useState({ name: "", email: "", role: "" });

  const [stats, setStats] = useState({
    questions: 0,
    answers: 0,
    materials: 0,
    totalPoints: 0,
    rank: 0
  });

  const [activity, setActivity] = useState({
    questions: [],
    materials: [],
    answers: []
  });

  const [loading, setLoading] = useState(true);

    // Removed redundant useEffect fetchProfileData as it was duplicate and used wrong endpoints

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleDeleteQuestion = async (id, mongoId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId })
      });
      if (response.ok) {
        setActivity(prev => ({ ...prev, questions: prev.questions.filter(q => q.question_id !== id) }));
        setStats(prev => ({ ...prev, questions: prev.questions - 1 }));
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      const response = await fetch(`http://localhost:3000/materials/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId })
      });
      if (response.ok) {
        setActivity(prev => ({ ...prev, materials: prev.materials.filter(m => m.material_id !== id) }));
        setStats(prev => ({ ...prev, materials: prev.materials - 1 }));
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteAnswer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;
    try {
      const response = await fetch(`http://localhost:3000/answers/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId })
      });
      if (response.ok) {
        setActivity(prev => ({ ...prev, answers: prev.answers.filter(a => a.answer_id !== id) }));
        setStats(prev => ({ ...prev, answers: prev.answers - 1 }));
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center py-20">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      {/* PROFILE CARD */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-indigo-950 text-white flex items-center justify-center text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-indigo-950">
                  {user.name}
                </h1>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold shadow-sm border border-yellow-200">
                  Rank #{stats.rank || "N/A"}
                </span>
              </div>
              <p className="text-gray-500">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-950 rounded-full text-sm font-semibold capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 md:mt-0 px-6 py-2 bg-indigo-950 text-white rounded-md hover:scale-105 duration-300"
          >
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          <div className="bg-indigo-50 p-4 rounded-xl text-center border border-indigo-100">
            <h2 className="text-2xl font-bold text-indigo-950">
              {stats.questions}
            </h2>
            <p className="text-xs text-gray-600 mt-1 uppercase tracking-wider">Questions</p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl text-center border border-indigo-100">
            <h2 className="text-2xl font-bold text-indigo-950">
              {stats.answers}
            </h2>
            <p className="text-xs text-gray-600 mt-1 uppercase tracking-wider">Answers</p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl text-center border border-indigo-100">
            <h2 className="text-2xl font-bold text-indigo-950">
              {stats.materials}
            </h2>
            <p className="text-xs text-gray-600 mt-1 uppercase tracking-wider">Materials</p>
          </div>

          <div className="bg-white p-4 rounded-xl text-center border-2 border-indigo-100 shadow-sm transform hover:scale-105 transition-all duration-300 hover:border-indigo-400">
            <h2 className="text-2xl font-black text-indigo-600">
              {stats.totalPoints || 0}
            </h2>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-black">Total Pts</p>
          </div>

          <div className="bg-white p-4 rounded-xl text-center border-2 border-amber-100 shadow-sm transform hover:scale-105 transition-all duration-300 hover:border-amber-400">
            <h2 className="text-2xl font-black text-amber-500">
              #{stats.rank || "N/A"}
            </h2>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-black">Global Rank</p>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="mt-12">

          <h2 className="text-2xl font-bold text-indigo-950 mb-6">
            Recent Activity
          </h2>

          {/* Recent Questions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Recent Questions
            </h3>

            {activity.questions && activity.questions.length > 0 ? (
              <ul className="space-y-3">
                {activity.questions.map(q => (
                  <li key={q._id} className="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors flex justify-between items-center group">
                    <div>
                      <span className="font-medium underline cursor-pointer" onClick={() => navigate("/questions")}>{q.title}</span>
                      <span className="text-sm text-gray-500 ml-2">• {q.subject}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteQuestion(q.question_id)} 
                      className="text-red-500 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No questions posted yet.</p>
            )}
          </div>

          {/* Recent Answers */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Recent Answers
            </h3>

            {activity.answers && activity.answers.length > 0 ? (
              <ul className="space-y-3">
                {activity.answers.map(a => (
                  <li key={a._id} className="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">Answered: </span>
                        <span className="text-indigo-700 underline cursor-pointer" onClick={() => navigate("/questions")}>{a.question?.title || "Question"}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteAnswer(a.answer_id)} 
                        className="text-red-500 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{a.text}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No answers given yet.</p>
            )}
          </div>

          {/* Recent Materials */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Recent Materials
            </h3>

            {activity.materials && activity.materials.length > 0 ? (
              <ul className="space-y-3">
                {activity.materials.map(m => (
                  <li key={m._id} className="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors flex justify-between items-center group">
                    <div>
                      <span className="font-medium underline cursor-pointer" onClick={() => navigate("/materials")}>{m.title}</span>
                      <span className="text-sm text-gray-500 ml-2">• {m.subject}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteMaterial(m.material_id)} 
                      className="text-red-500 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No materials shared yet.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;



