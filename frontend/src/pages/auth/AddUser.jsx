import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const AddUser = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "",
  });

  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      navigate("/usersmanagement");
    }, 2000);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`${collapsed ? "md:ml-[75px]" : "md:ml-[265px]"}`}>
        <Navbar collapsed={collapsed} />

        <div className="p-6 pt-20">

          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 mb-6"
          >
            ← Back to User Management
          </button>

          <div className="bg-white p-6 rounded-xl shadow max-w-4xl">

            <h2 className="text-xl font-semibold mb-4">
              Add New User
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <input
                placeholder="Full Name"
                className="border p-3 rounded-lg"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                placeholder="Email Address"
                className="border p-3 rounded-lg"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="border p-3 rounded-lg"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="border p-3 rounded-lg"
              />

              <select
                className="border p-3 rounded-lg md:col-span-2"
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                <option>Select Role</option>
                <option>Administrator</option>
                <option>Programme Officer</option>
                <option>Field Officer</option>
              </select>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => navigate(-1)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
              >
                + Create User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40">
          <div className="bg-white p-8 rounded-xl text-center shadow">

            <h2 className="text-lg font-semibold">
              User Added Successfully
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              The user has been added.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;