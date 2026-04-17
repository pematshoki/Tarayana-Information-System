const Project = require("../models/projectModel");
const Beneficiary = require("../models/beneficiaryModel");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const generatePDF = (res, projects, beneficiaries, summary) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

  doc.pipe(res);

  doc.fontSize(18).text("Programme Report", { align: "center" });

  doc.moveDown();
  doc.text(`Total Projects: ${summary.totalProjects}`);
  doc.text(`Total Beneficiaries: ${summary.totalBeneficiaries}`);
  doc.text(`Male: ${summary.male}`);
  doc.text(`Female: ${summary.female}`);

  doc.moveDown();
  doc.text("Projects:", { underline: true });

  projects.forEach(p => {
    doc.text(`- ${p.projectName} (${p.dzongkhag})`);
  });

  doc.end();
};
const generateExcel = async (res, projects, beneficiaries, summary) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");

  sheet.addRow(["Total Projects", summary.totalProjects]);
  sheet.addRow(["Total Beneficiaries", summary.totalBeneficiaries]);
  sheet.addRow(["Male", summary.male]);
  sheet.addRow(["Female", summary.female]);

  sheet.addRow([]);

  sheet.addRow(["Projects"]);
  sheet.addRow(["Name", "Dzongkhag", "Programme"]);

  projects.forEach(p => {
    sheet.addRow([
      p.projectName,
      p.dzongkhag,
      p.programme?.programmeName
    ]);
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=report.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
};

// exports.generateReport = async (req, res) => {
//   try {
//     const {
//       type,
//       year,
//       fromDate,
//       toDate,
//       programmes,
//       projects,
//       officers,
//       dzongkhags,
//       format
//     } = req.body;

//     // 🔷 DATE FILTER
//     let dateFilter = {};
//     if (type === "quarterly") {
//       dateFilter = {
//         startDate: {
//           $gte: new Date(year, fromDate - 1, 1),
//           $lte: new Date(year, toDate, 0)
//         }
//       };
//     } else {
//       dateFilter = {
//         startDate: {
//           $gte: new Date(year, 0, 1),
//           $lte: new Date(year, 11, 31)
//         }
//       };
//     }

//     // 🔷 BASE QUERY
//     let query = { ...dateFilter };

//     if (programmes?.length) {
//       query.programme = { $in: programmes };
//     }

//     if (projects?.length) {
//       query._id = { $in: projects };
//     }

//     if (officers?.length) {
//       query.fieldOfficer = { $in: officers };
//     }

//     if (dzongkhags?.length) {
//       query.dzongkhag = { $in: dzongkhags };
//     }

//     // 🔷 FETCH PROJECTS
//     const projectList = await Project.find(query)
//       .populate("programme donor fieldOfficer");

//     const projectIds = projectList.map(p => p._id);

//     // 🔷 FETCH BENEFICIARIES
//     const beneficiaries = await Beneficiary.find({
//       projectId: { $in: projectIds }
//     });

//     // 🔷 BUILD SUMMARY
//     const summary = {
//       totalProjects: projectList.length,
//       totalBeneficiaries: beneficiaries.length,
//       male: beneficiaries.filter(b => b.gender === "m").length,
//       female: beneficiaries.filter(b => b.gender === "f").length
//     };

//     // 🔷 FORMAT RESPONSE
//     if (format === "pdf") {
//       return generatePDF(res, projectList, beneficiaries, summary);
//     }

//     if (format === "excel") {
//       return generateExcel(res, projectList, beneficiaries, summary);
//     }

//     res.json({ projectList, beneficiaries, summary });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.generateReport = async (req, res) => {
  try {
    const {
      type, // "custom" or "yearly"
      year,
      fromDate,
      toDate,
      programmes = [],
      projects = [],
      officers = [],
      dzongkhags = [],
      format
    } = req.body;

    // =========================
    // ✅ DATE FILTER (SAFE)
    // =========================
    let dateFilter = {};

    if (type === "custom") {
      if (!fromDate || !toDate) {
        return res.status(400).json({
          message: "fromDate and toDate are required",
        });
      }

      const start = new Date(fromDate);
      const end = new Date(toDate);

      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({
          message: "Invalid date format. Use YYYY-MM-DD",
        });
      }

      end.setHours(23, 59, 59, 999);

      dateFilter = {
        startDate: {
          $gte: start,
          $lte: end,
        },
      };
    }

    if (type === "yearly") {
      if (!year) {
        return res.status(400).json({
          message: "Year is required for yearly report",
        });
      }

      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31`);
      end.setHours(23, 59, 59, 999);

      dateFilter = {
        startDate: {
          $gte: start,
          $lte: end,
        },
      };
    }

    // =========================
    // ✅ BASE QUERY
    // =========================
    let query = { ...dateFilter };

    if (programmes.length > 0) {
      query.programme = { $in: programmes };
    }

    if (projects.length > 0) {
      query._id = { $in: projects };
    }

    if (officers.length > 0) {
      query.fieldOfficer = { $in: officers };
    }

    if (dzongkhags.length > 0) {
      query.dzongkhag = { $in: dzongkhags };
    }

    // =========================
    // ✅ FETCH PROJECTS
    // =========================
    const projectList = await Project.find(query)
      .populate("programme donor fieldOfficer")
      .sort({ createdAt: -1 });

    const projectIds = projectList.map((p) => p._id);

    // =========================
    // ✅ FETCH BENEFICIARIES
    // =========================
    const beneficiaries = await Beneficiary.find({
      projectId: { $in: projectIds },
    });

    // =========================
    // ✅ SUMMARY CALCULATION
    // =========================
    const summary = beneficiaries.reduce(
      (acc, b) => {
        acc.totalBeneficiaries++;

        if (b.gender?.toLowerCase() === "m") acc.male++;
        if (b.gender?.toLowerCase() === "f") acc.female++;

        acc.indirectMale += b.indirectBeneficiaries?.male || 0;
        acc.indirectFemale += b.indirectBeneficiaries?.female || 0;

        return acc;
      },
      {
        totalProjects: projectList.length,
        totalBeneficiaries: 0,
        male: 0,
        female: 0,
        indirectMale: 0,
        indirectFemale: 0,
      }
    );

    // =========================
    // ✅ FORMAT OUTPUT
    // =========================
    if (format === "pdf") {
      return generatePDF(res, projectList, beneficiaries, summary);
    }

    if (format === "excel") {
      return generateExcel(res, projectList, beneficiaries, summary);
    }

    // fallback JSON
    res.status(200).json({
      success: true,
      summary,
      projectList,
      beneficiaries,
    });

  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};