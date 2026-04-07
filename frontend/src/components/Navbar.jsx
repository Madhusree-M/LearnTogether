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
                        justify-between px-4 py-3 md:p-[21px] items-center md:items-baseline shadow-md
                        bg-white">
        <div className="flex gap-4 items-center">
          <i className="bi bi-list text-black text-2xl cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition" onClick={toggleSidebar}></i>
          <h1 className="text-xl md:text-2xl font-bold">LearnTogether</h1>
        </div>

        <div className="hidden md:flex bg-gray-100 w-[40%] items-center gap-3 border border-indigo-950 px-5 py-3 rounded-full shadow-lg/10">

          {/* Search Icon */}
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

          {/* Search Input */}
          <input
            type="search"
            placeholder="Search here..."
            className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />

          {/* Book / Filter Icon */}
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

        {/* Mobile Search Icon (visible only on small screens) */}
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

        {sessionStorage.getItem("isLoggedIn") === "true" ? (
          <button
            type="button"
            onClick={() => {
              sessionStorage.clear();
              navigate("/login");
            }}
            className="hidden md:block py-3 px-6 bg-indigo-950 text-white rounded-lg text-xl font-bold hover:scale-107 duration-300"
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button type="button" className="hidden md:block py-3 px-6 bg-indigo-950 text-white rounded-lg text-xl font-bold hover:scale-107 duration-300">
              Login
            </button>
          </Link>
        )}

        {/* Mobile Login/Logout Button (smaller) */}
        {sessionStorage.getItem("isLoggedIn") === "true" ? (
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
        ) : (
          <Link to="/login">
            <button type="button" className="md:hidden py-2 px-4 bg-indigo-950 text-white rounded-lg text-sm font-bold">
              Login
            </button>
          </Link>
        )}
      </div>
    </>
  )
}

export default Navbar;