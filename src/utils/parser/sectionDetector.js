import { validateResumeData } from "./resumeSchema";

const SECTION_HEADERS = {
  summary: /^(summary|summary of qualifications|profile|professional summary|about me|objective|career objective|professional profile|summary & objective)$/i,
  experience: /^(experience|work experience|employment history|work history|professional experience|experience history|employment|career history|work background)$/i,
  education: /^(education|academic background|education history|academic credentials|qualification|qualifications|academic history|academic background)$/i,
  skills: /^(skills|technical skills|core competencies|expertise|skills & technologies|areas of expertise|technologies|key skills|skills summary)$/i,
  projects: /^(projects|key projects|personal projects|academic projects|selected projects|project experience|notable projects)$/i,
  certifications: /^(certifications|licenses|certifications & licenses|credentials|accreditations|courses|training|awards)$/i,
  languages: /^(languages|languages spoken|linguistic skills|language skills)$/i,
};

/**
 * Matches a line against known section headers.
 */
function getSectionKey(line) {
  // Strip numbers, decorations (like dashes, brackets), and leading/trailing spaces
  const cleanLine = line
    .replace(/^[\s\-\*•\d\.\#\(\)]+/g, "")
    .replace(/[\s\-\*•\.\#\(\)]+$/g, "")
    .trim();

  // If line is empty or too long, it's not a section header
  if (!cleanLine || cleanLine.length > 35) return null;

  for (const [key, regex] of Object.entries(SECTION_HEADERS)) {
    if (regex.test(cleanLine)) {
      return key;
    }
  }
  return null;
}

/**
 * Extract email from text
 */
function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : "";
}

/**
 * Extract phone number from text
 */
function extractPhone(text) {
  // Matches typical phone formats e.g. +1 (123) 456-7890, 123-456-7890, +91 9999999999
  const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/);
  return match ? match[0] : "";
}

/**
 * Extract LinkedIn profile from text
 */
function extractLinkedIn(text) {
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_\-\u00C0-\u00FF]+)/i);
  return match ? match[0] : "";
}

/**
 * Extract GitHub profile from text
 */
function extractGitHub(text) {
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-]+)/i);
  return match ? match[0] : "";
}

/**
 * Extract other personal websites from text
 */
function extractWebsite(text) {
  // Matches general URLs excluding linkedin and github
  const matches = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9\-]+\.[a-zA-Z]{2,})(?:\/[^\s]*)?/gi);
  if (matches) {
    for (const url of matches) {
      if (!/linkedin|github/i.test(url)) {
        return url;
      }
    }
  }
  return "";
}

/**
 * Guess the candidate's name from the header lines (text before first section)
 */
function guessName(headerLines) {
  for (const line of headerLines) {
    const cleanLine = line.trim();
    if (!cleanLine) continue;

    // Skip lines with contact information
    if (cleanLine.includes("@") || cleanLine.match(/\d{4,}/)) continue;
    if (/https?:\/\//i.test(cleanLine) || /linkedin|github/i.test(cleanLine)) continue;

    // A name is usually 2 to 4 capitalized words
    const words = cleanLine.split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      // Check if mostly letters
      if (/^[a-zA-Z\s\.\-\'\’]+$/.test(cleanLine)) {
        return cleanLine;
      }
    }
  }
  return "";
}

/**
 * Parse experience section into structured items
 */
function parseExperience(lines) {
  if (lines.length === 0) return [];

  // Group lines into blocks representing individual jobs
  const blocks = [];
  let currentBlock = [];

  for (const line of lines) {
    // Treat blank lines or blocks starting with clear triggers as boundaries
    if (line.trim() === "") {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock);
        currentBlock = [];
      }
    } else {
      currentBlock.push(line);
    }
  }
  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks.map((block) => {
    const titleLine = block[0] || "";
    const remainingLines = block.slice(1);

    // Heuristics for dates
    const dateRegex = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present|\d{1,2}\/\d{2,4}|\d{4})/i;
    let dates = "";
    let cleanTitleLine = titleLine;

    // Try to extract dates from title line first
    const datesFound = titleLine.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4}).*?(?:Present|\d{4})/i);
    if (datesFound) {
      dates = datesFound[0];
      cleanTitleLine = titleLine.replace(datesFound[0], "").trim();
    }

    // Try to parse Company and Position
    let company = "";
    let position = "";
    const splitParts = cleanTitleLine.split(/[\-\|\,]/);
    if (splitParts.length >= 2) {
      company = splitParts[0].trim();
      position = splitParts.slice(1).join(" ").trim();
    } else {
      company = cleanTitleLine.trim();
    }

    // Highlights are lines with bullet indicators or any remaining lines
    const highlights = remainingLines
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((l) => l.replace(/^[\-\*•\s]+/, "")); // Strip leading dashes/bullets

    return {
      company,
      position,
      startDate: dates ? dates.split(/-|to/)[0]?.trim() || "" : "",
      endDate: dates ? dates.split(/-|to/)[1]?.trim() || "" : "",
      highlights,
      location: "",
    };
  });
}

