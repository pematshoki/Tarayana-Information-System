
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
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
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([]);
const [showEditModal, setShowEditModal] = useState(false);
const [editItem, setEditItem] = useState(null);
  
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

  const roleColors = {
    Administrator: "bg-red-100 text-red-600",
    "Programme Officer": "bg-blue-100 text-blue-600",
    "Field Officer": "bg-green-100 text-green-600",
    "C&D Officer": "bg-purple-100 text-purple-600",
    "M&E Officer": "bg-yellow-100 text-yellow-600",
    Management: "bg-gray-200 text-gray-600",
  };

  useEffect(() => {
  fetchUsers();
  fetchDonorPartners();
}, []);

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/auth/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) return;

    setUsers(data.users); // 🔥 important (matches backend)
  } catch (err) {
    console.error(err);
  }
};
  const toggleActive = (id) => {
    setUsers(users.map((u) =>
      u.id === id ? { ...u, active: !u.active } : u
    ));
  };

  const fetchDonorPartners = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/donor-partner/summary",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) return;

    // Extract only names
   setDonors(data.donors);
setPartners(data.partners);

  } catch (err) {
    console.error(err);
  }
};

 const confirmDelete = async () => {
  try {
    const token = localStorage.getItem("token");

    // USERS delete
    if (activeTab === "users") {
      const res = await fetch(
        `http://localhost:5000/api/auth/users/${deleteItem}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setUsers(users.filter((u) => u._id !== deleteItem));
    }

    // DONOR/PARTNER delete
    else {
      const res = await fetch(
        `http://localhost:5000/api/donor-partner/delete/${deleteItem}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      // Refresh list
      fetchDonorPartners();
    }

    setDeleteItem(null);

  } catch (err) {
    console.error(err);
  }
};

 const handleSave = async () => {
  if (!inputValue.trim()) return;

  // Only handle donors & partners here
  if (activeTab === "donors" || activeTab === "partners") {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/donor-partner/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: inputValue,
            roleName: activeTab === "donors" ? "Donor" : "Partner",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      // ✅ Update UI after success
      if (activeTab === "donors") {
       fetchDonorPartners();
      } else {
      fetchDonorPartners();
      }

      setShowModal(false);
      setInputValue("");
      setEditIndex(null);

    } catch (err) {
      console.error(err);
    }
  }
};

const handleEdit = (item) => {
  setEditItem(item);
  setInputValue(item.name);
  setShowEditModal(true);
};
const handleUpdate = async () => {
  if (!inputValue.trim()) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/donor-partner/update/${editItem._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: inputValue }),
      }
    );

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    // refresh list
    fetchDonorPartners();

    // reset
    setShowEditModal(false);
    setEditItem(null);
    setInputValue("");

  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="bg-gray-100 min-h-screen flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

<div className={`flex-1 ${collapsed ? "md:ml-[75px]" : "md:ml-[265px]"}`}>
        <Navbar collapsed={collapsed} />

        <div className="p-6 pt-24 space-y-6">

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
    <Users className="text-blue-600" size={20} /> </div> 
    <div> <p className="text-lg font-semibold">{users.length}</p>
     <p className="text-sm text-gray-500">Total Users</p>
      </div> </div>

  <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4"> 
  <div className="bg-blue-100 p-3 rounded-lg"> 
    <Shield className="text-blue-600" size={20} /> </div> 
    <div> <p className="text-lg font-semibold">{donors.length}</p>
     <p className="text-sm text-gray-500">Total Donors</p>
      </div> </div>
       <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4"> 
  <div className="bg-blue-100 p-3 rounded-lg"> 
    <BadgeCheck className="text-blue-600" size={20} /> </div> 
    <div> <p className="text-lg font-semibold">{partners.length}</p>
     <p className="text-sm text-gray-500">Total Partners</p>
      </div> </div>

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
               onClick={() => {
  setShowModal(true);
  setActiveTab("users"); // optional safety
}}
                className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-600 transition"
              >
                <Plus size={16} /> Add User
              </button>
            ) : (
              <button
                onClick={() => setShowModal(true)}
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
                    {/* <th className="p-4 text-center">Active</th> */}
                    <th className="p-4 text-center"></th>
                  </tr>
                </thead>

                <tbody>
  {users.map((u) => (
    <tr key={u._id} className="border-t">
      
      <td className="p-4 flex gap-3">
        <div className="bg-blue-100 p-2 rounded-full">
          <Users size={16} className="text-blue-600" />
        </div>
        <div>
          <p className="font-medium">{u.email}</p>
          {/* <p className="text-xs text-gray-400">{u.email}</p> */}
        </div>
      </td>

      <td className="p-4 text-center">
        <span className={`px-3 py-1 rounded-full text-xs ${roleColors[u.roleId?.roleName]}`}>
          {u.roleId?.roleName}
        </span>
      </td>

      <td className="p-4 text-center text-gray-500">
        {u.roleId?.roleDescription}
      </td>

      {/* <td className="p-4 text-center">
        <span className="text-green-500">Active</span>
      </td> */}

      <td className="p-4 text-center">
        <Trash2
          size={16}
          className="text-red-500 cursor-pointer"
          onClick={() => setDeleteItem(u._id)}
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
    <tr key={item._id} className="border-t">
      <td className="p-4">{i + 1}</td>

      <td className="p-4">{item.name}</td>

      <td className="p-4 text-center flex justify-center gap-3">
        <Pencil
          size={16}
          className="cursor-pointer"
          onClick={() => handleEdit(item)}
        />

        <Trash2
          size={16}
          className="text-red-500 cursor-pointer"
          onClick={() => setDeleteItem(item._id)}
        />
      </td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD MODAL */}
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
{showEditModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md">

      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">Edit {activeTab.slice(0, -1)}</h2>
        <X
          onClick={() => {
            setShowEditModal(false);
            setEditItem(null);
          }}
          className="cursor-pointer"
        />
      </div>

      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowEditModal(false);
            setEditItem(null);
          }}
          className="border px-4 py-2 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update
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
    </div>
  );
};

export default UserManagement;