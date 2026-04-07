import { useEffect, useState } from "react";

const LeaderboardPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRank, setUserRank] = useState(null);

    const userEmail = sessionStorage.getItem("email");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch("http://localhost:3000/auth/leaderboard");
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                const data = await response.json();

                if (Array.isArray(data)) {
                    setLeaderboard(data);
                    if (userEmail) {
                        const me = data.find(u => u.email === userEmail);
                        if (me) setUserRank(me);
                    }
                } else {
                    console.error("Leaderboard API returned invalid data:", data);
                    setLeaderboard([]);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
                setLeaderboard([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <div className="text-center py-20">Loading leaderboard...</div>;
    }

    const topThree = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-5xl font-extrabold text-indigo-950 mb-4 text-center animate-pulse">
                    🏆 Leaderboard
                </h1>
                <p className="text-center text-gray-600 mb-10 text-xl font-medium">
                    Celebrating our top learners and contributors
                </p>

                {/* PERSONAL RANK BANNER */}
                {userRank && (
                    <div className="mb-12 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between transform hover:scale-[1.01] transition-transform duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold border border-white/30">
                                #{userRank.rank}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">You're doing great, {userRank.name.split(' ')[0]}!</h3>
                                <p className="text-indigo-100">Keep contributing to climb higher in the ranks.</p>
                            </div>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-sm text-indigo-200">Total Points</p>
                            <p className="text-3xl font-black">{userRank.totalContributions}</p>
                        </div>
                    </div>
                )}

                {/* PODIUM SECTION */}
                {topThree.length > 0 && (
                    <div className="flex flex-col md:flex-row justify-center items-end gap-8 mb-16">
                        {/* 2nd Place */}
                        {topThree[1] && (
                            <div className="relative order-2 md:order-1 flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-gray-700 mb-4 relative z-10">
                                    {topThree[1].name.charAt(0)}
                                    <span className="absolute -bottom-3 bg-gray-600 text-white text-xs px-2 py-1 rounded-full">#{topThree[1].rank}</span>
                                </div>
                                <div className="bg-white p-6 rounded-t-2xl rounded-b-lg shadow-xl text-center w-64 h-72 flex flex-col justify-end border-t-8 border-gray-400 relative hover:shadow-2xl transition-all duration-300 group">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:-translate-y-2 transition-transform duration-300">
                                        <div className="text-4xl drop-shadow-md">🥈</div>
                                    </div>
                                    <h2 className="text-xl font-bold text-indigo-950 truncate w-full">{topThree[1].name}</h2>
                                    <p className="text-indigo-600 font-bold text-lg mt-1">{topThree[1].totalContributions} pts</p>
                                    <div className="mt-4 flex justify-between text-xs text-gray-500 w-full px-4">
                                        <span>Q: {topThree[1].questions}</span>
                                        <span>M: {topThree[1].materials}</span>
                                        <span>A: {topThree[1].answers}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 1st Place */}
                        {topThree[0] && (
                            <div className="relative order-1 md:order-2 flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-yellow-300 border-4 border-white shadow-xl flex items-center justify-center text-5xl font-bold text-yellow-800 mb-4 relative z-10">
                                    {topThree[0].name.charAt(0)}
                                    <span className="absolute -bottom-3 bg-yellow-600 text-white text-sm px-3 py-1 rounded-full">#{topThree[0].rank}</span>
                                </div>
                                <div className="bg-white p-8 rounded-t-2xl rounded-b-lg shadow-2xl text-center w-72 h-80 flex flex-col justify-end border-t-8 border-yellow-400 relative z-0 transform md:-translate-y-4 hover:-translate-y-6 transition-all duration-300 group">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:-translate-y-2 transition-transform duration-300">
                                        <div className="text-6xl drop-shadow-xl ">👑</div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-indigo-950 truncate w-full mt-6">{topThree[0].name}</h2>
                                    <p className="text-indigo-600 font-bold text-xl mt-1">{topThree[0].totalContributions} pts</p>
                                    <p className="text-sm text-yellow-600 font-semibold mb-2">{topThree[0].badge?.name}</p>
                                    <div className="mt-2 flex justify-between text-xs text-gray-500 w-full px-2">
                                        <span>Questions: {topThree[0].questions}</span>
                                        <span>Materials: {topThree[0].materials}</span>
                                        <span>Answers: {topThree[0].answers}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3rd Place */}
                        {topThree[2] && (
                            <div className="relative order-3 md:order-3 flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-orange-200 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-orange-800 mb-4 relative z-10">
                                    {topThree[2].name.charAt(0)}
                                    <span className="absolute -bottom-3 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">#{topThree[2].rank}</span>
                                </div>
                                <div className="bg-white p-6 rounded-t-2xl rounded-b-lg shadow-xl text-center w-64 h-64 flex flex-col justify-end border-t-8 border-orange-400 relative hover:shadow-2xl transition-all duration-300 group">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:-translate-y-2 transition-transform duration-300">
                                        <div className="text-4xl drop-shadow-md">🥉</div>
                                    </div>
                                    <h2 className="text-xl font-bold text-indigo-950 truncate w-full">{topThree[2].name}</h2>
                                    <p className="text-indigo-600 font-bold text-lg mt-1">{topThree[2].totalContributions} pts</p>
                                    <div className="mt-4 flex justify-between text-xs text-gray-500 w-full px-4">
                                        <span>Q: {topThree[2].questions}</span>
                                        <span>M: {topThree[2].materials}</span>
                                        <span>A: {topThree[2].answers}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* LIST SECTION */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-gray-500 font-semibold text-sm">
                        <div className="col-span-1 text-center">Rank</div>
                        <div className="col-span-7 md:col-span-5 hover:cursor-pointer">User</div>
                        <div className="col-span-4 md:col-span-6 flex justify-end md:justify-around text-center">
                            <span className="hidden md:block">Questions</span>
                            <span className="hidden md:block">Materials</span>
                            <span className="hidden md:block">Answers</span>
                            <span>Total Points</span>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {rest.map((user) => (
                                <div
                                    key={user.user_id}
                                    className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-indigo-50/80 transition duration-200 group border-l-4 ${user.email === userEmail ? 'border-indigo-600 bg-indigo-50/50' : 'border-transparent'}`}
                                >
                                    <div className="col-span-1 text-center font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">
                                        #{user.rank}
                                    </div>

                                    <div className="col-span-7 md:col-span-5 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-950 flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-indigo-200 transition-colors">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 group-hover:text-indigo-900 transition-colors">
                                                {user.name} {user.email === userEmail && <span className="ml-2 text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">You</span>}
                                            </span>
                                            <span className="text-xs text-gray-500 hidden sm:block">{user.email}</span>
                                        </div>
                                    </div>

                                    <div className="col-span-4 md:col-span-6 flex justify-end md:justify-around text-center text-sm text-gray-600">
                                        <span className="hidden md:block w-16 text-center">{user.questions}</span>
                                        <span className="hidden md:block w-16 text-center">{user.materials}</span>
                                        <span className="hidden md:block w-16 text-center">{user.answers}</span>
                                        <span className="font-bold text-indigo-950 w-16 text-center text-lg">{user.totalContributions}</span>
                                    </div>
                                </div>

                        ))}

                        {rest.length === 0 && topThree.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No contributors yet. Be the first to join the leaderboard!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
