

import React,{ useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Plus, CalendarDays, Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Event = () => {
  const navigate = useNavigate();
  const location = useLocation();
const { id } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [event, setEvent] = useState(location.state?.event || null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  const [editIndex, setEditIndex] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [entries, setEntries] = useState([]);

  if (!event) return <div className="p-6">No Event Found</div>;
useEffect(() => {
  if (!id) return;
  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/annual-event/main-event/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) return;

      setEvent(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchEvent();
}, [id]);
useEffect(() => {
  if (!id) return;

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/annual-event/events/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) return;

      setEntries(data.data); // 👈 important
    } catch (err) {
      console.error(err);
    }
  };

  fetchEntries();
}, [id]);

  // CREATE
const handleSave = async () => {
  const payload = {
    annualEventId: event._id,
   data: { ...formData },
  };

  event.fields.forEach((f) => {
    let value = formData[f.fieldName];

    if (f.fieldType === "number") value = Number(value);
    if (f.fieldType === "boolean") value = value === "true" || value === true;

    payload.data[f.fieldName] = value;
  });

  const res = await fetch("http://localhost:5000/api/annual-event/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) return alert(result.message);

  // ✅ FIX: update TABLE state
  setEntries((prev) => [...prev, result.data]);

  setShowForm(false);
  setFormData({});
};
  // EDIT
//  const handleEditSave = async () => {
//   const entryId = entries[editIndex]._id;

//   const payload = {
//     data: {},
//   };

//   event.fields.forEach((f) => {
//     let value = formData[f.fieldName];

//     if (f.fieldType === "number") value = Number(value);
//     if (f.fieldType === "boolean") value = value === "true" || value === true;

//     payload.data[f.fieldName] = value;
//   });

//   const res = await fetch(
//     `http://localhost:5000/api/annual-event/event/${entryId}`,
//     {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify(payload),
//     }
//   );

//   const result = await res.json();

//   if (!res.ok) return alert(result.message);

//   // ✅ update UI instantly
//   setEntries((prev) =>
//     prev.map((e, i) => (i === editIndex ? result.data : e))
//   );

//   setShowEdit(false);
//   setFormData({});
// };
const handleEditSave = async () => {
  const entryId = entries[editIndex]._id;

  // 1. Start with the existing formData (which contains sponsor_list and citizen_details)
  const payload = {
    data: { ...formData }, 
  };

  // 2. Run your formatting loop to ensure numbers and booleans are correct
  event.fields.forEach((f) => {
    let value = formData[f.fieldName];

    if (f.fieldType === "number") value = Number(value);
    if (f.fieldType === "boolean") value = value === "true" || value === true;

    payload.data[f.fieldName] = value;
  });

  // 3. EXPLICITLY ensure the nested arrays are preserved
  if (formData.sponsor_list) {
    payload.data.sponsor_list = formData.sponsor_list;
  }
  if (formData.citizen_details) {
    payload.data.citizen_details = formData.citizen_details;
  }

  const res = await fetch(
    `http://localhost:5000/api/annual-event/event/${entryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await res.json();

  if (!res.ok) return alert(result.message);

  // Update UI
  setEntries((prev) =>
    prev.map((e, i) => (i === editIndex ? result.data : e))
  );

  setShowEdit(false);
  setFormData({});
};

  // DELETE
 const handleDelete = async () => {
  const entryId = entries[deleteIndex]._id;

  const res = await fetch(
    `http://localhost:5000/api/annual-event/event/${entryId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const result = await res.json();

  if (!res.ok) return alert(result.message);

  // ✅ remove from UI
  setEntries((prev) => prev.filter((_, i) => i !== deleteIndex));

  setShowDelete(false);
};

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`${collapsed ? "md:ml-[75px]" : "md:ml-[265px]"}`}>
        <Navbar collapsed={collapsed} />

        <div className="p-6 pt-20 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <button onClick={() => navigate(-1)}>
              ← Back to Events
            </button>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow"
            >
              <Plus size={16} />
              Add {event?.eventName}
            </button>
          </div>

          {/* TITLE */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              <CalendarDays className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold">{event?.eventName}</h2>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-center w-16">Sl no.</th>

                  {event.fields.map((f) => (
                    <th key={f.fieldName} className="px-4 py-3">
                      {f.fieldName}
                    </th>
                  ))}

                  <th className="px-4 py-3 text-center w-32">ACTION</th>
                </tr>
              </thead>

          <tbody>
  {entries.length === 0 ? (
    <tr>
      <td colSpan="100%" className="text-center p-6 text-gray-400">
        No entries yet.
      </td>
    </tr>
  ) : (
    entries.map((item, i) => (
      <tr key={item._id} className="border-t hover:bg-gray-50 transition">
        <td className="px-4 py-3 text-center">{i + 1}</td>

        {(event?.fields || []).map((f) => {
          const fieldName = f.fieldName;
          let displayValue = item.data?.[fieldName] || "-";

          // Check if this specific field is the "Sponsors" field
          if (fieldName.toLowerCase() === "sponsors") {
            const sponsors = item.data?.["sponsor_list"];
            if (Array.isArray(sponsors) && sponsors.length > 0) {
              // Extract only the 'name' from each sponsor object and join with commas
              displayValue = sponsors
                .map((s) => s.name)
                .filter((name) => name) // Remove empty strings
                .join(", ");
            }
          }

          return (
            <td key={fieldName} className="px-4 py-3">
              {displayValue || "-"}
            </td>
          );
        })}

        <td className="px-4 py-3">
          <div className="flex justify-center gap-4">
            {/* VIEW */}
            <Eye
              size={18}
              className="text-blue-500 cursor-pointer"
              onClick={() =>
                navigate("/event-detail", {
                  state: { event, entry: item },
                })
              }
            />

            {/* EDIT */}
            <Pencil
              size={18}
              className="text-gray-600 cursor-pointer"
              onClick={() => {
                setEditIndex(i);
                setFormData(item.data);
                setShowEdit(true);
              }}
            />

            {/* DELETE */}
            <Trash2
              size={18}
              className="text-red-500 cursor-pointer"
              onClick={() => {
                setDeleteIndex(i);
                setShowDelete(true);
              }}
            />
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= ADD MODAL ================= */}
      {showForm && (
        <Modal
          title={`Create ${event?.eventName}`}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          fields={event.fields}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* ================= EDIT MODAL ================= */}
      {showEdit && (
        <Modal
          title={`Edit ${event?.eventName}`}
          onClose={() => setShowEdit(false)}
          onSave={handleEditSave}
          fields={event.fields}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* ================= DELETE MODAL ================= */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg">

            <h2 className="text-xl font-semibold mb-2">
              Delete Event?
            </h2>

            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this event? This action is permanent and cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDelete(false)}
                className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow"
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

export default Event;

/////////////////////////////////////////////////////////
// 🔹 REUSABLE MODAL COMPONENT (ADD + EDIT)
/////////////////////////////////////////////////////////

const Modal = ({ title, onClose, onSave, fields, formData, setFormData }) => {
  
  const updateNestedData = (fieldName, index, subField, value) => {
    const currentArray = [...(formData[fieldName] || [])];
    if (!currentArray[index]) currentArray[index] = {};
    currentArray[index][subField] = value;
    setFormData({ ...formData, [fieldName]: currentArray });
  };

  const addRow = (fieldName) => {
    const currentArray = [...(formData[fieldName] || []), { name: "", amount: "" }];
    setFormData({ ...formData, [fieldName]: currentArray });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl">✕</button>
        <h2 className="text-xl font-bold mb-8">{title}</h2>

        {/* The items-start class ensures boxes don't stretch vertically if one is taller */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-start">
          {fields.map((f) => {
            
            // --- CASE 1: Senior Citizens + Side-by-Side Name/CID ---
            if (f.fieldName === "No of Senior Citizen Participated") {
              const count = parseInt(formData[f.fieldName]) || 0;
              return (
                <React.Fragment key={f.fieldName}>
                  {/* The actual Number Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">{f.fieldName}</label>
                    <input
                      type="number"
                      value={formData[f.fieldName] || ""}
                      onChange={(e) => setFormData({ ...formData, [f.fieldName]: e.target.value })}
                      className="border border-gray-300 rounded-md px-3 py-2 h-11 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                 
                  {Array.from({ length: count }).map((_, idx) => (
                    <React.Fragment key={`cit-${idx}`}>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Name</label>
                    
                         <input
                          placeholder="CID"
                          className="border border-gray-300 rounded-md px-3 py-2 h-11 outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData["citizen_details"]?.[idx]?.cid || ""}
                          onChange={(e) => updateNestedData("citizen_details", idx, "cid", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">CID</label>
                        <input
                          placeholder="Name"
                          className="border border-gray-300 rounded-md px-3 py-2 h-11 outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData["citizen_details"]?.[idx]?.name || ""}
                          onChange={(e) => updateNestedData("citizen_details", idx, "name", e.target.value)}
                        />
                      </div>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              );
            }

            // --- CASE 2: Sponsors (Row with Nu. prefix) ---
            if (f.fieldName.toLowerCase() === "sponsors") {
              const sponsorList = formData["sponsor_list"] || [{ name: "", amount: "" }];
              return (
                <div key={f.fieldName} className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">Sponsor's Name with Amount</label>
                  <div className="space-y-3">
                    {sponsorList.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-1 flex border border-gray-300 rounded-md overflow-hidden h-11 focus-within:ring-2 focus-within:ring-blue-500">
                          <input
                            placeholder="Enter name"
                            className="flex-1 px-3 py-2 outline-none border-r border-gray-300"
                            value={s.name}
                            onChange={(e) => updateNestedData("sponsor_list", idx, "name", e.target.value)}
                          />
                          <div className="bg-white flex items-center px-2 text-gray-400 text-sm italic">Nu.</div>
                          <input
                            type="number"
                            placeholder="0.00"
                            className="w-24 px-2 py-2 outline-none"
                            value={s.amount}
                            onChange={(e) => updateNestedData("sponsor_list", idx, "amount", e.target.value)}
                          />
                        </div>
                        {idx === sponsorList.length - 1 && (
                          <button type="button" onClick={() => addRow("sponsor_list")} className="text-blue-500 text-2xl font-bold px-1 hover:text-blue-700">
                            +
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // --- DEFAULT CASE: Standard Grid Fields (Destination, Dates, etc.) ---
            return (
              <div key={f.fieldName} className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">{f.fieldName}</label>
                <input
                  type={f.fieldType === "date" ? "date" : f.fieldType === "number" ? "number" : "text"}
                  value={formData[f.fieldName] || ""}
                  onChange={(e) => setFormData({ ...formData, [f.fieldName]: e.target.value })}
                  placeholder={f.fieldName}
                  className="border border-gray-300 rounded-md px-3 py-2 h-11 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-12">
          <button onClick={onClose} className="px-8 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onSave} className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};