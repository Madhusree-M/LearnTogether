import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";

const PostQuestionForm = () => {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:3000/questions",
        {
          title,
          description,
          subject,
          author: sessionStorage.getItem("mongo_id")
        }
      );

      toast.success("Question posted successfully");
      navigate("/questions");

    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <form className="flex flex-col rounded-lg w-[550px] mt-20 mx-auto px-10 py-10 gap-7 border-1 border-indigo-950/50 shadow-black/20 shadow-lg">

        <h1 className="text-3xl font-bold text-center">
          Ask a Question
        </h1>

        <div className="flex flex-col gap-5">

          <input
            type="text"
            placeholder="Question Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 border-1 border-indigo-950/50 rounded-lg text-lg"
          />

          <textarea
            placeholder="Describe your question..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="p-3 border-1 border-indigo-950/50 rounded-lg text-lg resize-none"
          />

          <input
            type="text"
            placeholder="Subject (DBMS / JavaScript / C++)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="p-3 border-1 border-indigo-950/50 rounded-lg text-lg"
          />

        </div>

        <button
          type="button"
          className="mx-auto py-3 w-[45%] bg-indigo-950 text-white rounded-lg text-xl font-bold"
          onClick={handleSubmit}
        >
          Post Question
        </button>

      </form>
    </>
  );
};

export default PostQuestionForm;
