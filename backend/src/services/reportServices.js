// const Project = require("../models/projectModel");
// const Beneficiary = require("../models/beneficiaryModel");

// exports.buildReportData = async ({
//   dateFilter,
//   scope,
//   programmes,
//   projects,
//   officers,
//   dzongkhags,
//   include
// }) => {

// let query = { ...dateFilter };

// // PROGRAMMES
// if (programmes?.length) {
//   query.programme = { $in: programmes };
// }

// // PROJECTS
// if (projects?.length) {
//   query._id = { $in: projects };
// }

// // OFFICERS
// if (officers?.length) {
//   query.$or = [
//     { fieldOfficer: { $in: officers } },
//     { programmeOfficer: { $in: officers } }
//   ];
// }

// // DZONGKHAGS
// if (dzongkhags?.length) {
//   query.dzongkhag = { $in: dzongkhags };
// }
//   // =========================
//   // ✅ FETCH PROJECTS
//   // =========================
//   const projectList = await Project.find(query)
//     .populate("programme donor fieldOfficer")
//     .sort({ createdAt: -1 });

//   // =========================
//   // ✅ FETCH BENEFICIARIES
//   // =========================
//   const projectIds = projectList.map(p => p._id);

//   const beneficiaries = await Beneficiary.find({
//     projectId: { $in: projectIds }
//   });

//   // =========================
//   // ✅ GROUP DATA (CRITICAL)
//   // =========================
//   const programmesMap = {};

//   projectList.forEach(p => {
//     const progId = p.programme?._id?.toString() || "unknown";

//     if (!programmesMap[progId]) {
//       programmesMap[progId] = {
//         programmeName: p.programme?.programmeName || "Unknown",
//         projects: []
//       };
//     }

//     const projectBeneficiaries = beneficiaries.filter(
//       b => b.projectId.toString() === p._id.toString()
//     );

//     programmesMap[progId].projects.push({
//       ...p.toObject(),
//       beneficiaries: projectBeneficiaries
//     });
//   });

//   const programmesData = Object.values(programmesMap);

//   // =========================
//   // ✅ SUMMARY
//   // =========================
//   let summary = null;

//   if (include.summary) {
//     summary = beneficiaries.reduce(
//       (acc, b) => {
//         acc.totalBeneficiaries++;

//         if (b.gender?.toLowerCase() === "m") acc.male++;
//         if (b.gender?.toLowerCase() === "f") acc.female++;

//         return acc;
//       },
//       {
//         totalProjects: projectList.length,
//         totalBeneficiaries: 0,
//         male: 0,
//         female: 0
//       }
//     );
//   }
// if (projectList.length === 0) {
//   return {
//     summary: include.summary
//       ? {
//           totalProjects: 0,
//           totalBeneficiaries: 0,
//           male: 0,
//           female: 0
//         }
//       : null,
//     programmes: []
//   };
// }
// console.log("FINAL QUERY:", query);
//   return {
//     summary,
//     programmes: programmesData
//   };
// };

