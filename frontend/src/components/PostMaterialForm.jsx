import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

const PostMaterialForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [user, setUser] = useState("");

  const user_id = sessionStorage.getItem("user_id")

  useEffect(() => {
    const fetchMaterials = async () => {
      const res = await fetch(`http://localhost:3000/auth/${user_id}`);
      const userdata = await res.json();
      setUser(userdata);
    };
    fetchMaterials();
  }, [user_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      await axios.post("http://localhost:3000/materials", {
        title,
        subject,
        file_url: fileUrl,
        uploaded_by: sessionStorage.getItem("mongo_id"),
        uploader_name: "Madhusree M"
      });

      toast.success("Material uploaded successfully");
      navigate("/materials");
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  return (
    <form className="flex flex-col w-[520px] mt-20 mx-auto px-10 py-10 gap-6 
                     border border-indigo-950/30 rounded-lg shadow-lg mb-62">

      <h1 className="text-3xl font-bold text-center text-indigo-950">
        Upload Study Material
      </h1>

      <input
        type="text"
        placeholder="Material Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-3 border rounded-md"
        required
      />

      <input
        type="text"
        placeholder="Subject (DBMS / JS / OS)"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="p-3 border rounded-md"
        required
      />

      <input
        type="text"
        placeholder="File URL (Drive / PDF link)"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
        className="p-3 border rounded-md"
        required
      />

      <button
        onClick={handleSubmit}
        className="mx-auto w-[50%] py-3 bg-indigo-950 text-white 
                   rounded-md font-bold hover:scale-105 duration-300"
      >
        Upload
      </button>
    </form>
  );
};

export default PostMaterialForm;
