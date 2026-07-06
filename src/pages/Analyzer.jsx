import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import { analyzeResume } from "../utils/gemini";
import { parseResponse } from "../utils/parseResponse";
import { Flame, AlertCircle, FileText, Briefcase, Loader2, FileEdit, Eye } from "lucide-react";
import Loader from "../components/Loader";
import ResumeUpload from "../components/ResumeUpload";
import ParsingQuality from "../components/ParsingQuality";

export default function Analyzer() {
  const navigate = useNavigate();
  const {
    resumeText, setResumeText,
    jobDesc,    setJobDesc,
    setResults,
    loading,    setLoading,
    error,      setError,
    isParsed,
    parsedResume,
  } = useResume();

  const [showRawEdit, setShowRawEdit] = useState(false);

  async function handleAnalyze() {
    if (resumeText.trim().length < 50) {
      setError("Please upload a file or paste a valid resume (at least 50 characters).");
      return;
    }
    if (jobDesc.trim().length < 30) {
      setError("Please paste a valid job description (at least 30 characters).");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Send either parsed JSON structure (as meta fields + text) or raw text depending on whether it exists
      const resumeInput = parsedResume ? parsedResume : resumeText;
      const raw = await analyzeResume(resumeInput, jobDesc);
      const parsed = parseResponse(raw);
      setResults(parsed);
      navigate("/result");
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Loader message="Analyzing your resume..." />}
      <div className="min-h-[calc(100vh-64px)] bg-[#e0e5ec] text-[#2d3748] py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#2d3748] select-none">
              Analyze Resume
            </h1>
            <p className="text-sm text-[#5a6a85] font-semibold max-w-xl">
              Audit your resume details against target job descriptions to identify opportunities, misses, and structure improvements.
            </p>
          </div>

          {/* Form Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Resume Upload & Info Panel */}
            <div className="flex flex-col gap-6">
              {/* Upload Card */}
              <div className="flex flex-col gap-4 p-6 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff]">
                <label className="flex items-center gap-2 font-bold text-sm text-[#2d3748]">
                  <FileText className="w-4 h-4 text-[#7C3AED]" />
                  <span>Resume Source File</span>
                </label>
                
                <ResumeUpload />

                {isParsed && (
                  <button
                    type="button"
                    onClick={() => setShowRawEdit(!showRawEdit)}
                    className="mt-2 flex items-center justify-center gap-2 py-3 bg-[#e0e5ec] text-xs font-bold text-[#7C3AED] rounded-2xl shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] transition duration-200 cursor-pointer select-none"
                  >
                    {showRawEdit ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Hide Extracted Text</span>
                      </>
                    ) : (
                      <>
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>View / Edit Extracted Text</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Raw Text Fallback (Visible if not parsed, or explicitly toggled) */}
              {(!isParsed || showRawEdit) && (
                <div className="flex flex-col gap-4 p-6 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-bold text-sm text-[#2d3748]">
                      <FileEdit className="w-4 h-4 text-[#7C3AED]" />
                      <span>{isParsed ? "Extracted Plain Text" : "Or Paste Plain Resume"}</span>
                    </label>
                    {isParsed && (
                      <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-500/10 px-2 py-1 rounded-md">
                        Editable
                      </span>
                    )}
                  </div>
                  <textarea
                    className="w-full min-h-70 p-4 bg-[#e0e5ec] text-[#2d3748] shadow-[inset_6px_6px_12px_#b8bec7,inset_-6px_-6px_12px_#ffffff] rounded-2xl
                               resize-none focus:outline-none placeholder-[#909cb0] transition duration-200 border-none outline-none text-sm font-medium"
                    placeholder="Paste the plain text of your resume here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    disabled={loading}
                  />
                  <div className="flex justify-between items-center text-xs text-[#5a6a85] font-bold px-1 select-none">
                    <span>Plain text copy</span>
                    <span>{resumeText.length} characters</span>
                  </div>
                </div>
              )}

              {/* Parsing Quality Indicators */}
              {isParsed && <ParsingQuality />}
            </div>

            {/* Job Description Input */}
            <div className="flex flex-col gap-4 p-6 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff]">
              <label className="flex items-center gap-2 font-bold text-sm text-[#2d3748]">
                <Briefcase className="w-4 h-4 text-[#7C3AED]" />
                <span>Job Description</span>
              </label>
              <textarea
                className="w-full min-h-70 p-4 bg-[#e0e5ec] text-[#2d3748] shadow-[inset_6px_6px_12px_#b8bec7,inset_-6px_-6px_12px_#ffffff] rounded-2xl
                           resize-none focus:outline-none placeholder-[#909cb0] transition duration-200 border-none outline-none text-sm font-medium"
                placeholder="Paste the target job description here..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                disabled={loading}
              />
              <div className="flex justify-between items-center text-xs text-[#5a6a85] font-bold px-1 select-none">
                <span>Required terms analyzer</span>
                <span>{jobDesc.length} characters</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 px-4 py-3.5 bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] rounded-2xl text-rose-600 text-sm font-bold animate-shake select-none">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>Validation Error: </span>
                {error}
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-4.5 bg-[#7C3AED] hover:bg-[#6d28d9] text-white font-extrabold rounded-2xl transition-all duration-200 shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#b8bec7,inset_-6px_-6px_12px_#ffffff] disabled:opacity-50 disabled:shadow-[inset_6px_6px_12px_#b8bec7,inset_-6px_-6px_12px_#ffffff] disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing your resume...</span>
              </>
            ) : (
              <>
                <Flame className="w-5 h-5" />
                <span>Roast My Resume</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}