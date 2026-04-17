
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Pencil,
  Users,
  Shield,
  BadgeCheck,
  X,
} from "lucide-react";

const UserManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Phuntsho Wangmo",
      email: "phuntsho@gmail.com",
      role: "Administrator",
      active: true,
    },
    {
      id: 2,
      name: "Sonam Dorji",
      email: "sonam@gmail.com",
      role: "Programme Officer",
      active: true,
    },
  ]);

  // ✅ NEW STATES (SAFE ADD)
  const [donors, setDonors] = useState([
    "ADB-Japan Fund for Poverty",
    "Alstom Foundation",
    "American Himalayan Foundation",
  ]);

  const [partners, setPartners] = useState([
    "MoH",
    "MoAF",
    "NEC",
  ]);

  const [deleteItem, setDeleteItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);
const [actionType, setActionType] = useState(null); 
// "add" | "edit"

  const roleColors = {
    Administrator: "bg-red-100 text-red-600",
    "Programme Officer": "bg-blue-100 text-blue-600",
    "Field Officer": "bg-green-100 text-green-600",
    "C&D Officer": "bg-purple-100 text-purple-600",
    "M&E Officer": "bg-yellow-100 text-yellow-600",
    Management: "bg-gray-200 text-gray-600",
  };

  const toggleActive = (id) => {
    setUsers(users.map((u) =>
      u.id === id ? { ...u, active: !u.active } : u
    ));
  };

  // ✅ DELETE HANDLER UPDATED
  const confirmDelete = () => {
    if (activeTab === "users") {
      setUsers(users.filter((u) => u.id !== deleteItem));
    } else if (activeTab === "donors") {
      setDonors(donors.filter((_, i) => i !== deleteItem));
    } else {
      setPartners(partners.filter((_, i) => i !== deleteItem));
    }
    setDeleteItem(null);
  };

  // ✅ ADD / EDIT SAVE
const handleSave = () => {
  if (!inputValue.trim()) return;

  const isEditing = editIndex !== null;

  if (activeTab === "donors") {
    if (isEditing) {
      const updated = [...donors];
      updated[editIndex] = inputValue;
      setDonors(updated);
      setActionType("edit");
    } else {
      setDonors([...donors, inputValue]);
      setActionType("add");
    }
  } 
  else if (activeTab === "partners") {
    if (isEditing) {
      const updated = [...partners];
      updated[editIndex] = inputValue;
      setPartners(updated);
      setActionType("edit");
    } else {
      setPartners([...partners, inputValue]);
      setActionType("add");
    }
  }

  setShowModal(false);
  setInputValue("");
  setEditIndex(null);

  setShowSuccess(true);

  setTimeout(() => {
    setShowSuccess(false);
    setActionType(null); // reset after popup
  }, 2000);
};


const handleEdit = (index, value) => {
  setEditIndex(index);
  setInputValue(value);
  setShowModal(true);
};

  return (
    <div className="space-y-6">

          {/* HEADER */}
          <div>
            <h2 className="text-xl font-semibold">User Management</h2>
            <p className="text-sm text-gray-500">
              Roles & access control
            </p>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-lg font-semibold">{users.length}</p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {users.filter((u) => u.active).length}
                </p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <BadgeCheck className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-lg font-semibold">6</p>
                <p className="text-sm text-gray-500">Roles</p>
              </div>
            </div>
          </div>

          {/* TABS + BUTTON */}
          <div className="flex justify-between items-center">

            {/* Tabs */}
            <div className="flex bg-white p-1 rounded-xl shadow">
              {["users", "donors", "partners"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm capitalize flex items-center gap-2
                    ${activeTab === tab
                      ? "bg-blue-500 text-white shadow"
                      : "text-gray-500"}
                  `}
                >
                  {tab === "users" && <Users size={16} />}
                  {tab === "donors" && <Shield size={16} />}
                  {tab === "partners" && <BadgeCheck size={16} />}
                  {tab}
                </button>
              ))}
            </div>

            {/* BUTTON SWITCH */}
            {activeTab === "users" ? (
              <button
                onClick={() => navigate("/add-user")}
                className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-600 transition"
              >
                <Plus size={16} /> Add User
              </button>
            ) : (
              <button
                onClick={() => {
  setShowModal(true);
  setEditIndex(null);
  setInputValue("");
}}
                className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-600 transition"
              >
                <Plus size={16} /> Add {activeTab.slice(0, -1)}
              </button>
            )}
          </div>

          {/* USERS TABLE */}
          {activeTab === "users" && (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-4 text-left">User</th>
                    <th className="p-4 text-center">Role</th>
                    <th className="p-4 text-center">Description</th>
                    <th className="p-4 text-center">Active</th>
                    <th className="p-4 text-center"></th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="p-4 flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Users size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs ${roleColors[u.role]}`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="p-4 text-center text-gray-500">
                        Full Access
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleActive(u.id)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 ${
                            u.active ? "bg-green-400" : "bg-gray-300"
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full ${u.active ? "translate-x-5" : ""}`} />
                        </button>
                      </td>

                      <td className="p-4 text-center">
                        <Trash2
                          size={16}
                          className="text-red-500 cursor-pointer"
                          onClick={() => setDeleteItem(u.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* DONORS & PARTNERS TABLE */}
          {(activeTab === "donors" || activeTab === "partners") && (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-4 text-left">Sl no.</th>
                    <th className="p-4 text-left">
                      {activeTab === "donors" ? "Donor Name" : "Partner Name"}
                    </th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {(activeTab === "donors" ? donors : partners).map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-4">{i + 1}</td>
                      <td className="p-4">{item}</td>

                      <td className="p-4 text-center flex justify-center gap-3">
                        <Pencil
                          size={16}
                          className="cursor-pointer"
                          onClick={() => handleEdit(i, item)}
                        />
                        <Trash2
                          size={16}
                          className="text-red-500 cursor-pointer"
                          onClick={() => setDeleteItem(i)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">
                Add {activeTab.slice(0, -1)}
              </h2>
              <X onClick={() => setShowModal(false)} className="cursor-pointer" />
            </div>

            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Enter name"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteItem !== null && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow">
            <h2 className="text-lg font-semibold mb-2">Delete Item?</h2>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteItem(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* SUCCESS POPUP */}
{showSuccess && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

    <div className="relative bg-white rounded-2xl shadow-2xl px-10 py-10 text-center w-[90%] max-w-md">
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
       {actionType === "edit" ? "Updated Successfully" : "Added Successfully"}
      </h2>

     <p className="text-gray-500 mt-2 text-sm">
  {activeTab === "donors"
    ? actionType === "edit"
      ? "Donor updated successfully."
      : "Donor added successfully."
    : actionType === "edit"
    ? "Partner updated successfully."
    : "Partner added successfully."}
</p>
    </div>
  </div>
)}

    </div>
  );
};

export default UserManagement;