import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function ATSScore({ score = 0 }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [score, count]);

  // Color selection based on the score threshold
  let strokeColor = "stroke-rose-500";
  let textColor = "text-rose-600";
  let ringBgColor = "bg-rose-500/10";
  let ratingText = "Needs Refactor";

  if (score >= 70) {
    strokeColor = "stroke-emerald-500";
    textColor = "text-emerald-600";
    ringBgColor = "bg-emerald-500/10";
    ratingText = "Strong Match";
  } else if (score >= 40) {
    strokeColor = "stroke-amber-500";
    textColor = "text-amber-600";
    ringBgColor = "bg-amber-500/10";
    ratingText = "Partially Matches";
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#e0e5ec] rounded-3xl shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] w-full h-full relative overflow-hidden group select-none">
      {/* Pulsing wrapper for ring - Styled as an inset circle tray */}
      <motion.div
        className="relative flex items-center justify-center w-48 h-48 rounded-full p-4 bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#b8bec7,inset_-6px_-6px_12px_#ffffff]"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle track */}
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-zinc-300/50 fill-none"
            strokeWidth="7"
          />
          {/* Animated progress circle indicator */}
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            className={`${strokeColor} fill-none`}
            strokeWidth="7"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: score / 100 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />
        </svg>

        {/* Score text display inside */}
        <div className="absolute flex flex-col items-center">
          <span className={`text-5xl font-extrabold tracking-tighter ${textColor}`}>
            {displayValue}
          </span>
          <span className="text-[#5a6a85] text-[10px] font-bold uppercase tracking-wider mt-1">
            out of 100
          </span>
        </div>
      </motion.div>

      {/* Label and Info */}
      <div className="mt-6 text-center space-y-1 z-10">
        <h3 className="text-[#2d3748] font-extrabold text-sm tracking-wide">
          ATS Score
        </h3>
        <p className="text-[#5a6a85] text-xs font-bold uppercase tracking-wider">
          Rating: <span className={textColor}>{ratingText}</span>
        </p>
      </div>
    </div>
  );
}