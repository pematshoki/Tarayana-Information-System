// const Project = require("../models/projectModel");
// const Beneficiary = require("../models/beneficiaryModel");
// const mongoose = require("mongoose");
// exports.buildReportData = async ({
//   dateFilter,
//   programmes,
//   projects,
//   officers,
//   dzongkhags,
//   include = {}
// }) => {
//   let query = { ...dateFilter };

//   if (programmes?.length) query.programme = { $in: programmes };
//   if (projects?.length) query._id = { $in: projects };
//  if (officers?.length) {
//   const officerIds = officers.map(id => new mongoose.Types.ObjectId(id));
//   query.$or = [
//     { fieldOfficer: { $in: officerIds } },
//     { programmeOfficer: { $in: officerIds } }
//   ];
// }
//   if (dzongkhags?.length) query.dzongkhag = { $in: dzongkhags };

//   const projectList = await Project.find(query)
//     .populate("programme fieldOfficer")
//     .sort({ createdAt: -1 });

//   if (projectList.length === 0) {
//     return { summary: null, groups: [], groupingMode: "programme" };
//   }

//   const beneficiaries = await Beneficiary.find({ 
//     projectId: { $in: projectList.map(p => p._id) } 
//   });

//   // Determine Grouping Mode
//   let groupingMode = "programme";
//   if (officers?.length > 0) groupingMode = "officer";
//   else if (dzongkhags?.length > 0) groupingMode = "dzongkhag";

//   const groupsMap = {};

//   projectList.forEach(p => {
//     let groupKey, groupName;

//     // Logic for dynamic grouping
// if (groupingMode === "officer") {
//   // .find() returns the first element that satisfies the condition 
//   const activeOfficer = [p.fieldOfficer, p.programmeOfficer].find(off => 
//     off && officers.includes(off._id.toString())
//   );

//   // If activeOfficer exists, we use their ID and Name/Email 
//   if (activeOfficer) {
//     groupKey = activeOfficer._id.toString();
//     groupName = activeOfficer.name || activeOfficer.email || "Unnamed Officer";
//   } else {
//     // If no match is found, we skip this project to avoid the "Unknown" group 
//     return; 
//   }
// }if (groupingMode === "officer") {
//   // Check if officers were explicitly selected in the request
//   const isSpecificSelection = officers && officers.length > 0;

//   const activeOfficer = [p.fieldOfficer, p.programmeOfficer].find(off => {
//     if (!off) return false;
//     // If specific officers selected, match them. If "All", take the first assigned officer.
//     return isSpecificSelection ? officers.includes(off._id.toString()) : true;
//   });

//   if (activeOfficer) {
//     groupKey = activeOfficer._id?.toString() || "unassigned";
//     groupName = activeOfficer.name || activeOfficer.email || "Unnamed Officer";
//   } else {
//     // Fallback for "All Officers" mode where a project has NO officers assigned
//     groupKey = "unassigned";
//     groupName = "Unassigned Projects";
//   }

//     } else if (groupingMode === "dzongkhag") {
//       // Safely handle if dzongkhag is an array or a string to prevent .toLowerCase() errors
//       const dzVal = Array.isArray(p.dzongkhag) ? p.dzongkhag[0] : p.dzongkhag;
//       groupKey = String(dzVal || "unknown_dz").toLowerCase();
//       groupName = dzVal || "Unknown Dzongkhag";
//     } else {
//       groupKey = p.programme?._id?.toString() || "unknown_prog";
//       groupName = p.programme?.programmeName || "Unknown Programme";
//     }

//     if (!groupsMap[groupKey]) {
//       groupsMap[groupKey] = {
//         groupTitle: groupName,
//         projects: []
//       };
//     }

//     // Process Activities (Your existing logic)
//     const projBeneficiaries = beneficiaries.filter(b => b.projectId.toString() === p._id.toString());
//     const activityMap = {};
//     projBeneficiaries.forEach(b => {
//       (b.keyActivities || []).forEach(act => {
//         const key = (act.activityName || "Unknown").toLowerCase();
//         if (!activityMap[key]) {
//           activityMap[key] = { name: act.activityName, total: 0, unit: act.unit || "Nos" };
//         }
//         activityMap[key].total += Number(act.totalQuantity) || 0;
//       });
//     });

//     groupsMap[groupKey].projects.push({
//       ...p.toObject(),
//       beneficiaries: projBeneficiaries,
//       projectActivities: Object.values(activityMap)
//     });
//   });

//   // Metadata for Header
// const officerNames = [...new Set(projectList.flatMap(p => [
//   p.fieldOfficer?.name || p.fieldOfficer?.email,
//   p.programmeOfficer?.name || p.programmeOfficer?.email
// ]).filter(Boolean))];

