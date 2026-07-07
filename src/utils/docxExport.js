/**
 * Generates and downloads a recruiter-friendly, styled Word document (.doc) in the browser.
 * Uses HTML-to-Word MIME type packaging with Office XML margins and styles.
 */
export function exportResumeToDocx(resume, contactInfo) {
  if (!resume) return;

  const name = contactInfo?.name || "Professional Candidate";
  const email = contactInfo?.email || "";
  const phone = contactInfo?.phone || "";
  const linkedin = contactInfo?.linkedin || "";
  const github = contactInfo?.github || "";
  const website = contactInfo?.website || "";

  // Contact line elements
  const contacts = [];
  if (email) contacts.push(email);
  if (phone) contacts.push(phone);
  if (linkedin) {
    const cleanLi = linkedin.replace(/^(https?:\/\/)?(www\.)?/, "");
    contacts.push(cleanLi);
  }
  if (github) {
    const cleanGh = github.replace(/^(https?:\/\/)?(www\.)?/, "");
    contacts.push(cleanGh);
  }
  if (website) {
    const cleanWeb = website.replace(/^(https?:\/\/)?(www\.)?/, "");
    contacts.push(cleanWeb);
  }

  const contactString = contacts.join("   |   ");

  // Format Experience HTML block
  let experienceHtml = "";
  if (resume.experience && resume.experience.length > 0) {
    experienceHtml = `
      <h2>Professional Experience</h2>
      ${resume.experience
        .map(
          (job) => `
        <div class="entry">
          <table width="100%" style="border-collapse: collapse; margin-bottom: 2px;">
            <tr>
              <td align="left" class="bold">${job.position}  |  ${job.company}</td>
              <td align="right" class="bold" style="font-size: 9.5pt;">${job.startDate || ""} - ${job.endDate || ""}</td>
            </tr>
            ${
              job.location
                ? `
            <tr>
              <td></td>
              <td align="right" class="gray" style="font-size: 8.5pt;">${job.location}</td>
            </tr>
            `
                : ""
            }
          </table>
          <ul>
            ${job.highlights.map((h) => `<li>${h}</li>`).join("")}
          </ul>
        </div>
      `
        )
        .join("")}
    `;
  }

  // Format Projects HTML block
  let projectsHtml = "";
  if (resume.projects && resume.projects.length > 0) {
    projectsHtml = `
      <h2>Projects</h2>
      ${resume.projects
        .map(
          (proj) => `
        <div class="entry">
          <table width="100%" style="border-collapse: collapse; margin-bottom: 2px;">
            <tr>
              <td align="left" class="bold">${proj.name}</td>
              ${
                proj.url
                  ? `<td align="right" class="purple-link" style="font-size: 9pt;">${proj.url.replace(
                      /^(https?:\/\/)?(www\.)?/,
                      ""
                    )}</td>`
                  : ""
              }
            </tr>
          </table>
          <ul>
            ${proj.highlights.map((h) => `<li>${h}</li>`).join("")}
          </ul>
        </div>
      `
        )
        .join("")}
    `;
  }

  // Format Skills HTML block
  let skillsHtml = "";
  if (resume.skills && resume.skills.length > 0) {
    skillsHtml = `
      <h2>Core Skills & Technologies</h2>
      <p style="font-size: 9.5pt; line-height: 1.35; margin-bottom: 10pt;">
        ${resume.skills.join("   &bull;   ")}
      </p>
    `;
  }

  // Format Education HTML block
  let educationHtml = "";
  if (resume.education && resume.education.length > 0) {
    educationHtml = `
      <h2>Education</h2>
      ${resume.education
        .map(
          (edu) => `
        <div class="entry">
          <table width="100%" style="border-collapse: collapse; margin-bottom: 2px;">
            <tr>
              <td align="left" class="bold">${edu.degree}${
            edu.fieldOfStudy ? " in " + edu.fieldOfStudy : ""
          }  |  ${edu.institution}</td>
              <td align="right" class="bold" style="font-size: 9.5pt;">${edu.startDate || ""} - ${edu.endDate || ""}</td>
            </tr>
            ${
              edu.gpa || edu.location
                ? `
            <tr>
              <td class="gray" style="font-size: 9pt;">
                ${[edu.gpa ? `GPA: ${edu.gpa}` : "", edu.location || ""]
                  .filter(Boolean)
                  .join("   |   ")}
              </td>
              <td></td>
            </tr>
            `
                : ""
            }
          </table>
        </div>
      `
        )
        .join("")}
    `;
  }

  // Format Certifications HTML block
  let certificationsHtml = "";
  if (resume.certifications && resume.certifications.length > 0) {
    certificationsHtml = `
      <h2>Certifications</h2>
      <ul style="margin-top: 2px;">
        ${resume.certifications.map((cert) => `<li>${cert}</li>`).join("")}
      </ul>
    `;
  }

  // Master word template string
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>Resume</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 8.5in 11.0in;
          margin: 0.75in 0.75in 0.75in 0.75in;
          mso-header-margin: 0.5in;
          mso-footer-margin: 0.5in;
          mso-paper-source: 0;
        }
        body {
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 10.5pt;
          line-height: 1.25;
          color: #2D3748;
        }
        h1 {
          font-family: 'Calibri Light', 'Arial', sans-serif;
          font-size: 19pt;
          text-align: center;
          margin: 0 0 3pt 0;
          color: #2D3748;
          text-transform: uppercase;
          font-weight: bold;
        }
        .contacts {
          text-align: center;
          font-size: 9pt;
          color: #5A6A85;
          margin-bottom: 12pt;
        }
        h2 {
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 11pt;
          color: #7C3AED;
          border-bottom: 1px solid #7C3AED;
          margin-top: 14pt;
          margin-bottom: 6pt;
          text-transform: uppercase;
          font-weight: bold;
        }
        p {
          margin: 0 0 5pt 0;
        }
        .entry {
          margin-bottom: 6pt;
        }
        ul {
          margin: 0 0 4pt 0;
          padding-left: 18px;
        }
        li {
          margin-bottom: 2pt;
          font-size: 9.5pt;
        }
        .bold {
          font-weight: bold;
          font-size: 10.5pt;
        }
        .gray {
          color: #5A6A85;
          font-size: 9pt;
        }
        .purple-link {
          color: #7C3AED;
          text-decoration: underline;
          font-size: 9pt;
        }
      </style>
    </head>
    <body>
      <div>
        <h1>${name}</h1>
        <div class="contacts">${contactString}</div>
        
        ${
          resume.summary
            ? `
          <h2>Professional Summary</h2>
          <p style="font-size: 9.5pt; line-height: 1.35; margin-bottom: 10pt;">${resume.summary}</p>
        `
            : ""
        }

        ${experienceHtml}
        ${projectsHtml}
        ${skillsHtml}
        ${educationHtml}
        ${certificationsHtml}
      </div>
    </body>
    </html>
  `;

  // Create Blob & download
  const blob = new Blob([htmlContent], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.download = `${name.replace(/[^a-zA-Z0-9]/g, "_")}_Enhanced_Resume.doc`;
  document.body.appendChild(linkElement);
  linkElement.click();
  
  // Cleanup
  document.body.removeChild(linkElement);
  URL.revokeObjectURL(url);
}
