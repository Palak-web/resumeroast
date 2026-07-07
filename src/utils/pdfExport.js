import { jsPDF } from "jspdf";

/**
 * Generates and downloads a recruiter-friendly, ATS-optimized PDF resume in the browser.
 * Uses a single-column layout, Helvetica, and clean typography/spacing.
 */
export function exportResumeToPdf(resume, contactInfo) {
  if (!resume) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 54; // 0.75-inch margin (54pt)
  const contentWidth = pageWidth - 2 * margin;

  let y = 54;

  // Helper to render wrapped lines of text and manage page splits
  function addText(text, fontSize, isBold = false, color = "#2D3748", lineSpacing = 1.35) {
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    
    const lines = doc.splitTextToSize(text, contentWidth);
    
    lines.forEach((line) => {
      // Check if page boundary is hit
      if (y + fontSize * lineSpacing > pageHeight - margin) {
        doc.addPage();
        y = margin;
        // Keep active settings
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(color);
      }
      doc.text(line, margin, y);
      y += fontSize * lineSpacing;
    });
  }

  // Helper to draw clean sections
  function addSectionHeader(title) {
    // Check if drawing header overflows page
    if (y + 40 > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor("#7C3AED"); // Brand Accent Purple
    doc.text(title.toUpperCase(), margin, y);
    y += 4;
    
    // Draw section separator line
    doc.setStrokeColor("#7C3AED");
    doc.setLineWidth(0.75);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;
  }

  // --- HEADER SECTION ---
  const name = contactInfo?.name || "Professional Candidate";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor("#2D3748");
  const nameWidth = doc.getTextWidth(name);
  doc.text(name, (pageWidth - nameWidth) / 2, y);
  y += 24;

  // Contact list formatter
  const contacts = [];
  if (contactInfo?.email) contacts.push(contactInfo.email);
  if (contactInfo?.phone) contacts.push(contactInfo.phone);
  if (contactInfo?.linkedin) {
    const cleanLi = contactInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?/, "");
    contacts.push(cleanLi);
  }
  if (contactInfo?.github) {
    const cleanGh = contactInfo.github.replace(/^(https?:\/\/)?(www\.)?/, "");
    contacts.push(cleanGh);
  }
  if (contactInfo?.website) {
    const cleanWeb = contactInfo.website.replace(/^(https?:\/\/)?(www\.)?/, "");
    contacts.push(cleanWeb);
  }

  const contactString = contacts.join("   |   ");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor("#5A6A85");
  const contactWidth = doc.getTextWidth(contactString);
  doc.text(contactString, (pageWidth - contactWidth) / 2, y);
  y += 20;

  // --- SUMMARY SECTION ---
  if (resume.summary) {
    addSectionHeader("Professional Summary");
    addText(resume.summary, 9.5, false, "#2D3748", 1.4);
  }

  // --- EXPERIENCE SECTION ---
  if (resume.experience && resume.experience.length > 0) {
    addSectionHeader("Professional Experience");
    
    resume.experience.forEach((job) => {
      if (y + 45 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      // Title & Company
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor("#2D3748");
      const jobHeaderStr = `${job.position}  |  ${job.company}`;
      doc.text(jobHeaderStr, margin, y);

      // Dates (aligned right)
      const dateRangeStr = `${job.startDate || ""} - ${job.endDate || ""}`;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor("#5A6A85");
      const dateWidth = doc.getTextWidth(dateRangeStr);
      doc.text(dateRangeStr, pageWidth - margin - dateWidth, y);
      y += 13;

      // Location details
      if (job.location) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor("#909CB0");
        const locWidth = doc.getTextWidth(job.location);
        doc.text(job.location, pageWidth - margin - locWidth, y);
        y += 10;
      } else {
        y += 2;
      }

      // Highlights / Bullets
      if (job.highlights && job.highlights.length > 0) {
        job.highlights.forEach((bullet) => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor("#2D3748");

          // Text wrap for bullets
          const bulletLines = doc.splitTextToSize(bullet, contentWidth - 14);
          
          if (y + (bulletLines.length * 12) > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }

          doc.text("•", margin + 3, y);
          bulletLines.forEach((line) => {
            doc.text(line, margin + 14, y);
            y += 12;
          });
        });
      }
      y += 6; // Spacing before next job
    });
  }

  // --- PROJECTS SECTION ---
  if (resume.projects && resume.projects.length > 0) {
    addSectionHeader("Projects");

    resume.projects.forEach((proj) => {
      if (y + 35 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      // Project Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor("#2D3748");
      doc.text(proj.name, margin, y);

      // Project URL (aligned right)
      if (proj.url) {
        const cleanUrl = proj.url.replace(/^(https?:\/\/)?(www\.)?/, "");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor("#7C3AED");
        const urlWidth = doc.getTextWidth(cleanUrl);
        doc.text(cleanUrl, pageWidth - margin - urlWidth, y);
      }
      y += 13;

      // Project Highlights
      if (proj.highlights && proj.highlights.length > 0) {
        proj.highlights.forEach((bullet) => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor("#2D3748");

          const bulletLines = doc.splitTextToSize(bullet, contentWidth - 14);

          if (y + (bulletLines.length * 12) > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }

          doc.text("•", margin + 3, y);
          bulletLines.forEach((line) => {
            doc.text(line, margin + 14, y);
            y += 12;
          });
        });
      }
      y += 6;
    });
  }

  // --- SKILLS SECTION ---
  if (resume.skills && resume.skills.length > 0) {
    addSectionHeader("Core Skills & Technologies");
    const skillsJoined = resume.skills.join("   •   ");
    addText(skillsJoined, 9, false, "#2D3748", 1.4);
  }

  // --- EDUCATION SECTION ---
  if (resume.education && resume.education.length > 0) {
    addSectionHeader("Education");

    resume.education.forEach((edu) => {
      if (y + 30 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      // Institution & Degree
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor("#2D3748");
      const eduHeader = `${edu.degree}${edu.fieldOfStudy ? " in " + edu.fieldOfStudy : ""}  |  ${edu.institution}`;
      doc.text(eduHeader, margin, y);

      // Dates (aligned right)
      const eduDates = `${edu.startDate || ""} - ${edu.endDate || ""}`;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor("#5A6A85");
      const dateWidth = doc.getTextWidth(eduDates);
      doc.text(eduDates, pageWidth - margin - dateWidth, y);
      y += 13;

      // GPA or Location details
      const details = [];
      if (edu.gpa) details.push(`GPA: ${edu.gpa}`);
      if (edu.location) details.push(edu.location);

      if (details.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor("#909CB0");
        doc.text(details.join("   |   "), margin, y);
        y += 12;
      }
      y += 4;
    });
  }

  // --- CERTIFICATIONS SECTION ---
  if (resume.certifications && resume.certifications.length > 0) {
    addSectionHeader("Certifications");

    resume.certifications.forEach((cert) => {
      if (y + 14 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor("#2D3748");
      doc.text(`•  ${cert}`, margin + 3, y);
      y += 13;
    });
  }

  // Trigger Save File
  const fileSaveName = `${name.replace(/[^a-zA-Z0-9]/g, "_")}_Enhanced_Resume.pdf`;
  doc.save(fileSaveName);
}
