import { motion } from "framer-motion";
import { ArrowRight, Sparkles, HelpCircle } from "lucide-react";

export default function DiffView({ improvements = [] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Title */}
      <div className="border-b border-zinc-800/60 pb-4">
        <h3 className="text-base font-bold text-white tracking-wide">
          Bullet Rewrites
        </h3>
        <p className="text-zinc-500 text-xs mt-1">
          Before & After comparisons of weak bullet points compared to optimized versions.
        </p>
      </div>

      {improvements.length === 0 ? (
        <p className="text-zinc-500 text-sm italic">No rewrites suggested for this resume.</p>
      ) : (
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {improvements.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative p-0.5 rounded-2xl bg-zinc-900 border border-zinc-800/80 group hover:border-purple-500/20 transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-[14px]">
                {/* Before Card */}
                <div className="relative flex flex-col justify-between p-4 rounded-xl bg-rose-950/10 border border-rose-900/20">
                  <div>
                    <span className="inline-block text-[10px] font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded uppercase tracking-wider mb-3">
                      BEFORE
                    </span>
                    <p className="text-zinc-300 text-sm font-mono leading-relaxed wrap-break-word">
                      "{item.original}"
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400/60 text-xs mt-4">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Plain description / missing metrics</span>
                  </div>
                </div>

                {/* After Card */}
                <div className="relative flex flex-col justify-between p-4 rounded-xl bg-emerald-950/15 border border-emerald-900/25">
                  <div>
                    <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded uppercase tracking-wider mb-3">
                      AFTER
                    </span>
                    <p className="text-white text-sm font-medium leading-relaxed wrap-break-word">
                      "{item.rewritten}"
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400/85 text-xs mt-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Action verb & impact quantified</span>
                  </div>
                </div>
              </div>

              {/* Central Arrow (desktop viewports) */}
              <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center bg-[#18181B] border border-zinc-800 rounded-full text-purple-400 shadow-md group-hover:border-purple-500/50 transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}