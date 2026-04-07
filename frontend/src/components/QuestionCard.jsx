import { useState } from "react";
import { useNavigate } from "react-router";

const QuestionCard = ({ question }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(
    question.upvotes?.includes(sessionStorage.getItem("mongo_id")) || false
  );
  const [upvoteCount, setUpvoteCount] = useState(question.upvotes?.length || 0);

  const [showAnswers, setShowAnswers] = useState(false);
  const [showAddAnswer, setShowAddAnswer] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [answers, setAnswers] = useState(question.answers || []);
  const [answerCount, setAnswerCount] = useState(question.answerCount || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(question.title);
  const [editedDescription, setEditedDescription] = useState(question.description);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswerText, setEditedAnswerText] = useState("");

  const isOwner = sessionStorage.getItem("mongo_id") === (question.author?._id || question.author);

  const getAvatarColor = (name) => {
    const colors = ["bg-indigo-500", "bg-purple-500", "bg-blue-500", "bg-emerald-500", "bg-pink-500", "bg-amber-500"];
    const charCode = name?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const handleLikeButton = async () => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/questions/${question.question_id}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({ user_id: sessionStorage.getItem("mongo_id") })
      });

      const data = await response.json();
      if (response.ok) {
        setLiked(!liked);
        setUpvoteCount(data.upvotes);
      }
    } catch (error) {
      console.error("Upvote failed", error);
    }
  };

  const handleViewAnswers = () => {
    if (!showAnswers) {
      fetchAnswers();
    }
    setShowAnswers(prev => !prev);
  };

  const handleAddAnswerButton = () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setShowAddAnswer(prev => !prev);
  };

  const fetchAnswers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/answers/${question._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      if (response.ok) {
        setAnswers(data.answers);
        setAnswerCount(data.answers.length);
      }
    } catch (error) {
      console.error("Failed to fetch answers", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("mongo_id");
      const response = await fetch(`http://localhost:3000/questions/${question.question_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
          userId
        })
      });

      if (response.ok) {
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("mongo_id");
      const response = await fetch(`http://localhost:3000/questions/${question.question_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleUpdateAnswer = async (answer_id) => {
    try {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("mongo_id");
      const response = await fetch(`http://localhost:3000/answers/${answer_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          text: editedAnswerText,
          userId
        })
      });

      if (response.ok) {
        setEditingAnswerId(null);
        fetchAnswers();
      }
    } catch (error) {
      console.error("Update answer failed", error);
    }
  };

  const handleDeleteAnswer = async (answer_id) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;

    try {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("mongo_id");
      const response = await fetch(`http://localhost:3000/answers/${answer_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        fetchAnswers();
        setAnswerCount(prev => prev - 1);
      }
    } catch (error) {
      console.error("Delete answer failed", error);
    }
  };

  const handleSubmitAnswer = async (question_id) => {
    if (answerText.trim() === "") return;

    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/answers/${question_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            author_name: "Current User",
            text: answerText
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setAnswers(prev => [data.answer, ...prev]);
        setAnswerCount(prev => prev + 1);
        setAnswerText("");
        setShowAddAnswer(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-4">
      <div className="p-5 md:p-6">
        {/* Header: Author & Date */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3 items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${getAvatarColor(question.author_name)}`}>
              {question.author_name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-950 leading-tight">{question.author_name}</span>
              <span className="text-[11px] text-gray-400 uppercase tracking-widest">{question.createdAt?.split("T")[0]}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {isOwner && (
              <div className="flex gap-1">
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  title="Edit Question"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button 
                  onClick={handleDelete} 
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Question"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-semibold uppercase tracking-tight rounded-full border border-indigo-100 h-fit">
              {question.subject}
            </span>
          </div>
        </div>

        {/* Body: Title & Description */}
        <div className="mb-5">
          {isEditing ? (
            <div className="space-y-3">
              <input 
                type="text" 
                value={editedTitle} 
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Question Title"
              />
              <textarea 
                value={editedDescription} 
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none h-32 resize-none"
                placeholder="Description"
              />
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="px-4 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate} 
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-indigo-950 mb-2 leading-snug">
                {question.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {question.description}
              </p>
            </>
          )}
        </div>

        {/* Footer: Actions */}
        <div className="flex items-center gap-6 pt-4 border-t border-gray-50 mt-4">
          <button
            onClick={handleLikeButton}
            className={`flex items-center gap-2 group transition-all duration-300 ${liked ? "text-pink-600 scale-105" : "text-gray-400 hover:text-pink-400"}`}
          >
            <div className={`p-2 rounded-full transition-colors ${liked ? "bg-pink-50" : "group-hover:bg-pink-50"}`}>
              <svg
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${liked ? "fill-current" : "fill-none stroke-current"}`}
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
              </svg>
            </div>
            <span className="text-sm font-semibold">{upvoteCount}</span>
          </button>

          <button
            onClick={handleViewAnswers}
            className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest transition-all ${showAnswers ? "text-indigo-600" : "text-gray-400 hover:text-indigo-500"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>{showAnswers ? "Hide" : `Answers (${answerCount})`}</span>
          </button>

          <button
            onClick={handleAddAnswerButton}
            className={`ml-auto px-4 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all ${showAddAnswer ? "bg-red-50 text-red-600 border border-red-100" : "bg-indigo-950 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5"}`}
          >
            {showAddAnswer ? "Cancel" : "Add Answer"}
          </button>
        </div>

        {showAddAnswer && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <textarea
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none h-24"
              placeholder="Provide your helpful answer here..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button
                className="bg-indigo-950 text-white px-5 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"
                onClick={() => handleSubmitAnswer(question._id)}
              >
                Submit Answer
              </button>
            </div>
          </div>
        )}

        {showAnswers && (
          <div className="mt-6 flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            {answers.length > 0 ? (
              answers.map((ans, idx) => (
                <div key={idx} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 group transition-all hover:bg-white hover:shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2 items-center">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-semibold uppercase">
                        {ans.author?.name?.charAt(0) || "?"}
                      </div>
                      <span className="text-xs font-semibold text-gray-800 leading-tight">{ans.author?.name || "Member"}</span>
                    </div>
                    {sessionStorage.getItem("mongo_id") === ans.author?._id && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingAnswerId(ans.answer_id);
                            setEditedAnswerText(ans.text);
                          }}
                          className="p-1 text-gray-400 hover:text-indigo-600 rounded"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteAnswer(ans.answer_id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editingAnswerId === ans.answer_id ? (
                    <div className="pl-8 space-y-2">
                      <textarea 
                        value={editedAnswerText}
                        onChange={(e) => setEditedAnswerText(e.target.value)}
                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingAnswerId(null)} className="text-xs text-gray-500 hover:underline">Cancel</button>
                        <button onClick={() => handleUpdateAnswer(ans.answer_id)} className="text-xs text-indigo-600 font-bold hover:underline">Save</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 leading-relaxed pl-8">
                      {ans.text}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm font-medium italic">
                No answers yet. Be the first to help!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;