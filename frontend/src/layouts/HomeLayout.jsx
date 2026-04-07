import { Outlet } from "react-router"
import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import { useState } from "react";

const HomeLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <div className="flex w-full relative">
                <Navbar toggleSidebar={toggleSidebar} />

                {/* Backdrop for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <aside className={`fixed top-[88px] bottom-0 left-0 z-40 w-70 bg-[#040124] transform transition-transform duration-300 ease-in-out 
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <LeftSidebar />
                </aside>

                <main className={`pt-24 w-full transition-all duration-300 
                    ${isSidebarOpen ? "md:pl-70" : "pl-0"} px-4 md:px-0`}>
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default HomeLayout;
// import { Outlet } from "react-router";
// import Navbar from "../components/Navbar";
// import LeftSidebar from "../components/LeftSidebar";

// const HomeLayout = () => {
//   return (
//     <>
//       <Navbar />
//       <div>
//         <div className="w-90">
//           <LeftSidebar />
//         </div>
//           <Outlet />
//       </div>
//     </>
//   );
// };

// export default HomeLayout;