const Project = require("../models/projectModel");
const Beneficiary = require("../models/beneficiaryModel");
const mongoose = require("mongoose");
exports.buildReportData = async ({
  dateFilter,
  programmes,
  projects,
  officers,
  dzongkhags,
  include = {}
}) => {
  let query = { ...dateFilter };

  if (programmes?.length) query.programme = { $in: programmes };
  if (projects?.length) query._id = { $in: projects };
 if (officers?.length) {
  const officerIds = officers.map(id => new mongoose.Types.ObjectId(id));
  query.$or = [
    { fieldOfficer: { $in: officerIds } },
    { programmeOfficer: { $in: officerIds } }
  ];
}
  if (dzongkhags?.length) query.dzongkhag = { $in: dzongkhags };

  const projectList = await Project.find(query)
    .populate("programme fieldOfficer")
    .sort({ createdAt: -1 });

  if (projectList.length === 0) {
    return { summary: null, groups: [], groupingMode: "programme" };
  }

  const beneficiaries = await Beneficiary.find({ 
    projectId: { $in: projectList.map(p => p._id) } 
  });

  // Determine Grouping Mode
  let groupingMode = "programme";
  if (officers?.length > 0) groupingMode = "officer";
  else if (dzongkhags?.length > 0) groupingMode = "dzongkhag";

  const groupsMap = {};

  projectList.forEach(p => {
    let groupKey, groupName;

    // Logic for dynamic grouping
if (groupingMode === "officer") {
  // .find() returns the first element that satisfies the condition 
  const activeOfficer = [p.fieldOfficer, p.programmeOfficer].find(off => 
    off && officers.includes(off._id.toString())
  );

  // If activeOfficer exists, we use their ID and Name/Email 
  if (activeOfficer) {
    groupKey = activeOfficer._id.toString();
    groupName = activeOfficer.name || activeOfficer.email || "Unnamed Officer";
  } else {
    // If no match is found, we skip this project to avoid the "Unknown" group 
    return; 
  }
}if (groupingMode === "officer") {
  // Check if officers were explicitly selected in the request
  const isSpecificSelection = officers && officers.length > 0;

  const activeOfficer = [p.fieldOfficer, p.programmeOfficer].find(off => {
    if (!off) return false;
    // If specific officers selected, match them. If "All", take the first assigned officer.
    return isSpecificSelection ? officers.includes(off._id.toString()) : true;
  });

  if (activeOfficer) {
    groupKey = activeOfficer._id?.toString() || "unassigned";
    groupName = activeOfficer.name || activeOfficer.email || "Unnamed Officer";
  } else {
    // Fallback for "All Officers" mode where a project has NO officers assigned
    groupKey = "unassigned";
    groupName = "Unassigned Projects";
  }

    } else if (groupingMode === "dzongkhag") {
      groupKey = p.dzongkhag || "unknown_dz";
      groupName = p.dzongkhag || "Unknown Dzongkhag";
    } else {
      groupKey = p.programme?._id?.toString() || "unknown_prog";
      groupName = p.programme?.programmeName || "Unknown Programme";
    }

    if (!groupsMap[groupKey]) {
      groupsMap[groupKey] = {
        groupTitle: groupName,
        projects: []
      };
    }

    // Process Activities (Your existing logic)
    const projBeneficiaries = beneficiaries.filter(b => b.projectId.toString() === p._id.toString());
    const activityMap = {};
    projBeneficiaries.forEach(b => {
      (b.keyActivities || []).forEach(act => {
        const key = (act.activityName || "Unknown").toLowerCase();
        if (!activityMap[key]) {
          activityMap[key] = { name: act.activityName, total: 0, unit: act.unit || "Nos" };
        }
        activityMap[key].total += Number(act.totalQuantity) || 0;
      });
    });

    groupsMap[groupKey].projects.push({
      ...p.toObject(),
      beneficiaries: projBeneficiaries,
      projectActivities: Object.values(activityMap)
    });
  });

  // Metadata for Header
const officerNames = [...new Set(projectList.flatMap(p => [
  p.fieldOfficer?.name || p.fieldOfficer?.email,
  p.programmeOfficer?.name || p.programmeOfficer?.email
]).filter(Boolean))];

// Ensure dzongkhagNames doesn't stay "All" if specific ones were picked
const dzongkhagNames = dzongkhags?.length > 0 ? dzongkhags : [];

  const summary = beneficiaries.reduce((acc, b) => {
    acc.totalBeneficiaries++;
    if (b.gender === 'M') acc.male++;
    if (b.gender === 'F') acc.female++;
    return acc;
  }, { totalProjects: projectList.length, totalBeneficiaries: 0, male: 0, female: 0 });

  return { 
    summary, 
    groups: Object.values(groupsMap), 
    groupingMode,
    meta: { officerNames, dzongkhagNames} 
  };
};