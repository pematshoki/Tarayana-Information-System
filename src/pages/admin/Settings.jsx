import { useState } from "react";
import {
  Users,
  Shield,
  BadgeCheck,
  Plus,
  X,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { Trash2 } from "lucide-react";
import hero from "../../assets/logo.png";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("roles");

  // ROLE STATES
  const [roles, setRoles] = useState([
    { name: "Administrator", desc: "Full Access", color: "bg-red-100 text-red-500" },
    { name: "Programme Officer", desc: "Dashboard, Programmes, Beneficiaries", color: "bg-blue-100 text-blue-500" },
    { name: "Field Officer", desc: "Dashboard, Beneficiaries", color: "bg-green-100 text-green-500" },
    { name: "M&E Officer", desc: "Dashboard, Reports, Knowledge (View)", color: "bg-yellow-100 text-yellow-600" },
    { name: "C&D Officer", desc: "Dashboard, Knowledge, Reports (View)", color: "bg-purple-100 text-purple-500" },
    { name: "Management", desc: "Dashboard, Programmes & Reports (Read-only)", color: "bg-gray-200 text-gray-600" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");

  // BANNER STATE
const [banner, setBanner] = useState(hero);
  const [imageURL, setImageURL] = useState("");

  const [deleteItem, setDeleteItem] = useState(null);
const [showSuccess, setShowSuccess] = useState(false);
const [successType, setSuccessType] = useState("");

  // KPI DATA
  const totalUsers = 6;
  const activeUsers = 6;

const handleCreateRole = () => {
  if (!roleName.trim()) return;

  setRoles([
    ...roles,
    {
      name: roleName,
      desc: roleDesc || "Custom Access",
      color: "bg-gray-100 text-gray-600",
      custom: true, // 👈 important
    },
  ]);

  setShowModal(false);

  setSuccessType("role");
  setShowSuccess(true);

  setTimeout(() => setShowSuccess(false), 2000);

  setRoleName("");
  setRoleDesc("");
};


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(URL.createObjectURL(file));
      setImageURL("");
    }
  };

const confirmDelete = () => {
  setRoles(roles.filter((_, i) => i !== deleteItem));
  setDeleteItem(null);
};


  return (
    <div className="space-y-6">

          {/* HEADER */}
          <div>
            <h2 className="text-xl font-semibold">Setting</h2>
            <p className="text-sm text-gray-500">Roles & access control</p>
          </div>

          {/* KPI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-500" size={20} />
              </div>
              <div>
                <p className="font-semibold text-lg">{totalUsers}</p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="text-green-500" size={20} />
              </div>
              <div>
                <p className="font-semibold text-lg">{activeUsers}</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <BadgeCheck className="text-yellow-500" size={20} />
              </div>
              <div>
                <p className="font-semibold text-lg">{roles.length}</p>
                <p className="text-sm text-gray-500">Roles</p>
              </div>
            </div>
          </div>

          {/* TABS */}
          {/* TABS */}
<div className="flex justify-between items-center">
  <div className="flex bg-white p-1 rounded-xl shadow">

    {/* ROLES TAB */}
    <button
      onClick={() => setActiveTab("roles")}
      className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition
        ${activeTab === "roles"
          ? "bg-blue-500 text-white shadow"
          : "text-gray-500 hover:bg-gray-100"}
      `}
    >
      <Shield size={16} />
      Roles
    </button>

    {/* BANNER TAB */}
    <button
      onClick={() => setActiveTab("banner")}
      className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition
        ${activeTab === "banner"
          ? "bg-blue-500 text-white shadow"
          : "text-gray-500 hover:bg-gray-100"}
      `}
    >
      <ImageIcon size={16} />
      Banner Login
    </button>

  </div>

  {activeTab === "roles" && (
    <button
      onClick={() => setShowModal(true)}
      className="bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2"
    >
      <Plus size={16} /> Create Role
    </button>
  )}
</div>

          {/* ROLES */}
          {activeTab === "roles" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow relative">

  {/* DELETE ICON */}
  {role.custom && (
    <Trash2
      size={16}
      className="absolute top-3 right-3 text-red-500 cursor-pointer"
      onClick={() => setDeleteItem(i)}
    />
  )}

  <div className="flex items-center gap-3">
    <div className={`p-3 rounded-lg ${role.color}`}>
      <Shield size={18} />
    </div>
    <div>
      <h3 className="font-semibold">{role.name}</h3>
      <p className="text-xs text-gray-400">
        {role.custom ? "Custom" : "Built-in"}
      </p>
    </div>
  </div>
                  <p className="text-sm text-gray-500 mt-3">{role.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* BANNER LOGIN */}
          {activeTab === "banner" && (
            <div className="bg-white p-6 rounded-xl shadow space-y-6">

              {/* Preview */}
              <div className="relative">
                <img
                  src={banner || "https://via.placeholder.com/800x300"}
                  alt="banner"
                 className="rounded-xl w-full h-72 md:h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur px-6 py-4 rounded-xl text-center shadow">
                    <ImageIcon className="mx-auto text-blue-500 mb-2" />
                    <p className="font-medium">Login Preview</p>
                    <p className="text-xs text-gray-500">
                      This is how login page will look
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload */}
              <div>
                <p className="text-sm mb-2">Upload Image</p>
                <label className="border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Click here to upload</p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* URL */}
              <div>
                <p className="text-sm mb-2">Or Image URL</p>
                <input
                  type="text"
                  value={imageURL}
                  onChange={(e) => {
                    setImageURL(e.target.value);
                    setBanner(e.target.value);
                  }}
                  placeholder="Enter image url link"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3">
                <button className="border px-4 py-2 rounded-lg">
                  Reset Default
                </button>
                            <button
                onClick={() => {
                    setSuccessType("banner");
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 2000);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                Save Banner
                </button>
              </div>
            </div>
          )}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">Create New Role</h2>
              <X onClick={() => setShowModal(false)} className="cursor-pointer" />
            </div>

            <input
              placeholder="Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <textarea
              placeholder="Role Description"
              value={roleDesc}
              onChange={(e) => setRoleDesc(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          {/* Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl px-10 py-10 text-center w-[90%] max-w-md animate-fadeIn">
            {/* Circle */}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* TEXT */}
            <h2 className="text-xl font-semibold text-gray-700">
              {successType === "role"
                ? "Role Created Successfully"
                : "Banner Updated Successfully"}
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              {successType === "role"
                ? "The new role has been created and is now available to assign to users."
                : "The banner has been updated and the latest changes are now visible."}
            </p>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default Setting;