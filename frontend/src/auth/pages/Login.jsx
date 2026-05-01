import {  useEffect,useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import bgImage from "../../assets/hero.png";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
const [bgImage, setBgImage] = useState("");
useEffect(() => {
  const fetchBanner = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/banner");
    const data = await res.json();

    console.log("BANNER API RESPONSE:", data);

    if (data && data.imageUrl) {
      setBgImage(data.imageUrl);
    } else {
      console.warn("No banner found in DB");
      setBgImage(""); // fallback
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

  fetchBanner();
}, []);
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
    } 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//    if (validate()) {
//   setShowSuccess(true);

//   // simulate redirect after 2 seconds
//   setTimeout(() => {
//     setShowSuccess(false);
//     navigate("/dashboard");
//     // 👉 later you can use navigate("/dashboard")
//   }, 2000);
// }
//   };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors({ general: data.message || "Login failed" });
      return;
    }

    // 1. Store auth data
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // 2. Show success popup
    setShowSuccess(true);

    // 3. Conditional Navigation based on Role
    setTimeout(() => {
      setShowSuccess(false);
      
      const userRole = data.user?.role; // Assuming your backend returns { user: { role: 'PO', ... } }

      if (userRole === "ProgrammeOfficer") {
        navigate("/po/dashboard"); // Route for Programme Officer
      } else if ( userRole === "FieldOfficer") {
        navigate("/dashboard");
      } else if ( userRole === "C&DOfficer" || userRole === "M&EOfficer") {
        navigate("/cd/dashboard");
      }  else if ( userRole === "Management") {
        navigate("/mgmt/dashboard");
      }else {
        navigate("/dashboard");    // Default fallback
      }
    }, 1500);

  } catch (error) {
    console.error(error);
    setErrors({ general: "Server error. Try again." });
  }
};
  

  return (
   <div
  className="relative w-full min-h-screen flex items-center justify-center px-4"
  style={{
    backgroundImage: bgImage ? `url(${bgImage})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>

      {/* Card */}
      <div className="relative z-10 w-full md:max-w-2xl lg:max-w-3xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl px-4 py-8 sm:px-6 sm:py-10">
        
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <img src={logo} alt="logo" className="w-28 h-28" />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-700">
          Tarayana Information System
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1 mb-6 font-semibold">
          Login to your account to continue
        </p>

       <form onSubmit={handleSubmit} noValidate className="max-w-xl mx-auto w-full">
{errors.general && (
  <p className="text-red-500 text-center mb-4">{errors.general}</p>
)}
          {/* Email */}
          <div className="mb-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
               className={`w-full pl-12 pr-4 py-4 text-base border rounded-xl bg-white/70 focus:outline-none focus:ring-2 ${
  errors.email ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
}`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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

              {/* <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button> */}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me (BIGGER) */}
          <div className="flex items-center mb-6 text-sm text-gray-600">
            <input
              type="checkbox"
              className="mr-2 w-5 h-5 accent-blue-500 cursor-pointer"
            />
            Remember me
          </div>

          {/* Button (BOLD TEXT) */}
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg shadow-lg font-semibold transition">
            Login
          </button>

        </form>

        {/* Forgot */}
        <p 
        onClick={() => navigate("/resetpassword")}
        className="text-center text-sm text-gray-500 mt-5 cursor-pointer ">
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