import { Loader2, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function Loader({ message = "Analyzing your resume..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#e0e5ec]/90 backdrop-blur-md transition-all duration-300 select-none">
      <div className="relative flex flex-col items-center space-y-6">
        
        {/* Pulsing Flame Icon container (Neumorphic Raised Tray) */}
        <motion.div
          className="relative flex items-center justify-center w-24 h-24 bg-[#e0e5ec] rounded-full shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff]"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          {/* Spinner Ring */}
          <Loader2 className="absolute w-16 h-16 text-[#7C3AED] animate-spin opacity-90" />
          {/* Central Fire Emoji/Icon */}
          <Flame className="w-7 h-7 text-[#7C3AED] fill-[#7C3AED]/10" />
        </motion.div>

        {/* Status Messages */}
        <div className="text-center space-y-1.5 z-10">
          <h3 className="text-[#2d3748] font-extrabold text-base tracking-wide select-none animate-pulse">
            ResumeRoast
          </h3>
          <p className="text-[#5a6a85] text-xs font-bold uppercase tracking-widest max-w-50 leading-relaxed select-none">
            {message}
          </p>
        </div>

        {/* Subtle decorative bottom loading lines (Neumorphic Inset Track) */}
        <div className="w-28 h-2 bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#b8bec7,inset_-2px_-2px_4px_#ffffff] rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#7C3AED] rounded-full"
            animate={{
              left: ["-50%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
}