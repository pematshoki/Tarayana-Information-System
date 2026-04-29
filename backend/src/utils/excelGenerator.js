// const ExcelJS = require("exceljs");
// const fs = require("fs");
// const path = require("path");

// exports.generateExcel = async (
//   res,
//   data = {},
//   year,
//   meta = {}
// ) => {
//   const workbook = new ExcelJS.Workbook();
//   const sheet = workbook.addWorksheet("Report");

//   const programmes = data.programmes || [];
//   const summary = data.summary || {};

//   // =========================
//   // 🔷 HEADER
//   // =========================
//   sheet.mergeCells("A1:F1");
//   sheet.getCell("A1").value = "Tarayana Foundation";
//   sheet.getCell("A1").font = { size: 16, bold: true };
//   sheet.getCell("A1").alignment = { horizontal: "center" };

//   sheet.mergeCells("A2:F2");
//   sheet.getCell("A2").value = '"Service from the Heart"';
//   sheet.getCell("A2").alignment = { horizontal: "center" };

//   sheet.mergeCells("A3:F3");
//   sheet.getCell("A3").value = `Tarayana Report ${year}`;
//   sheet.getCell("A3").font = { size: 14 };
//   sheet.getCell("A3").alignment = { horizontal: "center" };

//   // =========================
//   // 🔷 SUBTITLE (same logic as PDF)
//   // =========================
//   let subtitle = "";

//   if (meta.type === "quarterly" && meta.fromDate && meta.toDate) {
//     subtitle += `Period: ${meta.fromDate} to ${meta.toDate}`;
//   } else if (meta.type === "annual") {
//     subtitle += `Year: ${meta.year}`;
//   }

//   if (meta.isAllProgrammes) {
//     subtitle += " | All Programmes";
//   } else {
//     const names = (meta.programmeNames || []).slice(0, 3).join(", ");
//     const more =
//       meta.programmeNames?.length > 3
//         ? ` +${meta.programmeNames.length - 3} more`
//         : "";
//     subtitle += ` | Programmes: ${names}${more}`;
//   }

//   if (meta.isAllProjects) {
//     subtitle += " | All Projects";
//   } else {
//     const names = (meta.projectNames || []).slice(0, 3).join(", ");
//     const more =
//       meta.projectNames?.length > 3
//         ? ` +${meta.projectNames.length - 3} more`
//         : "";
//     subtitle += ` | Projects: ${names}${more}`;
//   }

//   sheet.mergeCells("A4:F4");
//   sheet.getCell("A4").value = subtitle;
//   sheet.getCell("A4").alignment = { horizontal: "center" };

//   let rowIndex = 6;

//   // =========================
//   // 🔷 NO DATA CASE
//   // =========================
//   if (!programmes.length) {
//     sheet.mergeCells(`A${rowIndex}:F${rowIndex}`);
//     sheet.getCell(`A${rowIndex}`).value = "No data available for selected timeline";
//     sheet.getCell(`A${rowIndex}`).alignment = { horizontal: "center" };

//     return sendFile(res, workbook, year);
//   }

//   // =========================
//   // 🔷 SUMMARY
//   // =========================
//   sheet.getCell(`A${rowIndex}`).value = "Summary";
//   sheet.getCell(`A${rowIndex}`).font = { bold: true };

//   rowIndex++;

//   sheet.addRow([
//     "Total Projects",
//     summary.totalProjects || 0,
//     "Total Beneficiaries",
//     summary.totalBeneficiaries || 0,
//   ]);

//   sheet.addRow([
//     "Male",
//     summary.male || 0,
//     "Female",
//     summary.female || 0,
//   ]);

//   rowIndex += 2;

//   // =========================
//   // 🔷 DATA TABLE
//   // =========================
//   programmes.forEach((programme) => {
//     sheet.getCell(`A${rowIndex}`).value = `Programme: ${programme.programmeName}`;
//     sheet.getCell(`A${rowIndex}`).font = { bold: true };
//     rowIndex++;

//     (programme.projects || []).forEach((project) => {
//       sheet.getCell(`A${rowIndex}`).value = `Project: ${project.projectName}`;
//       sheet.getCell(`A${rowIndex}`).font = { italic: true };
//       rowIndex++;

