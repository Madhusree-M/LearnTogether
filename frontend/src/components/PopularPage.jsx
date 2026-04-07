import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import MaterialCard from "./MaterialCard";
import Reveal from "./Reveal";

const PopularPage = () => {
    const [questions, setQuestions] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopular = async () => {
            setLoading(true);
            try {
                const [qRes, mRes] = await Promise.all([
                    fetch(`http://localhost:3000/questions?sort=popular`),
                    fetch(`http://localhost:3000/materials?sort=popular`)
                ]);
                const qData = await qRes.json();
                const mData = await mRes.json();
                setQuestions(qData);
                setMaterials(mData);
            } catch (error) {
                console.error("Failed to fetch popular items", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopular();
    }, []);

    return (
        <div className="flex flex-col w-full px-10 py-6">
            <h1 className="text-indigo-950 text-3xl font-bold mb-8 flex items-center gap-3">
                <i className="bi bi-lightning-charge text-yellow-500"></i>
                Popular Content
            </h1>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-950 mb-4 border-b pb-2">Trending Questions</h2>
                        <div className="flex flex-col gap-4">
                            {questions.map(q => <QuestionCard key={q._id} question={q} />)}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-950 mb-4 border-b pb-2">Top Materials</h2>
                        <div className="flex flex-col gap-4">
                            {materials.map(m => <MaterialCard key={m._id} material={m} />)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PopularPage;
