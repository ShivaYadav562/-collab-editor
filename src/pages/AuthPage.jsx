import { useState } from "react";
import {
  Mail,
  Lock,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
  try {
const endpoint = isLogin
  ? "https://collab-editor-backend-1-fyl1.onrender.com/api/auth/login"
  : "https://collab-editor-backend-1-fyl1.onrender.com/api/auth/signup";
    const response = await fetch(endpoint, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    console.log(data);

    alert(data.message);

   if (data.token) {
  localStorage.setItem("token", data.token);

  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  navigate("/editor");

     
  };

  } catch (error) {

    console.log(error);

    alert("Something went wrong");
  }
};



  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">

      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-xl shadow-2xl">

        {/* LEFT */}
        <div className="hidden lg:flex flex-col justify-between p-14 bg-gradient-to-br from-purple-600/20 to-blue-600/10 relative">

          <div>

            <div className="flex items-center gap-3 mb-10">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold">
                C
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Collab Editor
                </h1>

                <p className="text-gray-400">
                  Real-time collaborative workspace
                </p>
              </div>
            </div>

            <div className="mt-20">
              <h2 className="text-5xl font-bold leading-tight">
                Build together in
                <span className="text-purple-400">
                  {" "}real-time
                </span>
              </h2>

              <p className="text-gray-400 mt-8 text-lg leading-relaxed">
                Collaborate with your team seamlessly.
                Write, edit, and communicate instantly.
              </p>
            </div>
          </div>

          <div className="flex gap-4">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex-1">
              <h3 className="text-3xl font-bold">
              ⚡Real-time
              </h3>

              <p className="text-gray-400 mt-2">
                  Active Users
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex-1">
              <h3 className="text-3xl font-bold">
                💬Live Chat
              </h3>

              <p className="text-gray-400 mt-2">
                Documents Edited
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="p-10 lg:p-16">

          <div className="flex gap-3 mb-10">

            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 rounded-2xl font-semibold transition-all ${
                isLogin
                  ? "bg-gradient-to-r from-purple-500 to-blue-500"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 rounded-2xl font-semibold transition-all ${
                !isLogin
                  ? "bg-gradient-to-r from-purple-500 to-blue-500"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              Sign Up
            </button>

          </div>

          <div>

            <h1 className="text-4xl font-bold mb-3">
              {isLogin
                ? "Welcome Back 👋"
                : "Create Account"}
            </h1>

            <p className="text-gray-400 mb-10">
              {isLogin
                ? "Login to continue collaborating"
                : "Join the collaborative workspace"}
            </p>

            <div className="space-y-6">

              {!isLogin && (
                <div className="relative">

                  <User
                    className="absolute left-4 top-4 text-gray-400"
                    size={20}
                  />

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 outline-none focus:border-purple-500"
                  />
                </div>
              )}

              <div className="relative">

                <Mail
                  className="absolute left-4 top-4 text-gray-400"
                  size={20}
                />

                <input
                 
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 outline-none focus:border-purple-500"
           />
                
              </div>

              <div className="relative">

              <input
              type="password"
              placeholder="Password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 outline-none focus:border-purple-500"
           />

        
              </div>

              <button
                onClick={handleAuth}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold text-lg hover:scale-[1.02] transition-all"
          >
               {isLogin ? "Login" : "Create Account"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}