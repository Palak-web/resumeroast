import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import ATSScore from "../components/ATSScore";
import RoastCard from "../components/RoastCard";
import KeywordPills from "../components/KeywordPills";
import DiffView from "../components/DiffView";
import EnhancedResumePreview from "../components/EnhancedResumePreview";
import { RotateCcw, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Result() {
  const navigate = useNavigate();
  const {
    results,
    resetAll,
    enhancedResume,
    generatingEnhanced,
    enhancedError,
    wantsEnhanced,
    setWantsEnhanced,
    triggerEnhancedGeneration,
  } = useResume();

  useEffect(() => {
    // Redirect if direct page navigation with no data in context
    if (!results) {
      navigate("/analyze");
    }
  }, [results, navigate]);

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#e0e5ec] text-[#2d3748]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED] mb-4" />
        <p className="text-[#5a6a85] text-sm font-semibold">Redirecting...</p>
      </div>
    );
  }

  const handleAnalyzeAgain = () => {
    resetAll();
    navigate("/analyze");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-[calc(100vh-64px)] bg-[#e0e5ec] text-[#2d3748] py-12 px-4 sm:px-6 lg:px-8 select-none"
    >
      <div className="max-w-200 mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#2d3748] sm:text-4xl">
            Audit Report
          </h1>
          <p className="text-sm text-[#5a6a85] font-semibold max-w-sm mx-auto">
            Audit analysis results based on your resume and target job requirements.
          </p>
        </div>

        {/* Top Section: ATS Score & Roast Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <ATSScore score={results.ats_score} />
          <RoastCard roast={results.roast} overallTip={results.overall_tip} />
        </div>

        {/* Keyword Analysis Section */}
        <KeywordPills
          presentKeywords={results.present_keywords}
          missingKeywords={results.missing_keywords}
        />

        {/* Improvement Diff Card Section */}
        <DiffView improvements={results.improvements} />

        {/* Enhanced Resume Step */}
        {wantsEnhanced === null && !generatingEnhanced && !enhancedError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] text-center space-y-4"
          >
            <div className="space-y-1 text-center">
              <h3 className="font-extrabold text-sm text-[#2d3748] flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                <span>Generate Your Enhanced Resume?</span>
              </h3>
              <p className="text-xs text-[#5a6a85] font-semibold max-w-md mx-auto leading-relaxed">
                We will rewrite bullet points to match the target job description, integrate missing keywords, fix roast critique items, and structure a clean version.
              </p>
            </div>
            <div className="flex gap-4 justify-center pt-2">
              <button
                onClick={() => setWantsEnhanced(false)}
                className="px-6 py-2.5 bg-[#e0e5ec] text-xs font-bold text-[#5a6a85] rounded-xl shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] transition duration-200 cursor-pointer"
              >
                No, Thanks
              </button>
              <button
                onClick={triggerEnhancedGeneration}
                className="px-6 py-2.5 bg-[#7C3AED] text-xs font-bold text-white rounded-xl hover:bg-[#6d28d9] shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] transition duration-200 cursor-pointer"
              >
                Yes, Generate!
              </button>
            </div>
          </motion.div>
        )}

        {generatingEnhanced && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] text-center space-y-4"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED] mx-auto" />
            <div className="space-y-1">
              <p className="font-extrabold text-sm text-[#2d3748]">Optimizing and Rewriting Resume...</p>
              <p className="text-xs text-[#5a6a85] font-semibold">Applying roaster critiques & injecting action verbs</p>
            </div>
          </motion.div>
        )}

        {enhancedError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] text-center space-y-4"
          >
            <div className="text-rose-600 font-bold text-xs">
              Failed to generate enhanced resume: {enhancedError}
            </div>
            <button
              onClick={triggerEnhancedGeneration}
              className="px-6 py-2 bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-[4px_4px_8px_#b8bec7] hover:bg-[#6d28d9] transition duration-200 cursor-pointer mx-auto block"
            >
              Retry Generation
            </button>
          </motion.div>
        )}

        {wantsEnhanced === true && enhancedResume && (
          <EnhancedResumePreview />
        )}

        {/* Bottom Button */}
        <div className="pt-4">
          <button
            onClick={handleAnalyzeAgain}
            className="w-full py-4.5 bg-[#e0e5ec] text-[#2d3748] hover:text-[#7C3AED] font-extrabold rounded-2xl transition-all duration-200 shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#b8bec7,inset_-6px_-6px_12px_#ffffff] cursor-pointer flex items-center justify-center gap-2 select-none"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Analyze Another Resume</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}