
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    if (loginEmail === "madhu" && loginPassword === "123") {
      sessionStorage.setItem("isLoggedIn", true);
      sessionStorage.setItem("role", "admin");
      toast.success("Login success!!");
      navigate("/admin");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:3000/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      toast.success(data.message);
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("isLoggedIn", true);
      sessionStorage.setItem("user_id", data.user.user_id);
      sessionStorage.setItem("mongo_id", data.user._id);
      navigate("/questions");
    } catch {
      toast.error("Login failed");
    }
  };

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:3000/auth/register", {
        name: username,
        email: signupEmail,
        password: signupPassword,
      });

      toast.success(data.message);
      setIsSignup(false);
    } catch {
      toast.error("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div
        className="relative w-full max-w-[700px]
        bg-white rounded-xl overflow-hidden
        border-2 border-indigo-950 shadow-black/50 shadow-2xl
        h-[450px]"
      >

        {/* TEXT */}
        <span
          className={` sm:absolute text-3xl text-white/80
          left-[10%] top-[40%] z-20 font-bold
          transition-all duration-[2400ms]
          ${isSignup
              ? "translate-x-0 opacity-100"
              : "translate-x-[350px] opacity-100"
            }`}
        >
          {isSignup ? "Welcome!" : "Welcome Back!!"}
        </span>

        {/* ROLLING CIRCLE */}
        <span
          className={`absolute -bottom-40 right-30
          w-[900px] h-[900px] sm:w-[1500px] sm:h-[1500px]
          bg-indigo-950 rounded-full
          transition-all duration-2000 ease-in-out
          z-10
          ${isSignup
              ? "translate-x-[-180px] rotate-0"
              : "translate-x-[1200px] rotate-[360deg]"
            }`}
        ></span>

        {/* FORMS */}
        <div className="relative w-full h-full flex flex-col sm:flex-row">

          {/* LOGIN */}
          <form
            onSubmit={handleLogin}
            className={`w-full sm:w-1/2 p-6 sm:p-10
            flex flex-col gap-6 justify-center
            transition-all duration-[2500ms]
            ${isSignup
                ? "-translate-x-full opacity-0"
                : "translate-x-0 opacity-100"
              }`}
          >
            <h1 className="text-3xl font-bold text-indigo-950">Login</h1>

            <input
              type="text"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="p-3 border rounded-lg"
            />

            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="p-3 border rounded-lg"
            />

            <button className="bg-indigo-950 text-white py-2 rounded-lg">
              Login
            </button>

            <p className="text-sm">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className="text-indigo-950 underline underline-offset-3 font-bold"
              >
                Sign up
              </button>
            </p>
          </form>

          {/* SIGNUP */}
          <form
            onSubmit={handleSignup}
            className={`w-full sm:w-1/2 p-6 sm:p-10
            flex flex-col gap-6 justify-center
            transition-all duration-[2400ms]
            ${isSignup
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
              }`}
          >
            <h1 className="text-3xl font-bold text-indigo-950">Sign Up</h1>

            <input
              type="text"
              placeholder="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 border rounded-lg"
            />

            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="p-3 border rounded-lg"
            />

            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="p-3 border rounded-lg"
            />

            <button className="bg-indigo-950 text-white py-2 rounded-lg">
              Register
            </button>

            <p className="text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className="text-indigo-950 underline underline-offset-3 font-bold"
              >
                Login
              </button>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