/**
 * Parse education section into structured items
 */
function parseEducation(lines) {
  if (lines.length === 0) return [];

  const blocks = [];
  let currentBlock = [];

  for (const line of lines) {
    if (line.trim() === "") {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock);
        currentBlock = [];
      }
    } else {
      currentBlock.push(line);
    }
  }
  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks.map((block) => {
    const titleLine = block[0] || "";
    const description = block.slice(1).join(" ");

    // Search for degree/field
    let degree = "";
    let fieldOfStudy = "";
    if (titleLine.includes("Bachelor") || titleLine.includes("B.S") || titleLine.includes("B.A") || titleLine.includes("B.Tech")) {
      degree = "Bachelor's Degree";
    } else if (titleLine.includes("Master") || titleLine.includes("M.S") || titleLine.includes("M.A") || titleLine.includes("M.Tech")) {
      degree = "Master's Degree";
    } else if (titleLine.includes("Ph.D") || titleLine.includes("Doctor")) {
      degree = "Ph.D.";
    }

    // GPA
    const gpaMatch = description.match(/GPA:?\s*([0-4]\.\d+)/i) || titleLine.match(/GPA:?\s*([0-4]\.\d+)/i);

    return {
      institution: titleLine.split(/[\-\|\,]/)[0]?.trim() || titleLine.trim(),
      degree: degree || titleLine.split(/[\-\|\,]/)[1]?.trim() || "",
      fieldOfStudy: fieldOfStudy,
      startDate: "",
      endDate: "",
      gpa: gpaMatch ? gpaMatch[1] : "",
      location: "",
    };
  });
}

/**
 * Parse skills section into a list of strings
 */
function parseSkills(lines) {
  const skills = [];
  for (const line of lines) {
    // If skills are comma-separated or pipe-separated in a line, split them
    if (line.includes(",") || line.includes("|") || line.includes("•")) {
      const parts = line.split(/[,|•]/);
      for (const part of parts) {
        const clean = part.trim().replace(/^[\-\*•\s]+/, "");
        if (clean && clean.length > 1) {
          skills.push(clean);
        }
      }
    } else {
      const clean = line.trim().replace(/^[\-\*•\s]+/, "");
      if (clean && clean.length > 1) {
        skills.push(clean);
      }
    }
  }
  return skills.slice(0, 50); // limit to 50 max to prevent massive lists
}

/**
 * Parse projects section
 */
