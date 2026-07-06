import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useResume } from "../context/ResumeContext";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeUpload() {
  const {
    parseResumeFile,
    parsing,
    parsingProgress,
    parseError,
    parsedResume,
    resetAll,
  } = useResume();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        await parseResumeFile(file);
      }
    },
    [parseResumeFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    disabled: parsing,
  });

  const getProgressMessage = (progress) => {
    if (progress < 40) return "Reading file bytes locally...";
    if (progress < 100) return "Reconstructing document text & layout...";
    return "Identifying resume sections & contact details...";
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {/* PARSING PROGRESS STATE */}
        {parsing && (
          <motion.div
            key="parsing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-8 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] text-center space-y-6 min-h-60 select-none"
          >
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff]">
              <FileText className="w-8 h-8 text-[#7C3AED] animate-pulse" />
            </div>
            
            <div className="w-full space-y-2">
              <h3 className="font-extrabold text-sm text-[#2d3748]">
                Parsing Resume Document
              </h3>
              <p className="text-xs text-[#5a6a85] font-semibold">
                {getProgressMessage(parsingProgress)}
              </p>
            </div>

            {/* Neumorphic progress track */}
            <div className="w-full h-4 p-1 rounded-full bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec7,inset_-3px_-3px_6px_#ffffff]">
              <motion.div
                className="h-full rounded-full bg-[#7C3AED]"
                initial={{ width: "0%" }}
                animate={{ width: `${parsingProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-xs font-black text-[#7C3AED]">
              {parsingProgress}%
            </span>
          </motion.div>
        )}

        {/* PARSED COMPLETED STATE (FILE METADATA OVERVIEW) */}
        {!parsing && parsedResume && (
          <motion.div
            key="parsed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] flex items-center justify-between gap-4 select-none"
          >
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] text-[#7C3AED] rounded-2xl">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-sm text-[#2d3748] max-w-52 sm:max-w-xs truncate">
                  {parsedResume.meta.fileName}
                </h4>
                <p className="text-xs text-[#5a6a85] font-semibold">
                  Parsed successfully • PDF/DOCX Source
                </p>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="p-2.5 bg-[#e0e5ec] text-[#5a6a85] hover:text-[#e11d48] rounded-xl shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] transition-all duration-200 cursor-pointer"
              title="Remove File"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* DEFAULT UPLOAD DROPZONE */}
        {!parsing && !parsedResume && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...getRootProps()}
            className={`group flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl cursor-pointer text-center space-y-4 transition-all duration-300 min-h-60 select-none
              ${
                isDragActive
                  ? "border-[#7C3AED] bg-[#e6ebf3]"
                  : "border-[#b8bec7] bg-[#e0e5ec] hover:bg-[#e4e9f1]"
              }
              shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff]
            `}
          >
            <input {...getInputProps()} />

            <div className="p-4 bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] text-[#7C3AED] rounded-3xl transition-transform duration-300 group-hover:scale-105">
              <UploadCloud className="w-8 h-8 text-[#7C3AED]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-[#2d3748]">
                {isDragActive ? "Drop the resume here..." : "Upload Resume"}
              </h3>
              <p className="text-xs text-[#5a6a85] font-semibold">
                Drag and drop your PDF or DOCX file, or click to browse
              </p>
              <p className="text-[10px] text-[#909cb0] font-bold">
                Max file size: 5MB • Safe client-side parsing
              </p>
            </div>

            {parseError && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#b8bec7,inset_-2px_-2px_4px_#ffffff] rounded-xl text-rose-600 text-xs font-bold animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
