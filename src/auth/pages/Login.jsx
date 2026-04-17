import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo.png";
import hero from "../../assets/hero.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  // Use the provided background image
  const bgImage = hero;

  // ✅ Custom validation
  const validate = () => {
    let newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email should be a valid format (e.g. user@gmail.com)";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password !== "123456") {
      // 🔹 you can replace this with backend later
      newErrors.password = "Password is incorrect";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

   if (validate()) {
  setShowSuccess(true);

  // Determine role for demo
  let role = 'Field Officer';
  if (email.includes('admin')) role = 'Admin';
  
  // Log in so the dashboard is accessible
  login({ email, role });

  // simulate redirect after 2 seconds
  setTimeout(() => {
    setShowSuccess(false);
    navigate("/dashboard");
    // 👉 later you can use navigate("/dashboard")
  }, 2000);
}
  };

  

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>

      {/* Card */}
      <div className="relative z-10 w-full md:max-w-2xl lg:max-w-3xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl px-4 py-8 sm:px-6 sm:py-10 text-center">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="logo" className="w-24 h-24" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-gray-700">
          Tarayana Information System
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1 font-semibold">
          Login to your account
        </p>
        <p className="text-center text-gray-500 text-sm mt-5 mb-6">
          Enter your credentials to access the system.
        </p>

        <form onSubmit={handleSubmit} noValidate className="max-w-xl mx-auto w-full">

          {/* Email */}
          <div className="mb-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-white/70 focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 text-left">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className={`w-full pl-11 pr-11 py-3 border rounded-lg bg-white/70 focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 text-left">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-6 text-sm text-gray-600">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4 accent-blue-500 cursor-pointer"
            />
            Remember me
          </div>

          {/* Button */}
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg shadow-lg font-semibold transition">
            Login
          </button>

        </form>

        {/* Forgot */}
        <p 
          onClick={() => navigate("/auth/forgot-password")}
          className="text-center text-sm text-gray-500 mt-6 cursor-pointer hover:text-blue-500 transition-colors"
        >
          Forgot your Password?
        </p>
      </div>


{showSuccess && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    
    {/* Background overlay */}
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

    {/* Popup Card */}
    <div className="relative bg-white rounded-2xl shadow-2xl px-10 py-10 text-center w-[90%] max-w-md animate-fadeIn">
      
      {/* Circle + Check */}
      <div className="flex items-center justify-center mb-5">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Text */}
      <h2 className="text-xl font-semibold text-gray-700">
        Login Successful
      </h2>
      <p className="text-gray-500 mt-2 text-sm">
        Redirecting to dashboard...
      </p>
    </div>
  </div>
)}


    </div>
  );
};

export default Login;