//       // TABLE HEADER
//       sheet.addRow([
//         "CID",
//         "Name",
//         "Gender",
//         "Dzongkhag",
//         "Village",
//         "Indirect",
//       ]);

//       const headerRow = sheet.getRow(rowIndex);
//       headerRow.font = { bold: true };
//       rowIndex++;

//       if (!project.beneficiaries || project.beneficiaries.length === 0) {
//         sheet.addRow(["No beneficiaries"]);
//         rowIndex += 2;
//         return;
//       }

//       project.beneficiaries.forEach((b) => {
//         const indirect =
//           (b.indirectBeneficiaries?.male || 0) +
//           (b.indirectBeneficiaries?.female || 0);

//         sheet.addRow([
//           b.cid || "-",
//           b.name || "-",
//           b.gender || "-",
//           b.dzongkhag || "-",
//           b.village || "-",
//           indirect,
//         ]);

//         rowIndex++;
//       });

//       rowIndex++;
//     });

//     rowIndex++;
//   });

//   // =========================
//   // 🔷 AUTO WIDTH
//   // =========================
//   sheet.columns.forEach((col) => {
//     col.width = 20;
//   });

//   // =========================
//   // 🔷 SEND FILE
//   // =========================
//   return sendFile(res, workbook, year);
// };

// // =========================
// // 🔷 HELPER
// // =========================
// async function sendFile(res, workbook, year,meta={} ) {
//   const filename = `Report_${Date.now()}_${year}.xlsx`;
//   const filePath = path.join(__dirname, "../public/reports", filename);

//   // =========================
//   // 1. WRITE TO FILE
//   // =========================
//   const fileStream = fs.createWriteStream(filePath);

//   await workbook.xlsx.write(fileStream);

//   await new Promise((resolve, reject) => {
//     fileStream.on("finish", resolve);
//     fileStream.on("error", reject);
//   });

//   // =========================
//   // 2. SAVE TO DATABASE (FIXED)
//   // =========================
//   try {
//     const Report = require("../models/reportModel"); // IMPORTANT: ensure import exists
// console.log(type)
//    const reportTitle =
//   type === "annual"
//     ? `Annual Report ${year}`
//     : `Quarterly Report ${year}`;

// await Report.create({
//   title: reportTitle,
//   type: type,
//   year,
//   fileUrl: `/reports/${filename}`,
//   createdAt: new Date(),
// });
//   } catch (err) {
//     console.error("Failed to save report metadata:", err);
//   }

//   // =========================
//   // 3. SEND RESPONSE (ONLY ONCE)
//   // =========================
//   res.setHeader(
//     "Content-Type",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//   );

//   res.setHeader(
//     "Content-Disposition",
//     `attachment; filename=Report_${year}.xlsx`
//   );

//   await workbook.xlsx.write(res);
//   res.end();
// }
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const Report = require("../models/reportModel");

