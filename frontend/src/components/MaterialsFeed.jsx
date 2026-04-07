import { useEffect, useState } from "react";
import MaterialCard from "./MaterialCard";
import { Link, useNavigate } from "react-router";
import Reveal from "./Reveal";

const MaterialsFeed = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      const res = await fetch("http://localhost:3000/materials");
      const data = await res.json();
      setMaterials(data);
    };
    fetchMaterials();
  }, []);

  const handleUploadMaterial = () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate("/post-material");
    } else {
      navigate("/login");
    }
  };

  return (
    <Reveal>
      <div className="flex flex-col w-full max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-10 gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-indigo-950">Study Resources</h1>
            <p className="text-sm text-gray-500 font-medium">Share and download study materials</p>
          </div>
          <button
            onClick={handleUploadMaterial}
            className="w-full md:w-auto bg-indigo-950 text-white px-8 py-3 rounded-2xl font-semibold text-sm shadow-indigo-100 shadow-xl hover:shadow-indigo-200 hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Upload Resource
          </button>
        </div>

        <div className="flex flex-col gap-4 w-full px-6 pb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {materials.map((m) => (
            <MaterialCard key={m.material_id} material={m} />
          ))}
        </div>
      </div>
    </Reveal>
  );
};

export default MaterialsFeed;
