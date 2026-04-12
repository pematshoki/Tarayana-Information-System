import React, { useState, useRef, useEffect } from "react";
import { User, Lock, LogOut, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/logo.png";

const Navbar = ({ collapsed }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // State for user info from token
  const [userData, setUserData] = useState({ email: "User", role: "Guest", id: "" });

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

  // --- NEW: Load User Data from Token ---
useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const decoded = jwtDecode(token);

    console.log("TOKEN:", decoded);

    setUserData({
      email: decoded.email || decoded.user?.email || "Admin",
      role: decoded.roleName || decoded.role || decoded.user?.roleName || "No Role",
      id: decoded.id || decoded._id,
    });

  } catch (err) {
    console.error("Invalid token", err);
  }
}, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validate = () => {
    let newErrors = {};
    if (!currentPassword) newErrors.currentPassword = "Current password is required";
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword = "Min 8 chars, 1 letter, 1 number, 1 special char";
    }
    if (confirmPassword !== newPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- UPDATED: Handle Submit (Backend Integration) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/auth/change-password/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ server: data.message || "Failed to update password" });
        return;
      }

      setShowModal(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Optional: Logout user or redirect
      }, 2000);
    } catch (err) {
      setErrors({ server: "Server error. Please try again later." });
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-full bg-gray-100 pl-12 pr-4 sm:px-6 py-3 flex items-center justify-between shadow-sm fixed top-0 left-0 z-40">
      
      {/* LEFT: Title */}
      <div className={`flex flex-col items-start gap-1 min-w-0 transition-all duration-300 ${collapsed ? "md:ml-[75px]" : "md:ml-[265px]"}`}>
        <h1 className="text-base sm:text-xl font-semibold text-gray-800 truncate">Dashboard</h1>
        <p className="text-xs sm:text-sm font-light text-gray-600 leading-tight -mt-1.5">Overview of operations</p>
      </div>

      {/* RIGHT: User Info (Dynamically populated) */}
      <div className="flex items-center gap-2 flex-shrink-0 relative" ref={dropdownRef}>
        <div className="block sm:hidden text-right leading-tight">
          <p className="text-xs font-semibold text-gray-800 truncate w-24">{userData.email}</p>
          <p className="text-[10px] text-gray-500">{userData.role}</p>
        </div>

        <div onClick={() => setOpen(!open)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-300 cursor-pointer hover:bg-gray-400">
          <User className="text-gray-700" size={18} />
        </div>

        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-gray-800">{userData.email}</p>
          <p className="text-xs text-gray-500">{userData.role}</p>
        </div>

        {open && (
          <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-md border z-50">
            <button onClick={() => { setShowModal(true); setOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100">
              <Lock size={16} /> Change Password
            </button>
            <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </div>

      {/* MODAL & FORM */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-3">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-[#f3f4f6] rounded-2xl shadow-2xl w-full md:max-w-xl px-6 py-8 text-center">
            <img src={logo} className="w-16 mx-auto mb-3" alt="Logo" />
            <h1 className="text-lg font-semibold text-gray-700">Change Password</h1>
            
            {/* Show server-side errors (like "Incorrect old password") */}
            {errors.server && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{errors.server}</p>}

            <form onSubmit={handleSubmit} className="text-left space-y-4">
              <div className="relative w-[90%] mx-auto">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18}/>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg bg-gray-200 border ${errors.currentPassword ? "border-red-400" : "border-gray-300"}`}
                />
                {/* <span onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-3 cursor-pointer">
                  {showCurrent ? <EyeOff size={18}/> : <Eye size={18}/>}
                </span> */}
                {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
              </div>

              <div className="relative w-[90%] mx-auto">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18}/>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg bg-gray-200 border ${errors.newPassword ? "border-red-400" : "border-gray-300"}`}
                />
                {/* <span onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3 cursor-pointer">
                  {showNew ? <EyeOff size={18}/> : <Eye size={18}/>}
                </span> */}
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
              </div>

              <div className="relative w-[90%] mx-auto">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18}/>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg bg-gray-200 border ${errors.confirmPassword ? "border-red-400" : "border-gray-300"}`}
                />
                {/* <span onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3 cursor-pointer">
                  {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                </span> */}
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <button className="w-[90%] mx-auto block bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* ... Success Popup Logic ... */}
    </div>
  );
};

export default Navbar;