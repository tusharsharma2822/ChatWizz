import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { UserContext } from "../context/user.context";

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useContext(UserContext)

  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();
    axios.post("/users/login", {
        email,
        password
    }).then((res) => {
        console.log(res.data);
        localStorage.setItem('token', res.data.token)
        setUser(res.data.user)
        navigate("/dashboard")
    }).catch((err) => {
        console.log(err.response.data);
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-sans">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <span className="bg-cyan-400 rounded-full w-10 h-10 flex items-center justify-center text-black font-extrabold text-2xl mr-2">C</span>
          <span className="text-cyan-400 text-2xl font-bold font-sans">ChatWizz</span>
        </div>
        <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">Login</h2>
        <form className="space-y-6" onSubmit={submitHandler}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7-2s-4-7-10-7S2 10 2 10s4 7 10 7 10-7 10-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-black font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-400">Don't have an account? </span>
          <Link to="/register" className="text-cyan-400 hover:underline font-medium">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
