import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  linkedin: z.string().default(""),
  github: z.string().default(""),
  website: z.string().default(""),
});

export const ExperienceItemSchema = z.object({
  company: z.string().default(""),
  position: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  highlights: z.array(z.string()).default([]),
  location: z.string().default(""),
});

export const EducationItemSchema = z.object({
  institution: z.string().default(""),
  degree: z.string().default(""),
  fieldOfStudy: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  gpa: z.string().default(""),
  location: z.string().default(""),
});

export const ProjectItemSchema = z.object({
  name: z.string().default(""),
  description: z.string().default(""),
  highlights: z.array(z.string()).default([]),
  url: z.string().default(""),
});

export const SectionsSchema = z.object({
  summary: z.string().default(""),
  experience: z.array(ExperienceItemSchema).default([]),
  education: z.array(EducationItemSchema).default([]),
  skills: z.array(z.string()).default([]),
  projects: z.array(ProjectItemSchema).default([]),
  certifications: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
});

export const ExtractionQualitySchema = z.object({
  score: z.number().min(0).max(100),
  warnings: z.array(z.string()).default([]),
  parsedSections: z.array(z.string()).default([]),
  missingSections: z.array(z.string()).default([]),
});

export const ResumeSchema = z.object({
  meta: z.object({
    parsedAt: z.string(),
    parserVersion: z.string(),
    fileName: z.string(),
  }),
  contact: ContactSchema,
  sections: SectionsSchema,
  rawText: z.string(),
  extractionQuality: ExtractionQualitySchema,
});

/**
 * Validates and normalizes parsed resume data against the ResumeSchema.
 * If validation fails, it outputs default empty arrays/objects to prevent runtime crashes.
 */
export function validateResumeData(data) {
  try {
    return ResumeSchema.parse(data);
  } catch (error) {
    console.warn("Zod validation warnings:", error.errors);
    // Return a safe parsed fallback
    return {
      meta: {
        parsedAt: data?.meta?.parsedAt || new Date().toISOString(),
        parserVersion: data?.meta?.parserVersion || "1.0.0",
        fileName: data?.meta?.fileName || "unknown",
      },
      contact: {
        name: data?.contact?.name || "",
        email: data?.contact?.email || "",
        phone: data?.contact?.phone || "",
        linkedin: data?.contact?.linkedin || "",
        github: data?.contact?.github || "",
        website: data?.contact?.website || "",
      },
      sections: {
        summary: data?.sections?.summary || "",
        experience: Array.isArray(data?.sections?.experience) ? data.sections.experience : [],
        education: Array.isArray(data?.sections?.education) ? data.sections.education : [],
        skills: Array.isArray(data?.sections?.skills) ? data.sections.skills : [],
        projects: Array.isArray(data?.sections?.projects) ? data.sections.projects : [],
        certifications: Array.isArray(data?.sections?.certifications) ? data.sections.certifications : [],
        languages: Array.isArray(data?.sections?.languages) ? data.sections.languages : [],
      },
      rawText: data?.rawText || "",
      extractionQuality: {
        score: typeof data?.extractionQuality?.score === "number" ? data.extractionQuality.score : 0,
        warnings: Array.isArray(data?.extractionQuality?.warnings) ? data.extractionQuality.warnings : [],
        parsedSections: Array.isArray(data?.extractionQuality?.parsedSections) ? data.extractionQuality.parsedSections : [],
        missingSections: Array.isArray(data?.extractionQuality?.missingSections) ? data.extractionQuality.missingSections : [],
      },
    };
  }
}
