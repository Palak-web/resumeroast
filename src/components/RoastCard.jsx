import { Flame, Info } from "lucide-react";

export default function RoastCard({ roast = "", overallTip = "" }) {
  return (
    <div className="relative overflow-hidden bg-[#e0e5ec] rounded-3xl p-6 shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] w-full h-full flex flex-col justify-between select-none">
      
      {/* Roast Content */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🔥</span>
          <h3 className="text-sm font-extrabold text-[#2d3748] tracking-wide uppercase">
            The Audit Roast
          </h3>
        </div>

        {/* Roast text in Inset container */}
        <p className="text-[#2d3748] text-[15px] font-semibold leading-relaxed italic bg-[#e0e5ec] p-4 rounded-2xl shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff]">
          "{roast}"
        </p>
      </div>

      {/* Pro Tip Section (Spaced without borders) */}
      {overallTip && (
        <div className="mt-6 pt-4 flex items-start gap-2.5">
          <div className="p-1.5 bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#b8bec7,inset_-2px_-2px_4px_#ffffff] rounded-lg text-[#7C3AED] shrink-0">
            <Info className="w-4 h-4 shrink-0" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider">
              Pro tip:
            </h4>
            <p className="text-[#5a6a85] text-xs font-bold leading-relaxed">
              {overallTip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}