

import { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Search, User } from "lucide-react";

const Beneficiaries = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const [beneficiaries, setBeneficiaries] = useState([]);
  const itemsPerPage = 10;
useEffect(() => {
  fetchAllBeneficiaries();
}, []);
  
const filteredData = useMemo(() => {
  return beneficiaries.filter((item) =>
    item.cid.toLowerCase().includes(search.toLowerCase())
  );
}, [search, beneficiaries]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [currentPage, filteredData]);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const fetchAllBeneficiaries = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/beneficiaries", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) return;

    setBeneficiaries(data.data);

  } catch (err) {
    console.error(err);
  }
};


  return (
  <div className="bg-gray-100 min-h-screen">
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

    <div
      className={`transition-all duration-300 ${
        collapsed ? "md:ml-[75px]" : "md:ml-[265px]"
      }`}
    >
      <Navbar collapsed={collapsed} />

      <div className="p-6 pt-20 space-y-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            Beneficiaries
          </h1>
          <p className="text-sm text-gray-500">
            Beneficiary records & households
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by CID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* ================= MOBILE VIEW ================= */}
        <div className="sm:hidden space-y-4">
          {currentData.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl shadow-sm p-4">

              <p className="text-blue-600 font-semibold">{item.cid}</p>
              <h2 className="text-gray-800 font-medium">{item.name}</h2>

              <div className="text-sm text-gray-500 mt-2 space-y-1">

                <p>Year: {item.year}</p>
<p>
 {item.gender === "M" 
    ? "Male" 
    : item.gender === "F" 
      ? "Female" 
      : "N/A"}
</p>

                <p>
                  Location: {item.dzongkhag}, {item.gewog}, {item.village}
                </p>

                <p>
                  House: {item.houseNo} | Thram: {item.thramNo}
                </p>

                <p>
                  Project: {item.projectId?.projectName || "N/A"}
                </p>

                <p>
                  Indirect: M({item.indirectBeneficiaries?.male ?? 0}) 
                  F({item.indirectBeneficiaries?.female ?? 0})
                </p>

                <p className="italic">
                  Activities:{" "}
                  {item.keyActivities?.map((a) => a.activityName).join(", ") || "N/A"}
                </p>

              </div>
            </div>
          ))}
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden sm:block bg-white rounded-xl shadow overflow-x-auto">

          <div className="min-w-[1200px]">

            {/* HEADER */}
            <div className="grid grid-cols-12 px-6 py-4 text-sm font-semibold text-gray-600 border-b">
              <span>CID</span>
              <span>Name</span>
              <span>Year</span>
              <span>Dzongkhag</span>
              <span>Gewog</span>
              <span>Village</span>
              <span>House</span>
              <span>Thram</span>
              <span>Project</span>
              <span>Gender</span>
              <span>Indirect</span>
              <span>Activities</span>
            </div>

            {/* ROWS */}
            <div className="divide-y">
              {currentData.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-12 px-6 py-4 text-sm items-center hover:bg-gray-50"
                >

                  <span className="text-blue-600 font-medium">
                    {item.cid}
                  </span>

                  <span className="flex items-center gap-2">
                    <User size={14} />
                    {item.name}
                  </span>

                  <span>{item.year}</span>
                  <span>{item.dzongkhag}</span>
                  <span>{item.gewog}</span>
                  <span>{item.village}</span>
                  <span>{item.houseNo}</span>
                  <span>{item.thramNo}</span>

                  <span>
                    {item.projectId?.projectName || "N/A"}
                  </span>

<p>
  {item.gender === "M" 
    ? "Male" 
    : item.gender === "F" 
      ? "Female" 
      : "N/A"}
</p>

                  <span>
                    M:{item.indirectBeneficiaries?.male ?? 0}{" "}
                    F:{item.indirectBeneficiaries?.female ?? 0}
                  </span>

                  <span className="truncate">
                    {item.keyActivities?.map((a) => a.activityName).join(", ") || "N/A"}
                  </span>

                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-end items-center gap-4 px-6 py-4 text-sm text-gray-500">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="disabled:opacity-40"
              >
                {"<"}
              </button>

              <span className="font-medium text-gray-700">
                {currentPage}
              </span>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="disabled:opacity-40"
              >
                {">"}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
);
};

export default Beneficiaries;