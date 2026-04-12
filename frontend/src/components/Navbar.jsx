

import React, { useState, useRef, useEffect } from "react";
import { User, Lock, LogOut, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = ({ collapsed }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const dropdownRef = useRef();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

  // Close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔁 Reset form when modal opens
  useEffect(() => {
    if (showModal) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    }
  }, [showModal]);

  // ✅ Live validation
  useEffect(() => {
    let newErrors = {};

    if (currentPassword && currentPassword !== "123456") {
      newErrors.currentPassword = "Current password is incorrect";
    }

    if (newPassword && !passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        "Password must include 8 characters, letter, number & special character";
    }

    if (confirmPassword && confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
  }, [currentPassword, newPassword, confirmPassword]);

  // Final validation on submit
  const validate = () => {
    let newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    } else if (currentPassword !== "123456") {
      newErrors.currentPassword = "Current password is incorrect";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        "Password must include 8 characters, letter, number & special character";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setShowModal(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/"); // 🔥 redirect
      }, 2000);
    }
  };

  return (
<div className="w-full bg-gray-100 pl-12 pr-4 sm:px-6 py-3 flex items-center justify-between shadow-sm fixed top-0 left-0 z-40">


  {/* LEFT: Title */}
<div
  className={`flex flex-col items-start gap-1 min-w-0 transition-all duration-300 
  ${collapsed ? "md:ml-[75px]" : "md:ml-[265px]"}`}
>
  <h1 className="text-base sm:text-xl font-semibold text-gray-800 truncate">
    Dashboard
  </h1>
  <p className="text-xs sm:text-sm font-light text-gray-600 leading-tight -mt-1.5">
    Overview of all operations
  </p>
</div>

  {/* RIGHT: User */}
<div className="flex items-center gap-2 flex-shrink-0 relative" ref={dropdownRef}>
  
  {/* NAME + ROLE (mobile) */}
  <div className="block sm:hidden text-right leading-tight">
    <p className="text-xs font-semibold text-gray-800">
      Pema Tshoki
    </p>
    <p className="text-[10px] text-gray-500">
     Administrator
    </p>
  </div>

  {/* ICON */}
  <div
    onClick={() => setOpen(!open)}
    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-300 cursor-pointer hover:bg-gray-400"
  >
    <User className="text-gray-700" size={18} />
  </div>

  {/* DESKTOP */}
  <div className="hidden sm:block text-right">
    <p className="text-sm font-semibold text-gray-800">Pema Tshoki</p>
    <p className="text-xs text-gray-500">Administrator</p>
  </div>



    {open && (
      <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-md border z-50">
        <button
          onClick={() => {
            setShowModal(true);
            setOpen(false);
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
        >
          <Lock size={16} /> Change Password
        </button>

        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
         onClick={() => navigate("/")}
         >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    )}
  </div>



      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-3">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative bg-[#f3f4f6] rounded-2xl shadow-2xl  w-full md:max-w-2xl lg:max-w-3xl px-6 sm:px-8 py-8 sm:py-10 text-center">

            <img src={logo} className="w-16 sm:w-20 mx-auto mb-3" />

            <h1 className="text-lg sm:text-xl font-semibold text-gray-700">
              Tarayana Information System
            </h1>
            <p className="text-gray-500 text-sm mb-6">Change Password</p>

            <form onSubmit={handleSubmit} className="text-left">

              {/* Current */}
              <div className="mb-4 relative w-[85%] mx-auto block">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18}/>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter Current Password"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg bg-gray-200 border ${
                    errors.currentPassword ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <span
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {showCurrent ? <EyeOff size={18}/> : <Eye size={18}/>}
                </span>
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                )}
              </div>

              {/* New */}
              <div className="mb-4 relative w-[85%] mx-auto block">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18}/>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter New Password"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg bg-gray-200 border ${
                    errors.newPassword ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <span
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {showNew ? <EyeOff size={18}/> : <Eye size={18}/>}
                </span>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm */}
              <div className="mb-5 relative w-[85%] mx-auto block">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18}/>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter Confirm Password"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg bg-gray-200 border ${
                    errors.confirmPassword ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                </span>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button className="w-[85%] mx-auto block bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md">
                Change Password
              </button>
            </form>

            <p className="text-gray-500 text-sm mt-5  cursor-pointer" onClick={() => navigate("/resetpassword")}>
              Forgot your Password?
            </p>
          </div>
        </div>
      )}

{/* ================= SUCCESS POPUP ================= */} 
{showSuccess && ( <div className="fixed inset-0 flex items-center justify-center z-50"> 
  <div className="absolute inset-0 bg-black/30 backdrop-blur-sm">
  </div> 
  <div className="relative bg-white rounded-2xl shadow-2xl px-10 py-10 text-center w-[90%] max-w-md">
     <div className="flex justify-center mb-5"> <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
       <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"> 
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
           </svg> 
           </div> 
           </div> 
           </div> 
           <h2 className="text-xl font-semibold text-gray-700"> Password Updated 
            </h2> <p className="text-gray-500 mt-2 text-sm"> Your password has been changed successfully </p> </div> </div> )} </div> ); };

export default Navbar;