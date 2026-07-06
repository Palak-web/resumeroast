import { useResume } from "../context/ResumeContext";
import { CheckCircle, AlertTriangle, User, Mail, Phone, Globe } from "lucide-react";
import { motion } from "framer-motion";

// Custom SVG components for brand icons not present in local lucide-react package
const Linkedin = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ParsingQuality() {
  const { parsedResume } = useResume();

  if (!parsedResume) return null;

  const { contact, extractionQuality } = parsedResume;
  const { score, warnings, parsedSections, missingSections } = extractionQuality;

  // Determine score color scheme and tag
  let scoreColor = "text-[#e11d48]"; // red/rose for weak
  let scoreBg = "bg-rose-500/10";
  let scoreTag = "Weak Extraction";

  if (score >= 80) {
    scoreColor = "text-emerald-600";
    scoreBg = "bg-emerald-500/10";
    scoreTag = "Excellent Parse";
  } else if (score >= 50) {
    scoreColor = "text-amber-500";
    scoreBg = "bg-amber-500/10";
    scoreTag = "Fair Parse";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] space-y-6 select-none text-left"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#c8cfdb]/50 pb-4">
        <div>
          <h3 className="font-extrabold text-base text-[#2d3748]">
            Extraction Report
          </h3>
          <p className="text-xs text-[#5a6a85] font-semibold">
            Heuristic structure assessment of the uploaded document
          </p>
        </div>

        {/* Quality Score Indicator */}
        <div className="flex items-center gap-3">
          <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl ${scoreBg} shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)]`}>
            <span className={`text-xl font-black ${scoreColor}`}>
              {score}
            </span>
            <span className="text-[8px] font-black text-[#5a6a85] tracking-wider uppercase">
              /100
            </span>
          </div>
          <div>
            <span className={`text-xs font-black uppercase tracking-wider block ${scoreColor}`}>
              {scoreTag}
            </span>
            <span className="text-[10px] text-[#909cb0] font-bold block">
              Confidence level
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Contact Elements */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-[#5a6a85] uppercase tracking-wider">
          Extracted Contacts
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Name */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec7,inset_-3px_-3px_6px_#ffffff]">
            <User className="w-4 h-4 text-[#7C3AED]" />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] text-[#909cb0] font-bold block leading-none">NAME</span>
              <span className="text-xs text-[#2d3748] font-bold block truncate">
                {contact.name || <span className="text-[#a0afc4] italic">Not found</span>}
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec7,inset_-3px_-3px_6px_#ffffff]">
            <Mail className="w-4 h-4 text-[#7C3AED]" />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] text-[#909cb0] font-bold block leading-none">EMAIL</span>
              <span className="text-xs text-[#2d3748] font-bold block truncate">
                {contact.email || <span className="text-[#a0afc4] italic">Not found</span>}
              </span>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec7,inset_-3px_-3px_6px_#ffffff]">
            <Phone className="w-4 h-4 text-[#7C3AED]" />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] text-[#909cb0] font-bold block leading-none">PHONE</span>
              <span className="text-xs text-[#2d3748] font-bold block truncate">
                {contact.phone || <span className="text-[#a0afc4] italic">Not found</span>}
              </span>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec7,inset_-3px_-3px_6px_#ffffff]">
            <Linkedin className="w-4 h-4 text-[#7C3AED]" />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] text-[#909cb0] font-bold block leading-none">LINKEDIN</span>
              <span className="text-xs text-[#2d3748] font-bold block truncate">
                {contact.linkedin ? (
                  <a
                    href={contact.linkedin.startsWith("http") ? contact.linkedin : `https://${contact.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline hover:text-[#7C3AED]"
                  >
                    View profile
                  </a>
                ) : (
                  <span className="text-[#a0afc4] italic">Not found</span>
                )}
              </span>
            </div>
          </div>

          {/* GitHub */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec7,inset_-3px_-3px_6px_#ffffff]">
            <Github className="w-4 h-4 text-[#7C3AED]" />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] text-[#909cb0] font-bold block leading-none">GITHUB</span>
              <span className="text-xs text-[#2d3748] font-bold block truncate">
                {contact.github ? (
                  <a
                    href={contact.github.startsWith("http") ? contact.github : `https://${contact.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline hover:text-[#7C3AED]"
                  >
                    View projects
                  </a>
                ) : (
                  <span className="text-[#a0afc4] italic">Not found</span>
                )}
              </span>
            </div>
          </div>

          {/* Website */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec7,inset_-3px_-3px_6px_#ffffff]">
            <Globe className="w-4 h-4 text-[#7C3AED]" />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] text-[#909cb0] font-bold block leading-none">PORTFOLIO</span>
              <span className="text-xs text-[#2d3748] font-bold block truncate">
                {contact.website ? (
                  <a
                    href={contact.website.startsWith("http") ? contact.website : `https://${contact.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline hover:text-[#7C3AED]"
                  >
                    Link
                  </a>
                ) : (
                  <span className="text-[#a0afc4] italic">Not found</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Summary Indicator */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-[#5a6a85] uppercase tracking-wider">
          Detected Sections
        </h4>
        <div className="flex flex-wrap gap-2">
          {parsedSections.map((sect) => (
            <span
              key={sect}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-extrabold select-none"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {sect}
            </span>
          ))}
          {missingSections.map((sect) => (
            <span
              key={sect}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[#e11d48] text-xs font-bold select-none opacity-80"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {sect}
            </span>
          ))}
        </div>
      </div>

      {/* Warning Panels if score is low or warnings list is populated */}
      {warnings.length > 0 && (
        <div className="space-y-3 p-4 rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec7,inset_-3px_-3px_6px_#ffffff]">
          <div className="flex items-center gap-2 text-amber-600 font-extrabold text-xs tracking-wider uppercase">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Extraction Warnings ({warnings.length})</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#5a6a85] font-semibold pl-1">
            {warnings.map((warn, index) => (
              <li key={index} className="list-disc list-inside">
                {warn}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
