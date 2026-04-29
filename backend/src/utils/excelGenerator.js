const ExcelJS = require("exceljs");

exports.generateExcel = async (
  res,
  data = {},
  year,
  meta = {}
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");

  const programmes = data.programmes || [];
  const summary = data.summary || {};

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
  sheet.getCell("A3").value = `Tarayana Report ${year}`;
  sheet.getCell("A3").font = { size: 14 };
  sheet.getCell("A3").alignment = { horizontal: "center" };

  // =========================
  // 🔷 SUBTITLE (same logic as PDF)
  // =========================
  let subtitle = "";

  if (meta.type === "quarterly" && meta.fromDate && meta.toDate) {
    subtitle += `Period: ${meta.fromDate} to ${meta.toDate}`;
  } else if (meta.type === "annual") {
    subtitle += `Year: ${meta.year}`;
  }

  if (meta.isAllProgrammes) {
    subtitle += " | All Programmes";
  } else {
    const names = (meta.programmeNames || []).slice(0, 3).join(", ");
    const more =
      meta.programmeNames?.length > 3
        ? ` +${meta.programmeNames.length - 3} more`
        : "";
    subtitle += ` | Programmes: ${names}${more}`;
  }

  if (meta.isAllProjects) {
    subtitle += " | All Projects";
  } else {
    const names = (meta.projectNames || []).slice(0, 3).join(", ");
    const more =
      meta.projectNames?.length > 3
        ? ` +${meta.projectNames.length - 3} more`
        : "";
    subtitle += ` | Projects: ${names}${more}`;
  }

  sheet.mergeCells("A4:F4");
  sheet.getCell("A4").value = subtitle;
  sheet.getCell("A4").alignment = { horizontal: "center" };

  let rowIndex = 6;

  // =========================
  // 🔷 NO DATA CASE
  // =========================
  if (!programmes.length) {
    sheet.mergeCells(`A${rowIndex}:F${rowIndex}`);
    sheet.getCell(`A${rowIndex}`).value = "No data available for selected timeline";
    sheet.getCell(`A${rowIndex}`).alignment = { horizontal: "center" };

    return sendFile(res, workbook, year);
  }

  // =========================
  // 🔷 SUMMARY
  // =========================
  sheet.getCell(`A${rowIndex}`).value = "Summary";
  sheet.getCell(`A${rowIndex}`).font = { bold: true };

  rowIndex++;

  sheet.addRow([
    "Total Projects",
    summary.totalProjects || 0,
    "Total Beneficiaries",
    summary.totalBeneficiaries || 0,
  ]);

  sheet.addRow([
    "Male",
    summary.male || 0,
    "Female",
    summary.female || 0,
  ]);

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

      // TABLE HEADER
      sheet.addRow([
        "CID",
        "Name",
        "Gender",
        "Dzongkhag",
        "Village",
        "Indirect",
      ]);

      const headerRow = sheet.getRow(rowIndex);
      headerRow.font = { bold: true };
      rowIndex++;

      if (!project.beneficiaries || project.beneficiaries.length === 0) {
        sheet.addRow(["No beneficiaries"]);
        rowIndex += 2;
        return;
      }

      project.beneficiaries.forEach((b) => {
        const indirect =
          (b.indirectBeneficiaries?.male || 0) +
          (b.indirectBeneficiaries?.female || 0);

        sheet.addRow([
          b.cid || "-",
          b.name || "-",
          b.gender || "-",
          b.dzongkhag || "-",
          b.village || "-",
          indirect,
        ]);

        rowIndex++;
      });

      rowIndex++;
    });

    rowIndex++;
  });

  // =========================
  // 🔷 AUTO WIDTH
  // =========================
  sheet.columns.forEach((col) => {
    col.width = 20;
  });

  // =========================
  // 🔷 SEND FILE
  // =========================
  return sendFile(res, workbook, year);
};

// =========================
// 🔷 HELPER
// =========================
function sendFile(res, workbook, year) {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Report_${year}.xlsx`
  );

  return workbook.xlsx.write(res).then(() => res.end());
}