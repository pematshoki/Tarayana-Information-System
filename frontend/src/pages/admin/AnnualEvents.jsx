


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CalendarDays, X } from "lucide-react";

const AnnualEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [eventName, setEventName] = useState("");
  const [fields, setFields] = useState([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("Text");

  const [deleteEvent, setDeleteEvent] = useState(null);

  // ADD FIELD
  const addField = () => {
    if (!fieldName) return;
    setFields([...fields, { name: fieldName, type: fieldType }]);
    setFieldName("");
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  // CREATE EVENT
  const createEvent = () => {
    if (!eventName || fields.length === 0) return;

    const newEvent = {
      id: Date.now().toString(),
      name: eventName,
      fields,
      entries: [],
    };

    setEvents([...events, newEvent]);
    setShowCreate(false);
    setShowSuccess(true);

    setEventName("");
    setFields([]);

    setTimeout(() => setShowSuccess(false), 2000);
  };

  // DELETE EVENT
  const confirmDelete = () => {
    setEvents(events.filter((e) => e.id !== deleteEvent.id));
    setDeleteEvent(null);
  };

  return (
    <div className="space-y-6">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Annual Events
              </h2>
              <p className="text-sm text-gray-500">
                Manage annual events & activities
              </p>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl shadow"
            >
              <Plus size={16} />
              Create New Event
            </button>
          </div>

          {/* EMPTY STATE */}
          {events.length === 0 && (
            <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
              No events created yet.
            </div>
          )}

          {/* CARDS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="relative bg-white rounded-xl p-6 flex items-center gap-4 cursor-pointer shadow hover:shadow-md transition"
                onClick={() =>
                  navigate(`/events/${event.id}`, { state: { event } })
                }
              >
                {/* DELETE BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteEvent(event);
                  }}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                >
                  <X size={16} />
                </button>

                <div className="bg-blue-100 p-3 rounded-xl">
                  <CalendarDays className="text-blue-600" />
                </div>

                <p className="font-medium text-gray-800">
                  {event.name}
                </p>
              </div>
            ))}
          </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 space-y-5 shadow-lg relative">

            <button
              onClick={() => setShowCreate(false)}
              className="absolute top-4 right-4 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold">Create New Event</h2>

            <input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter Event Name"
              className="w-full border p-3 rounded-lg"
            />

            {/* FIELDS */}
            <div>
              <p className="text-sm font-medium mb-2">Custom Fields</p>

              {fields.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border rounded-lg px-3 py-2 mb-2"
                >
                  <span>{f.name} ({f.type})</span>
                  <X onClick={() => removeField(i)} size={16} />
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  placeholder="Field Name"
                  className="flex-1 border p-2 rounded"
                />

                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value)}
                  className="border p-2 rounded"
                >
                  <option>Text</option>
                  <option>Number</option>
                  <option>Date</option>
                </select>

                <button onClick={addField} className="bg-gray-200 px-4 rounded">
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={createEvent}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow"
              >
                + Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteEvent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-lg">

            <h2 className="text-lg font-semibold">
              Are you sure you want to delete this event?
            </h2>

            <p className="text-gray-500 text-sm">
              This will permanently remove{" "}
              <span className="font-semibold">{deleteEvent.name}</span>.
            </p>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteEvent(null)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-5 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS */}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Text */}
      <h2 className="text-xl font-semibold text-gray-700">
        Event Created Successfully
      </h2>
      <p className="text-gray-500 mt-2 text-sm">
        Your event has been added.
      </p>
    </div>
  </div>
)}
    </div>
  );
};

export default AnnualEvents;




