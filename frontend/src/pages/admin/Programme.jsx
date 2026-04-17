import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, FileText, X } from "lucide-react";

const Programme = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const navigate = useNavigate();

  const programmesData = [
    { id: 1, name: "Social Development", projects: 12 },
    { id: 2, name: "Economic Development", projects: 12 },
    { id: 3, name: "Environment & Climate", projects: 12 },
    { id: 4, name: "Research", projects: 12 },
    { id: 5, name: "Advocacy & Network", projects: 12 },
    { id: 6, name: "Tarayana Clubs", projects: 12 },
  ];

  // ✅ FILTER
  const filteredProgrammes = programmesData.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!formData.name.trim() || !formData.description.trim()) return;

    setShowModal(false);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 2500);

    setFormData({ name: "", description: "" });
  };

  return (
    <div className="space-y-6">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search Programmes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="ml-4 bg-blue-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus size={18} /> New Programme
            </button>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProgrammes.map((prog) => (
              <div
                key={prog.id}
                onClick={() => navigate(`/programmes/${prog.id}`)}
                className="bg-white rounded-xl p-6 shadow cursor-pointer hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                    <FileText />
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {prog.projects} projects
                  </span>
                </div>

                <h3 className="font-semibold text-gray-700">
                  {prog.name}
                </h3>
              </div>
            ))}
          </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-500"
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Add New Programme
            </h2>

            <input
              type="text"
              placeholder="Programme Name"
              className="w-full border rounded-lg p-2 mb-3"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              className="w-full border rounded-lg p-2 mb-4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                + Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center w-[400px]">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full inline-block mb-4">
              <FileText size={30} />
            </div>

            <h3 className="font-semibold text-lg">
              Programme Added Successfully
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              The programme has been successfully created.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programme;