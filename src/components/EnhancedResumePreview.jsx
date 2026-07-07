import { useState } from "react";
import { useResume } from "../context/ResumeContext";
import { exportResumeToPdf } from "../utils/pdfExport";
import { exportResumeToDocx } from "../utils/docxExport";
import { detectSections } from "../utils/parser/sectionDetector";
import { Copy, FileText, Download, Check, Sparkles, Briefcase, GraduationCap, Code, Award, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function EnhancedResumePreview() {
  const { enhancedResume, parsedResume, resumeText } = useResume();
  const [copied, setCopied] = useState(false);

  if (!enhancedResume) return null;

  // Fallback contact info resolver in case user pasted plain text instead of uploading a file
  const contactInfo = parsedResume?.contact || detectSections(resumeText)?.contact || { name: "Professional Candidate" };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(enhancedResume.fullText || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDownloadPdf = () => {
    exportResumeToPdf(enhancedResume, contactInfo);
  };

  const handleDownloadDocx = () => {
    exportResumeToDocx(enhancedResume, contactInfo);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] space-y-6 text-left select-none"
    >
      {/* Header and Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#c8cfdb]/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#7C3AED]" />
            <h3 className="font-extrabold text-lg text-[#2d3748]">
              Enhanced Resume Preview
            </h3>
          </div>
          <p className="text-xs text-[#5a6a85] font-semibold mt-0.5">
            Roast findings applied • Optimized keywords & impact metrics
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#7C3AED] bg-[#e0e5ec] rounded-xl shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] transition duration-200 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          {/* PDF Download Button */}
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#7C3AED] rounded-xl hover:bg-[#6d28d9] shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] transition duration-200 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Export</span>
          </button>

          {/* DOCX Download Button */}
          <button
            onClick={handleDownloadDocx}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#2d3748] bg-[#e0e5ec] rounded-xl shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] transition duration-200 cursor-pointer hover:text-[#7C3AED]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Word Export</span>
          </button>
        </div>
      </div>

      {/* Styled Sheet Preview */}
      <div className="p-6 rounded-2xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {/* Header Title block */}
        <div className="text-center space-y-1">
          <h4 className="text-xl font-black text-[#2d3748]">
            {contactInfo.name}
          </h4>
          <p className="text-[10px] text-[#5a6a85] font-bold">
            {[
              contactInfo.email,
              contactInfo.phone,
              contactInfo.linkedin ? "LinkedIn" : "",
              contactInfo.github ? "GitHub" : "",
              contactInfo.website ? "Portfolio" : "",
            ]
              .filter(Boolean)
              .join("   •   ")}
          </p>
        </div>

        {/* Summary */}
        {enhancedResume.summary && (
          <div className="space-y-1.5">
            <h5 className="flex items-center gap-1.5 text-xs font-black text-[#7C3AED] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Professional Summary</span>
            </h5>
            <p className="text-xs text-[#2d3748] leading-relaxed font-medium">
              {enhancedResume.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {enhancedResume.experience && enhancedResume.experience.length > 0 && (
          <div className="space-y-3">
            <h5 className="flex items-center gap-1.5 text-xs font-black text-[#7C3AED] uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Professional Experience</span>
            </h5>
            <div className="space-y-4">
              {enhancedResume.experience.map((job, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row justify-between text-xs">
                    <span className="font-extrabold text-[#2d3748]">
                      {job.position} <span className="font-bold text-[#5a6a85]">@ {job.company}</span>
                    </span>
                    <span className="font-bold text-[#909cb0]">
                      {job.startDate} – {job.endDate} {job.location ? `| ${job.location}` : ""}
                    </span>
                  </div>
                  <ul className="list-disc pl-4 text-xs text-[#5a6a85] font-semibold space-y-1.5">
                    {job.highlights?.map((h, hIdx) => (
                      <li key={hIdx} className="leading-relaxed">
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {enhancedResume.projects && enhancedResume.projects.length > 0 && (
          <div className="space-y-3">
            <h5 className="flex items-center gap-1.5 text-xs font-black text-[#7C3AED] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Projects</span>
            </h5>
            <div className="space-y-3">
              {enhancedResume.projects.map((proj, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-extrabold">
                    <span className="text-[#2d3748]">{proj.name}</span>
                    {proj.url && (
                      <a
                        href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#7C3AED] hover:underline"
                      >
                        Link
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-[11px] text-[#5a6a85] font-bold">{proj.description}</p>
                  )}
                  <ul className="list-disc pl-4 text-xs text-[#5a6a85] font-semibold space-y-1">
                    {proj.highlights?.map((h, hIdx) => (
                      <li key={hIdx} className="leading-relaxed">
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {enhancedResume.skills && enhancedResume.skills.length > 0 && (
          <div className="space-y-2">
            <h5 className="flex items-center gap-1.5 text-xs font-black text-[#7C3AED] uppercase tracking-wider">
              <Code className="w-3.5 h-3.5" />
              <span>Core Skills & Technologies</span>
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {enhancedResume.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#2d3748] bg-[#e0e5ec] shadow-[2px_2px_4px_#b8bec7,-2px_-2px_4px_#ffffff] rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {enhancedResume.education && enhancedResume.education.length > 0 && (
          <div className="space-y-3">
            <h5 className="flex items-center gap-1.5 text-xs font-black text-[#7C3AED] uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Education</span>
            </h5>
            <div className="space-y-2.5">
              {enhancedResume.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-[#2d3748]">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </span>
                    <span className="block text-[11px] text-[#5a6a85] font-bold">
                      {edu.institution} {edu.gpa ? `• GPA: ${edu.gpa}` : ""}
                    </span>
                  </div>
                  <span className="font-bold text-[#909cb0] whitespace-nowrap">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {enhancedResume.certifications && enhancedResume.certifications.length > 0 && (
          <div className="space-y-2">
            <h5 className="flex items-center gap-1.5 text-xs font-black text-[#7C3AED] uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Certifications</span>
            </h5>
            <ul className="list-disc pl-4 text-xs text-[#5a6a85] font-semibold space-y-1">
              {enhancedResume.certifications.map((cert, idx) => (
                <li key={idx}>{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
