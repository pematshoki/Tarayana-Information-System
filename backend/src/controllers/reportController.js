
const { buildReportData } = require("../services/reportServices");
const { generatePDF } = require("../utils/pdfGenerator");
const { generateExcel } = require("../utils/excelGenerator");
const Report = require("../models/reportModel");
const fs = require("fs");
const path = require("path");

const filename = `report_${Date.now()}.pdf`;
const filePath = path.join(__dirname, "../public/reports", filename);

exports.getReports = async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json({ success: true, reports });
};
exports.generateReport = async (req, res) => {
  try {
    const {
      type,
      year,
      fromDate,
      toDate,
      programmes = [],
      projects = [],
      officers = [],
      dzongkhags = [],
      include = {},
      format = "json",
    } = req.body;

    // =========================
    // INCLUDE DEFAULTS
    // =========================
    const safeInclude = {
      summary: include.summary ?? true,
      projects: include.projects ?? true,
      beneficiaries: include.beneficiaries ?? true,
    };

    // =========================
    // DATE FILTER
    // =========================
    let dateFilter = {};

  if (type === "quarterly") {
  if (!fromDate || !toDate) {
    throw new Error("Date range required");
  }

  const start = new Date(fromDate + "T00:00:00.000Z");
  const end = new Date(toDate + "T23:59:59.999Z");

  if (isNaN(start) || isNaN(end)) {
    throw new Error("Invalid date values");
  }

  dateFilter = {
    startDate: { $gte: start, $lte: end }
  };
}
    if (type === "annual") {
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year}-12-31T23:59:59.999Z`);
end.setHours(23, 59, 59, 999);
      end.setHours(23, 59, 59, 999);

      dateFilter = { startDate: { $gte: start, $lte: end } };
    }

    // =========================
    // BUILD REPORT DATA
    // =========================
    const reportData = await buildReportData({
      dateFilter,
      programmes,
      projects,
      officers,
      dzongkhags,
      include: safeInclude,
    });

    const reportYear = year || new Date().getFullYear();

    // =========================
    // OUTPUT
    // =========================
    const selectedProgrammeNames = reportData.programmes.map(p => p.programmeName);

const selectedProjectNames = reportData.programmes.flatMap(p =>
  (p.projects || []).map(pr => pr.projectName)
);
    if (format === "pdf") {
      return generatePDF(
        res,
        reportData.programmes,
        reportYear,
        reportData.summary,
          {
    type,
    fromDate,
    toDate,
    year,
    programmeNames: selectedProgrammeNames,
    projectNames: selectedProjectNames,
    isAllProgrammes: programmes.length === 0,
    isAllProjects: projects.length === 0
  }
      );
    }

    if (format === "excel") {
      return generateExcel(
        res, 
        reportData.programmes,
        reportYear,
        reportData.summary,
          {
    type,
    fromDate,
    toDate,
    year,
    programmeNames: selectedProgrammeNames,
    projectNames: selectedProjectNames,
    isAllProgrammes: programmes.length === 0,
    isAllProjects: projects.length === 0});
    }
const savedReport = await Report.create({
  title: `${type === "annual" ? "Annual" : "Quarterly"} Report ${reportYear}`,
  type,
  year: reportYear,
  fileUrl: `/reports/${filename}`,
  createdAt: new Date()
});
    return res.json({
      success: true,
      ...reportData,
    });
  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
