const path = require("path");
const PDFDocument = require("pdfkit");

// Ensure these paths are correct for your local setup
const logoPath = path.join(__dirname, "../public/logo.png");
const dzongkhaPath = path.join(__dirname, "../public/t.png");

exports.generatePDF = (
  res,
  programmes = [],
  year,
  summary = {},
  meta = {}
) => {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=Report_${year}.pdf`);
  doc.pipe(res);

  // =========================
  // 🔷 NEW HEADER (AS REQUESTED)
  // =========================
  try {
    // Left Logo
    doc.image(logoPath, 40, 40, { width: 50 });
    
    // Centered Dzongkha Image
    const dzWidth = 140;
    doc.image(dzongkhaPath, (doc.page.width - dzWidth) / 2, 40, { width: dzWidth });
  } catch (e) {
    console.log("Header images not found, skipping...");
  }

  doc.moveDown(2.5);
  doc.fillColor("#000000").fontSize(22).font("Helvetica-Bold")
    .text("Tarayana Foundation", { align: "center" });

  doc.fontSize(10).font("Helvetica-Oblique").fillColor("#666666")
    .text('"Service from the Heart"', { align: "center" });

  doc.moveDown(1.5);
  doc.fontSize(18).font("Helvetica").fillColor("#000000")
    .text(`Tarayana Report  ${year}`, { align: "center" });

  doc.moveDown(2);
// =========================
// 🔷 SUBTITLE (DATE + FILTERS)
// =========================
let subtitle = "";

// DATE
if (meta.type === "quarterly" && meta.fromDate && meta.toDate) {
  subtitle += `Period: ${meta.fromDate} to ${meta.toDate}`;
} else if (meta.type === "annual") {
  subtitle += `Year: ${meta.year}`;
}

// PROGRAMMES
// NO FILTERS AT ALL
if (meta.isAllProgrammes && meta.isAllProjects) {
  subtitle += ` | All Programmes | All Projects`;
} else {
  // PROGRAMME NAMES
  const progNames = (meta.programmeNames || []).length
    ? meta.programmeNames.slice(0, 3).join(", ")
    : "All";

  const progMore = meta.programmeNames?.length > 3
    ? ` +${meta.programmeNames.length - 3} more`
    : "";

  // PROJECT NAMES
  const projNames = (meta.projectNames || []).length
    ? meta.projectNames.slice(0, 3).join(", ")
    : "All";

  const projMore = meta.projectNames?.length > 3
    ? ` +${meta.projectNames.length - 3} more`
    : "";

  subtitle += ` | Programmes: ${progNames}${progMore} | Projects: ${projNames}${projMore}`;
}
doc.moveDown(0.5);
doc.fontSize(10)
  .font("Helvetica-Oblique")
  .fillColor("#555555")
  .text(subtitle, { align: "center" });

doc.moveDown(1.5);
  // =========================
  // 🔷 NEW STATS CARDS
  // =========================
  const cardWidth = 125;
  const cardHeight = 65;
  const startY = doc.y;
  const spacing = 10;

  // Calculate unique Dzongkhags for the stat card
  const dzSet = new Set();
  programmes.forEach(prog => {
    (prog.projects || []).forEach(proj => { if(proj.dzongkhag) dzSet.add(proj.dzongkhag) });
  });

  const stats = [
    { label: "Beneficiaries", value: summary?.totalBeneficiaries || 0, color: "#3498db" },
    { label: "Projects", value: summary?.totalProjects || 0, color: "#2ecc71" },
    { label: "Dzongkhags", value: dzSet.size || 0, color: "#f1c40f" },
  ];

  stats.forEach((stat, i) => {
    const x = 40 + i * (cardWidth + spacing);
    doc.roundedRect(x, startY, cardWidth, cardHeight, 10).fillColor("#f8f9fa").fill();
    doc.circle(x + 22, startY + 32, 13).fillColor(stat.color).fill();
    doc.fillColor("#555555").fontSize(9).font("Helvetica").text(stat.label, x + 42, startY + 18);
    doc.fillColor("#000000").fontSize(13).font("Helvetica-Bold").text(stat.value.toString(), x + 42, startY + 33);
  });

  // Reset positioning to continue with your original body
  doc.y = startY + cardHeight + 40;

  // =========================
  // 🔷 ORIGINAL BODY (UNCHANGED)
  // =========================
(programmes || []).forEach((programme, pIndex) => {
    if (pIndex === 0) {
        doc.y = startY + cardHeight + 40;
    } else if (doc.y > 600) {
        doc.addPage();
        doc.y = 50;
    }

    (programme.projects || []).forEach((project) => {
        if (doc.y > 650) {
            doc.addPage();
            doc.y = 50;
        }

   

        // Headers
        // 1. Programme & Project Headers (Aligned Left)
        let sectionY = doc.y;
        doc.fillColor("#2c3e50").fontSize(11).font("Helvetica-Bold")
           .text(`Programme: ${programme.programmeName}`, 40, sectionY);
        
        sectionY += 15; 
        doc.fillColor("#16a085").fontSize(10).font("Helvetica-Bold")
           .text(`Project: ${project.projectName}`, 40, sectionY);

        // 2. NEW: Table Title "Beneficiaries"
        sectionY += 20; // Add space after Project name
        doc.fillColor("#333333").fontSize(10).font("Helvetica-Bold")
           .text("Beneficiaries", 40, sectionY);

        // 3. Table Header Position (Start below the title)
        let tableTop = sectionY + 18; 

        if (!project.beneficiaries || project.beneficiaries.length === 0) {
            doc.fillColor("#7f8c8d").fontSize(9).font("Helvetica-Oblique")
               .text("• No beneficiaries registered", 40, tableTop);
            doc.y = tableTop + 30;
            return;
        }

        const colX = { cid: 45, name: 110, gender: 240, dz: 300, village: 380, indirect: 480 };

        // 4. Draw Table Header
        doc.rect(40, tableTop - 4, 520, 16).fillColor("#f2f4f4").fill();
        doc.fillColor("#2d3436").fontSize(8.5).font("Helvetica-Bold"); 
        
        doc.text("CID", colX.cid, tableTop);
        doc.text("Name", colX.name, tableTop);
        doc.text("Gender", colX.gender, tableTop);
        doc.text("Dzongkhag", colX.dz, tableTop);
        doc.text("Village", colX.village, tableTop);
        doc.text("Indirect", colX.indirect, tableTop);

        // 5. Data Rows
        let rowY = tableTop + 15;
        // ... rest of your beneficiary loop stays the same

        project.beneficiaries.forEach((b, index) => {
            if (rowY > 750) {
                doc.addPage();
                rowY = 50;
            }

            // 1. Draw background first
            if (index % 2 === 0) {
                doc.rect(40, rowY - 3, 520, 14).fillColor("#fdfdfd").fill();
            }

            // 2. CRITICAL: Switch color back to dark BEFORE printing text
            doc.fillColor("#2d3436").font("Helvetica").fontSize(8);

            const indirect = (b.indirectBeneficiaries?.male || 0) + (b.indirectBeneficiaries?.female || 0);
            
            // 3. Print text with explicit Y coordinates
            doc.text(b.cid || "-", colX.cid, rowY);
            doc.text(b.name || "-", colX.name, rowY, { width: 120, lineBreak: false });
            doc.text(b.gender || "-", colX.gender, rowY);
            doc.text(b.dzongkhag || "-", colX.dz, rowY);
            doc.text(b.village || "-", colX.village, rowY);
            doc.text(indirect.toString(), colX.indirect, rowY);

            rowY += 15;
        });

        doc.y = rowY + 20; 
    });
});
doc.end(); // CRITICAL: This must be at the very end
};