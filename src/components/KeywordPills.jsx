import { Check, X, Award, Bookmark } from "lucide-react";

export default function KeywordPills({ presentKeywords = [], missingKeywords = [] }) {
  const isPerfect = missingKeywords.length === 0 && presentKeywords.length > 0;
  const hasKeywords = presentKeywords.length > 0 || missingKeywords.length > 0;

  return (
    <div className="bg-[#e0e5ec] rounded-3xl p-6 shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] space-y-6 select-none">
      {/* Heading with Icon (No border) */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-[#7C3AED]" />
          <h3 className="text-base font-extrabold text-[#2d3748] tracking-wide">
            Keyword Match Analysis
          </h3>
        </div>
        {isPerfect && (
          <span className="flex items-center gap-1 px-3 py-1.5 bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec7,inset_-3px_-3px_6px_#ffffff] text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" /> Perfect Match!
          </span>
        )}
      </div>

      {!hasKeywords ? (
        <p className="text-[#5a6a85] text-sm font-semibold italic py-2">No keywords parsed from the resume.</p>
      ) : (
        <div className="space-y-6">
          {/* Matched Keywords (Green Pills inside soft inset trays) */}
          <div>
            <h4 className="text-xs font-bold text-[#5a6a85] uppercase tracking-wider mb-3">
              Matched Keywords ({presentKeywords.length})
            </h4>
            {presentKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {presentKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec7,inset_-3px_-3px_6px_#ffffff] text-emerald-600 rounded-xl text-xs font-bold"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{keyword}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[#5a6a85] text-xs font-semibold italic">No matching keywords detected.</p>
            )}
          </div>

          {/* Missing Keywords (Red Pills inside soft inset trays) */}
          <div>
            <h4 className="text-xs font-bold text-[#5a6a85] uppercase tracking-wider mb-3">
              Missing Keywords ({missingKeywords.length})
            </h4>
            {missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {missingKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec7,inset_-3px_-3px_6px_#ffffff] text-rose-600 rounded-xl text-xs font-bold"
                  >
                    <X className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{keyword}</span>
                  </span>
                ))}
              </div>
            ) : (
              presentKeywords.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] rounded-2xl text-center sm:text-left gap-4">
                  <div>
                    <h5 className="text-emerald-600 text-sm font-extrabold">
                      🎉 Perfect match!
                    </h5>
                    <p className="text-[#5a6a85] text-xs font-semibold mt-0.5">
                      Your resume lists every single key skill identified in the job description.
                    </p>
                  </div>
                  <span className="hidden sm:inline-block px-4 py-2 bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff] text-emerald-600 rounded-xl text-xs font-extrabold">
                    100% Match
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}