function parseProjects(lines) {
  if (lines.length === 0) return [];

  const blocks = [];
  let currentBlock = [];

  for (const line of lines) {
    if (line.trim() === "") {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock);
        currentBlock = [];
      }
    } else {
      currentBlock.push(line);
    }
  }
  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks.map((block) => {
    const titleLine = block[0] || "";
    const remainingLines = block.slice(1);

    const highlights = remainingLines
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((l) => l.replace(/^[\-\*•\s]+/, ""));

    return {
      name: titleLine.replace(/^[\-\*•\s]+/, "").trim(),
      description: remainingLines[0] || "",
      highlights,
      url: "",
    };
  });
}

/**
 * Compute the extraction quality score and generate actionable warnings.
 */
function calculateQuality(rawText, parsed, sectionsData) {
  let score = 0;
  const warnings = [];
  const parsedSections = [];
  const missingSections = [];

  // Text Length
  const textLength = rawText.length;
  if (textLength > 1800) score += 20;
  else if (textLength > 900) score += 10;
  else if (textLength < 300) {
    score -= 20;
    warnings.push("Extracted text is extremely short. This might be a scanned PDF or contains mostly images.");
  }

  // Contact Info
  if (parsed.email) {
    score += 15;
  } else {
    warnings.push("No email address could be automatically extracted.");
  }

  if (parsed.phone) {
    score += 15;
  } else {
    warnings.push("No phone number could be automatically extracted.");
  }

  if (parsed.linkedin) score += 10;
  if (parsed.github) score += 10;

  // Sections
  const requiredSections = {
    summary: "Summary/Objective",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
  };

  for (const [key, label] of Object.entries(requiredSections)) {
    const data = sectionsData[key];
    const hasContent = Array.isArray(data) ? data.length > 0 : !!data;
    if (hasContent) {
      score += 15;
      parsedSections.push(label);
    } else {
      missingSections.push(label);
      warnings.push(`Missing section: ${label}`);
    }
  }

  // Other optional sections
  if (sectionsData.certifications && sectionsData.certifications.length > 0) {
    score += 5;
    parsedSections.push("Certifications");
  } else {
    missingSections.push("Certifications");
  }

  if (sectionsData.languages && sectionsData.languages.length > 0) {
    score += 5;
    parsedSections.push("Languages");
  } else {
    missingSections.push("Languages");
  }

  // Cap score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    warnings,
    parsedSections,
    missingSections,
  };
}

/**
 * Main function to segment normalized text and parse structures
 */
export function detectSections(rawText, fileName = "Uploaded Resume") {
  const lines = rawText.split("\n");
  
  const sectionsText = {
    header: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
  };

  let currentKey = "header";

  for (const line of lines) {
    const detectedKey = getSectionKey(line);
    if (detectedKey) {
      currentKey = detectedKey;
    } else {
      sectionsText[currentKey].push(line);
    }
  }

  // Format parsed sections
  const sections = {
    summary: sectionsText.summary.join("\n").trim(),
    experience: parseExperience(sectionsText.experience),
    education: parseEducation(sectionsText.education),
    skills: parseSkills(sectionsText.skills),
    projects: parseProjects(sectionsText.projects),
    certifications: sectionsText.certifications.map(l => l.trim()).filter(l => l.length > 0),
    languages: sectionsText.languages.map(l => l.trim()).filter(l => l.length > 0),
  };

  // Contact detail extraction
  const contact = {
    name: guessName(sectionsText.header),
    email: extractEmail(rawText),
    phone: extractPhone(rawText),
    linkedin: extractLinkedIn(rawText),
    github: extractGitHub(rawText),
    website: extractWebsite(rawText),
  };

  // Double check name if not found in header
  if (!contact.name && sections.summary) {
    // If no name found, look at the first few words of the resume
    contact.name = guessName(lines.slice(0, 5));
  }

  const extractionQuality = calculateQuality(rawText, contact, sections);

  const rawJSON = {
    meta: {
      parsedAt: new Date().toISOString(),
      parserVersion: "1.0.0",
      fileName,
    },
    contact,
    sections,
    rawText,
    extractionQuality,
  };

  return validateResumeData(rawJSON);
}
