import { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";
import MaterialCard from "./MaterialCard";
import Reveal from "./Reveal";

const subjects = [
    "Programming",
    "Data Structures",
    "DBMS",
    "Web Development",
    "AI & ML",
    "Electronics",
    "Aptitude",
    "Exam Prep"
];

const ExplorePage = () => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedSubject) {
            const fetchBySubject = async () => {
                setLoading(true);
                try {
                    const [qRes, mRes] = await Promise.all([
                        fetch(`http://localhost:3000/questions?subject=${encodeURIComponent(selectedSubject)}`),
                        fetch(`http://localhost:3000/materials?subject=${encodeURIComponent(selectedSubject)}`)
                    ]);
                    const qData = await qRes.json();
                    const mData = await mRes.json();
                    setQuestions(qData);
                    setMaterials(mData);
                } catch (error) {
                    console.error("Failed to fetch by subject", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchBySubject();
        }
    }, [selectedSubject]);

    return (
        <div className="flex flex-col w-full px-10 py-6">
            <h1 className="text-indigo-950 text-3xl font-bold mb-8">Explore by Subjects</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-10">
                {subjects.map((sub, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedSubject(sub)}
                        className={`py-3 px-2 rounded-xl font-bold transition text-sm ${selectedSubject === sub
                            ? "bg-indigo-950 text-white shadow-lg"
                            : "bg-white text-indigo-950 border border-indigo-950/20 hover:bg-indigo-50"
                            }`}
                    >
                        {sub}
                    </button>
                ))}
            </div>

            {selectedSubject ? (
                loading ? (
                    <div className="text-center py-20 text-gray-500">Loading {selectedSubject}...</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div>
                            <h2 className="text-2xl font-bold text-indigo-950 mb-4 border-b pb-2">Questions in {selectedSubject}</h2>
                            {questions.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                    {questions.map(q => <QuestionCard key={q._id} question={q} />)}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No questions yet.</p>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-indigo-950 mb-4 border-b pb-2">Materials in {selectedSubject}</h2>
                            {materials.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                    {materials.map(m => <MaterialCard key={m._id} material={m} />)}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No materials yet.</p>
                            )}
                        </div>
                    </div>
                )
            ) : (
                <div className="text-center py-20 bg-indigo-50/50 rounded-2xl border-2 border-dashed border-indigo-200">
                    <p className="text-indigo-950/50 text-xl font-medium">Select a subject to start exploring</p>
                </div>
            )}
        </div>
    );
};

export default ExplorePage;