// // Ensure dzongkhagNames doesn't stay "All" if specific ones were picked
// const dzongkhagNames = dzongkhags?.length > 0 ? dzongkhags : [];

//   const summary = beneficiaries.reduce((acc, b) => {
//     acc.totalBeneficiaries++;
//     if (b.gender === 'M') acc.male++;
//     if (b.gender === 'F') acc.female++;
//     return acc;
//   }, { totalProjects: projectList.length, totalBeneficiaries: 0, male: 0, female: 0,totalDzongkhags: [...new Set(beneficiaries.map(b => String(b.dzongkhag || "").toLowerCase()))].filter(Boolean).length});

//   return { 
//     summary, 
//     groups: Object.values(groupsMap), 
//     groupingMode,
//     meta: { officerNames, dzongkhagNames} 
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

  // Strict Dzongkhag filter for projects
  if (dzongkhags?.length) query.dzongkhag = { $in: dzongkhags };

  const projectList = await Project.find(query)
    .populate("programme fieldOfficer")
    .sort({ createdAt: -1 });

  if (projectList.length === 0) {
    return { summary: null, groups: [], groupingMode: "programme" };
  }

  // Strict Beneficiary fetching based on project and selected Dzongkhag
  const beneficiaryQuery = { projectId: { $in: projectList.map(p => p._id) } };
  if (dzongkhags?.length > 0) {
    beneficiaryQuery.dzongkhag = { $in: dzongkhags };
  }
  const beneficiaries = await Beneficiary.find(beneficiaryQuery);

  // Determine Grouping Mode
  let groupingMode = "programme";
  if (officers?.length > 0) groupingMode = "officer";
  else if (dzongkhags?.length > 0) groupingMode = "dzongkhag";

  const groupsMap = {};

  projectList.forEach(p => {
    let groupKey, groupName;

    // RESTORED ORIGINAL OFFICER LOGIC
  if (groupingMode === "officer") {
  const isSpecificSelection = officers && officers.length > 0;

  const activeOfficer = [p.fieldOfficer, p.programmeOfficer].find(off => {
    if (!off) return false;
    return isSpecificSelection
      ? officers.includes(off._id.toString())
      : true;
  });

  // SKIP projects that don't belong to selected officers
  if (!activeOfficer) return;

  groupKey = activeOfficer._id.toString();
  groupName =
    activeOfficer.name ||
    activeOfficer.email ||
    "Unnamed Officer";
}
    // UPDATED DZONGKHAG LOGIC: Uses beneficiary data for headers
    else if (groupingMode === "dzongkhag") {
      const projBeneficiariesInDz = beneficiaries.filter(b => b.projectId.toString() === p._id.toString());
      if (projBeneficiariesInDz.length === 0) return; // Skip if no beneficiaries in selected dzongkhag

      const actualDz = projBeneficiariesInDz[0].dzongkhag;
      groupKey = String(actualDz || "unknown_dz").toLowerCase();
      groupName = actualDz || "Unknown Dzongkhag";
    } 
    else {
      groupKey = p.programme?._id?.toString() || "unknown_prog";
      groupName = p.programme?.programmeName || "Unknown Programme";
    }

    if (!groupsMap[groupKey]) {
      groupsMap[groupKey] = { groupTitle: groupName, projects: [] };
    }

    // Process Activities and Beneficiaries for this specific project
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

  const officerNames = [...new Set(projectList.flatMap(p => [
    p.fieldOfficer?.name || p.fieldOfficer?.email,
    p.programmeOfficer?.name || p.programmeOfficer?.email
  ]).filter(Boolean))];

  const dzongkhagNames = dzongkhags?.length > 0 ? dzongkhags : [];

  const finalGroups = Object.values(groupsMap);
  const displayedBeneficiaries = finalGroups.flatMap(g => g.projects.flatMap(proj => proj.beneficiaries));
  
 const allDisplayedProjects = finalGroups.flatMap(group => group.projects);

  const summary = displayedBeneficiaries.reduce((acc, b) => {
    acc.totalBeneficiaries++;
    if (b.gender === 'M') acc.male++;
    if (b.gender === 'F') acc.female++;
    return acc;
  }, { 
    totalProjects:allDisplayedProjects.length, // Now correctly shows the count from the report rows
    totalBeneficiaries: 0, 
    male: 0, 
    female: 0,
    totalDzongkhags: [...new Set(displayedBeneficiaries.map(b => String(b.dzongkhag || "").toLowerCase()))].filter(Boolean).length
  });
  

  return { 
    summary, 
    groups: Object.values(groupsMap), 
    groupingMode,
    meta: { officerNames, dzongkhagNames } 
  };
};