exports.generateExcel = async (
  res,
  programmes = [], 
  year,           
  summary = {},    
  meta = {}        
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");

  // =========================
  // 🔷 HEADER
  // =========================
  sheet.mergeCells("A1:F1");
  sheet.getCell("A1").value = "Tarayana Foundation";
  sheet.getCell("A1").font = { size: 16, bold: true };
  sheet.getCell("A1").alignment = { horizontal: "center" };

  sheet.mergeCells("A2:F2");
  sheet.getCell("A2").value = '"Service from the Heart"';
  sheet.getCell("A2").alignment = { horizontal: "center" };

  sheet.mergeCells("A3:F3");
  // FIX: Using 'year' variable passed from controller
  sheet.getCell("A3").value = `Tarayana Report ${year}`;
  sheet.getCell("A3").font = { size: 14 };
  sheet.getCell("A3").alignment = { horizontal: "center" };

  // =========================
  // 🔷 SUBTITLE LOGIC (FIXED)
  // =========================
  let subtitle = "";

  if (meta.type === "quarterly" && meta.fromDate && meta.toDate) {
    subtitle += `Period: ${meta.fromDate} to ${meta.toDate}`;
  } else {
    subtitle += `Year: ${year}`; // Use the direct year variable
  }

  // Programme Name Display Logic
  if (meta.isAllProgrammes || !meta.programmeNames || meta.programmeNames.length === 0) {
    subtitle += " | All Programmes";
  } else {
    const names = meta.programmeNames.slice(0, 3).join(", ");
    const more = meta.programmeNames.length > 3 ? ` +${meta.programmeNames.length - 3} more` : "";
    subtitle += ` | Programmes: ${names}${more}`;
  }

  // Project Name Display Logic
  if (meta.isAllProjects || !meta.projectNames || meta.projectNames.length === 0) {
    subtitle += " | All Projects";
  } else {
    const names = meta.projectNames.slice(0, 3).join(", ");
    const more = meta.projectNames.length > 3 ? ` +${meta.projectNames.length - 3} more` : "";
    subtitle += ` | Projects: ${names}${more}`;
  }

  sheet.mergeCells("A4:F4");
  sheet.getCell("A4").value = subtitle;
  sheet.getCell("A4").alignment = { horizontal: "center" };

  let rowIndex = 6;

  // =========================
  // 🔷 NO DATA CASE
  // =========================
  if (!programmes || programmes.length === 0) {
    sheet.mergeCells(`A${rowIndex}:F${rowIndex}`);
    sheet.getCell(`A${rowIndex}`).value = "No data available for selected timeline";
    sheet.getCell(`A${rowIndex}`).alignment = { horizontal: "center" };

    return sendFile(res, workbook, year, meta);
  }

  // =========================
  // 🔷 SUMMARY
  // =========================
  sheet.getCell(`A${rowIndex}`).value = "Summary";
  sheet.getCell(`A${rowIndex}`).font = { bold: true };
  rowIndex++;

  sheet.addRow(["Total Projects", summary.totalProjects || 0, "Total Beneficiaries", summary.totalBeneficiaries || 0]);
  sheet.addRow(["Male", summary.male || 0, "Female", summary.female || 0]);
  rowIndex += 2;

  // =========================
  // 🔷 DATA TABLE
  // =========================
  programmes.forEach((programme) => {
    sheet.getCell(`A${rowIndex}`).value = `Programme: ${programme.programmeName}`;
    sheet.getCell(`A${rowIndex}`).font = { bold: true };
    rowIndex++;

    (programme.projects || []).forEach((project) => {
      sheet.getCell(`A${rowIndex}`).value = `Project: ${project.projectName}`;
      sheet.getCell(`A${rowIndex}`).font = { italic: true };
      rowIndex++;

      sheet.addRow(["CID", "Name", "Gender", "Dzongkhag", "Village", "Indirect"]);
      sheet.getRow(rowIndex).font = { bold: true };
      rowIndex++;

      if (!project.beneficiaries || project.beneficiaries.length === 0) {
        sheet.addRow(["No beneficiaries"]);
        rowIndex += 2;
        return;
      }

      project.beneficiaries.forEach((b) => {
        const indirect = (b.indirectBeneficiaries?.male || 0) + (b.indirectBeneficiaries?.female || 0);
        sheet.addRow([b.cid || "-", b.name || "-", b.gender || "-", b.dzongkhag || "-", b.village || "-", indirect]);
        rowIndex++;
      });
      rowIndex++;
    });
    rowIndex++;
  });

  sheet.columns.forEach((col) => { col.width = 20; });

  return sendFile(res, workbook, year, meta);
};

// =========================
// 🔷 SEND FILE HELPER
// =========================
async function sendFile(res, workbook, year, meta = {}) {
  // Use the 'year' passed in to ensure it's not undefined in filename
  const filename = `Report_${Date.now()}_${year}.xlsx`;
  const filePath = path.join(__dirname, "../public/reports", filename);
  
  const type = meta.type || "annual";

  const fileStream = fs.createWriteStream(filePath);
  await workbook.xlsx.write(fileStream);

  await new Promise((resolve, reject) => {
    fileStream.on("finish", resolve);
    fileStream.on("error", reject);
  });

  try {
    const reportTitle = type === "annual" ? `Annual Report ${year}` : `Quarterly Report ${year}`;

    await Report.create({
      title: reportTitle,
      type: type,
      year: year,
      fileUrl: `/reports/${filename}`,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Failed to save report metadata:", err);
  }

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename=Report_${year}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
}