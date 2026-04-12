

import { useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Search, User } from "lucide-react";

const Beneficiaries = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const data = [
    ...Array(25).fill({
      cid: "11605003464",
      name: "Phuntsho Wangmo",
      dob: "1995-05-10",
      dzongkhag: "Thimphu",
      village: "Changzamtog",
      gewog: "Kawang",
      houseNo: "H-12",
      thramNo: "T-456",
      phone: "17123456",
      project: "Housing Improvement",
      male: 2,
      female: 3,
      support: "Financial assistance",
    }),
  ];

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.cid.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

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

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`transition-all duration-300 ${
          collapsed ? "md:ml-[75px]" : "md:ml-[265px]"
        }`}
      >
        <Navbar collapsed={collapsed} />

        <div className="p-6 pt-20 space-y-6 ">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
              Beneficiaries
            </h1>
            <p className="text-sm text-gray-500">
              Beneficiary records & households
            </p>
          </div>

          {/* Search */}
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
            {currentData.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-4">
                <p className="text-blue-600 font-semibold">{item.cid}</p>
                <h2 className="text-gray-800 font-medium">{item.name}</h2>

                <div className="text-sm text-gray-500 mt-2 space-y-1">
                  <p>DOB: {item.dob}</p>
                  <p>{item.dzongkhag}, {item.village}, {item.gewog}</p>
                  <p>House: {item.houseNo} | Thram: {item.thramNo}</p>
                  <p>Phone: {item.phone}</p>
                  <p>Project: {item.project}</p>
                  <p>Indirect: M({item.male}) F({item.female})</p>
                  <p className="italic">Support: {item.support}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden sm:block bg-white rounded-xl shadow overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Header */}
              <div className="grid grid-cols-12 px-6 py-4 text-sm font-semibold text-gray-600 border-b">
                <span>CID</span>
                <span>Name</span>
                <span>DOB</span>
                <span>Dzongkhag</span>
                <span>Village</span>
                <span>Gewog</span>
                <span>House No</span>
                <span>Thram No</span>
                <span>Phone</span>
                <span>Project</span>
                <span>Indirect</span>
                <span>Support</span>
              </div>

              {/* Rows */}
              <div className="divide-y">
                {currentData.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 px-6 py-4 text-sm items-center hover:bg-gray-50"
                  >
                    <span className="text-blue-600 font-medium">{item.cid}</span>

                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span>{item.name}</span>
                    </div>

                    <span>{item.dob}</span>
                    <span>{item.dzongkhag}</span>
                    <span>{item.village}</span>
                    <span>{item.gewog}</span>
                    <span>{item.houseNo}</span>
                    <span>{item.thramNo}</span>
                    <span>{item.phone}</span>
                    <span>{item.project}</span>
                    <span>M:{item.male} F:{item.female}</span>
                    <span className="truncate">{item.support}</span>
                  </div>
                ))}
              </div>

              {/* Pagination */}
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