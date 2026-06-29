import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import ATSScore from "../components/ATSScore";
import RoastCard from "../components/RoastCard";
import KeywordPills from "../components/KeywordPills";
import DiffView from "../components/DiffView";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function Result() {
  const navigate = useNavigate();
  const { results, resetAll } = useResume();

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