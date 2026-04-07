import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import QuestionCard from "./QuestionCard";
import MaterialCard from "./MaterialCard";
import Reveal from "./Reveal";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const [questions, setQuestions] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const [qRes, mRes] = await Promise.all([
                    fetch(`http://localhost:3000/questions?query=${encodeURIComponent(query)}`),
                    fetch(`http://localhost:3000/materials?query=${encodeURIComponent(query)}`)
                ]);
                const qData = await qRes.json();
                const mData = await mRes.json();
                setQuestions(qData);
                setMaterials(mData);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchResults();
        }
    }, [query]);

    return (
        <div className="flex flex-col w-full px-10 py-6">
            <h1 className="text-indigo-950 text-3xl font-bold mb-8">
                Search Results for "{query}"
            </h1>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Searching...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-950 mb-4 border-b pb-2">Questions</h2>
                        {questions.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {questions.map(q => <QuestionCard key={q._id} question={q} />)}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No questions found.</p>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-950 mb-4 border-b pb-2">Materials</h2>
                        {materials.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {materials.map(m => <MaterialCard key={m._id} material={m} />)}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No materials found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
