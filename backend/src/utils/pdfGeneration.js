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