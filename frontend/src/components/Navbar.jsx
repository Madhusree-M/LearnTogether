import { Link, useNavigate } from "react-router";
import { useState } from "react";


const Navbar = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <>

      <div className="fixed top-0 left-0 right-0 z-50 flex 
                        items-center px-4 py-2 md:py-2 md:px-6 shadow-md
                        bg-white">
        {/* Logo Section */}
        <div className="flex gap-4 items-center flex-shrink-0">
          <i className="bi bi-list text-black text-2xl cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition" onClick={toggleSidebar}></i>
          <h1 className="text-xl md:text-2xl font-bold">LearnTogether</h1>
        </div>

        {/* Search Section (Centered) */}
        <div className="flex-1 flex justify-center px-4">
          <div className="hidden md:flex bg-gray-100 w-full max-w-[500px] items-center gap-3 border border-indigo-950 px-5 py-2 rounded-full shadow-lg/10">
            <svg
              className="w-5 h-5 text-gray-500 cursor-pointer"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              onClick={handleSearch}
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search here..."
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <svg
              className="w-5 h-5 text-gray-500 cursor-pointer"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"
              />
            </svg>
          </div>

          {/* Mobile Search Icon */}
          <div className="md:hidden">
            <Link to="/search">
              <svg
                className="w-6 h-6 text-gray-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Login Section (End) */}
        <div className="flex-shrink-0">
          {sessionStorage.getItem("isLoggedIn") === "true" ? (
            <>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.clear();
                  navigate("/login");
                }}
                className="hidden md:block py-2 px-6 bg-indigo-950 text-white rounded-lg text-lg font-bold hover:scale-105 duration-300"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.clear();
                  navigate("/login");
                }}
                className="md:hidden py-2 px-4 bg-indigo-950 text-white rounded-lg text-sm font-bold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:block">
                <button type="button" className="py-2 px-6 bg-indigo-950 text-white rounded-lg text-lg font-bold hover:scale-105 duration-300">
                  Login
                </button>
              </Link>
              <Link to="/login" className="md:hidden">
                <button type="button" className="py-2 px-4 bg-indigo-950 text-white rounded-lg text-sm font-bold">
                  Login
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar;