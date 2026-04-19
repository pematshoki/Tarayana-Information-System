import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!/^(?=.*[A-Za-z])(?=.*[\W_]).{8,}$/.test(form.password)) {
      newErrors.password =
        "Min 8 chars, include letter & special character";
    }

    if (!form.confirm) {
      newErrors.confirm = "Confirm your password";
    } else if (form.password !== form.confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    if (!form.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      navigate("/usersmanagement");
    }, 2000);
  };

  return (
    <div className="space-y-6">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ← Back to User Management
          </button>

          {/* CARD */}
          <div className="bg-white p-5 md:p-8 rounded-2xl shadow-xl w-full">

            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Add New User
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* EMAIL */}
              <div className="md:col-span-2">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className={`w-full border p-3 rounded-lg outline-none focus:ring-2 transition
                  ${errors.email ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-200"}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={`w-full border p-3 rounded-lg outline-none focus:ring-2 transition
                  ${errors.password ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-200"}`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirm}
                  onChange={(e) =>
                    setForm({ ...form, confirm: e.target.value })
                  }
                  className={`w-full border p-3 rounded-lg outline-none focus:ring-2 transition
                  ${errors.confirm ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-200"}`}
                />
                {errors.confirm && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirm}
                  </p>
                )}
              </div>

              {/* ROLE */}
              <div className="md:col-span-2">
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                  className={`w-full border p-3 rounded-lg outline-none focus:ring-2 transition
                  ${errors.role ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-200"}`}
                >
                  <option value="">Select Role</option>
                  <option>Administrator</option>
                  <option>Programme Officer</option>
                  <option>Field Officer</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
              <button
                onClick={() => navigate(-1)}
                className="px-5 py-2 border rounded-lg hover:bg-gray-100 transition w-full sm:w-auto"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition w-full sm:w-auto"
              >
                + Create User
              </button>
            </div>
          </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          <div className="relative bg-white rounded-2xl shadow-2xl px-10 py-10 text-center w-[90%] max-w-md animate-scaleIn">
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-700">
              User Added Successfully
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              The user has been added.
            </p>
          </div>
        </div>
      )}

      {/* Animation */}
      <style>
        {`
        .animate-scaleIn {
          animation: scaleIn 0.3s ease;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        `}
      </style>
    </div>
  );
};

export default AddUser;