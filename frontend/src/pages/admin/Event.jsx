

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, CalendarDays, Eye, Pencil, Trash2 } from "lucide-react";

const Event = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [event, setEvent] = useState(location.state?.event || null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  const [editIndex, setEditIndex] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  if (!event) return <div className="p-6">No Event Found</div>;

  // CREATE
  const handleSave = () => {
    const newEntry = {};
    event.fields.forEach((f) => {
      newEntry[f.name] = formData[f.name] || "";
    });

    setEvent({ ...event, entries: [...event.entries, newEntry] });
    setShowForm(false);
    setFormData({});
  };

  // EDIT
  const handleEditSave = () => {
    const updated = [...event.entries];
    updated[editIndex] = formData;

    setEvent({ ...event, entries: updated });
    setShowEdit(false);
    setFormData({});
  };

  // DELETE
  const handleDelete = () => {
    const updated = event.entries.filter((_, i) => i !== deleteIndex);
    setEvent({ ...event, entries: updated });
    setShowDelete(false);
  };

  return (
    <div className="space-y-6">

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
              Add {event.name}
            </button>
          </div>

          {/* TITLE */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              <CalendarDays className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold">{event.name}</h2>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-center w-16">Sl no.</th>

                  {event.fields.map((f) => (
                    <th key={f.name} className="px-4 py-3">
                      {f.name}
                    </th>
                  ))}

                  <th className="px-4 py-3 text-center w-32">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {event.entries.length === 0 ? (
                  <tr>
                    <td colSpan="100%" className="text-center p-6 text-gray-400">
                      No entries yet.
                    </td>
                  </tr>
                ) : (
                  event.entries.map((entry, i) => (
                    <tr
                      key={i}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 text-center">{i + 1}</td>

                      {event.fields.map((f) => (
                        <td key={f.name} className="px-4 py-3">
                          {entry[f.name]}
                        </td>
                      ))}

                      {/* ACTION */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-4">
                          <Eye
                            size={18}
                            className="text-blue-500 cursor-pointer"
                            onClick={() =>
                              navigate("/event-detail", {
                                state: { entry, event },
                              })
                            }
                          />

                          <Pencil
                            size={18}
                            className="text-gray-600 cursor-pointer"
                            onClick={() => {
                              setEditIndex(i);
                              setFormData(entry);
                              setShowEdit(true);
                            }}
                          />

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

      {/* ================= ADD MODAL ================= */}
      {showForm && (
        <Modal
          title={`Create ${event.name}`}
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
          title={`Edit ${event.name}`}
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
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl p-8 shadow-lg relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-6">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-2">

              <label className="text-sm font-medium">
                {f.name}
              </label>

              <input
                type={
                  f.type === "Date"
                    ? "date"
                    : f.type === "Number"
                    ? "number"
                    : "text"
                }
                value={formData[f.name] || ""}
                placeholder={`Enter ${f.name}`}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [f.name]: e.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};