import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import PostQuestionForm from "./PostQuestionForm";
import { Link, useNavigate } from "react-router";
import Reveal from "./Reveal";

const QuestionsFeed = () => {
  const navigate = useNavigate();
  // Sample list of questions
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3000/questions");

      const data = await res.json();
      setQuestions(data);
    };
    fetchData();
  }, []);

  const handlePostQuestion = () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate("/post-question");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-10 gap-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-indigo-950">Community Questions</h1>
          <p className="text-sm text-gray-500">Ask for help or contribute answers</p>
        </div>
        <button
          onClick={handlePostQuestion}
          className="w-full md:w-auto bg-indigo-950 text-white px-8 py-3 rounded-2xl font-semibold text-sm shadow-indigo-200 shadow-xl hover:shadow-indigo-300 hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Post Question
        </button>
      </div>

      <div className="flex flex-col gap-2 w-full px-6 pb-20 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {questions.map((q) => {
          // console.log("q-here" ,q); // logging is fine here
          return <QuestionCard key={q.question_id} question={q} />;
        })}
      </div>
    </div>
  );
};

export default QuestionsFeed;
