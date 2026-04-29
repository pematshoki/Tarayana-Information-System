const Project = require("../models/projectModel");
const Beneficiary = require("../models/beneficiaryModel");

exports.buildReportData = async ({
  dateFilter,
  scope,
  programmes,
  projects,
  officers,
  dzongkhags,
  include
}) => {

let query = { ...dateFilter };

// PROGRAMMES
if (programmes?.length) {
  query.programme = { $in: programmes };
}

// PROJECTS
if (projects?.length) {
  query._id = { $in: projects };
}

// OFFICERS
if (officers?.length) {
  query.$or = [
    { fieldOfficer: { $in: officers } },
    { programmeOfficer: { $in: officers } }
  ];
}

// DZONGKHAGS
if (dzongkhags?.length) {
  query.dzongkhag = { $in: dzongkhags };
}
  // =========================
  // ✅ FETCH PROJECTS
  // =========================
  const projectList = await Project.find(query)
    .populate("programme donor fieldOfficer")
    .sort({ createdAt: -1 });

  // =========================
  // ✅ FETCH BENEFICIARIES
  // =========================
  const projectIds = projectList.map(p => p._id);

  const beneficiaries = await Beneficiary.find({
    projectId: { $in: projectIds }
  });

  // =========================
  // ✅ GROUP DATA (CRITICAL)
  // =========================
  const programmesMap = {};

  projectList.forEach(p => {
    const progId = p.programme?._id?.toString() || "unknown";

    if (!programmesMap[progId]) {
      programmesMap[progId] = {
        programmeName: p.programme?.programmeName || "Unknown",
        projects: []
      };
    }

    const projectBeneficiaries = beneficiaries.filter(
      b => b.projectId.toString() === p._id.toString()
    );

    programmesMap[progId].projects.push({
      ...p.toObject(),
      beneficiaries: projectBeneficiaries
    });
  });

  const programmesData = Object.values(programmesMap);

  // =========================
  // ✅ SUMMARY
  // =========================
  let summary = null;

  if (include.summary) {
    summary = beneficiaries.reduce(
      (acc, b) => {
        acc.totalBeneficiaries++;

        if (b.gender?.toLowerCase() === "m") acc.male++;
        if (b.gender?.toLowerCase() === "f") acc.female++;

        return acc;
      },
      {
        totalProjects: projectList.length,
        totalBeneficiaries: 0,
        male: 0,
        female: 0
      }
    );
  }
if (projectList.length === 0) {
  return {
    summary: include.summary
      ? {
          totalProjects: 0,
          totalBeneficiaries: 0,
          male: 0,
          female: 0
        }
      : null,
    programmes: []
  };
}
console.log("FINAL QUERY:", query);
  return {
    summary,
    programmes: programmesData
  };
};