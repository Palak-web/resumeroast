import { createContext, useContext, useState } from "react";
import { parsePdf } from "../utils/parser/pdfParser";
import { parseDocx } from "../utils/parser/docxParser";
import { normalizeText } from "../utils/parser/textNormalizer";
import { detectSections } from "../utils/parser/sectionDetector";
import { generateEnhancedResume } from "../utils/gemini";

const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [resumeText, setResumeText]       = useState("");
  const [jobDesc, setJobDesc]             = useState("");
  const [results, setResults]             = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  
  // New parser states
  const [parsedResume, setParsedResume]   = useState(null); // stores { meta, contact, sections, rawText, extractionQuality }
  const [isParsed, setIsParsed]           = useState(false);
  const [parseError, setParseError]       = useState(null);
  const [parsing, setParsing]             = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);

  // New enhanced resume states
  const [enhancedResume, setEnhancedResume]         = useState(null); // stores { summary, experience, skills, projects, education, certifications, fullText }
  const [generatingEnhanced, setGeneratingEnhanced] = useState(false);
  const [enhancedError, setEnhancedError]           = useState(null);
  const [wantsEnhanced, setWantsEnhanced]           = useState(null); // null/true/false

  // Function to process upload files
  async function parseResumeFile(file) {
    setParsing(true);
    setParseError(null);
    setParsingProgress(0);
    setIsParsed(false);

    try {
      let extracted = { text: "" };

      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        extracted = await parsePdf(file, (p) => setParsingProgress(p));
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".docx")
      ) {
        setParsingProgress(30);
        extracted = await parseDocx(file);
        setParsingProgress(100);
      } else {
        throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
      }

      if (!extracted.text.trim()) {
        throw new Error("No text content could be extracted from this document.");
      }

      // Normalization
      const normalized = normalizeText(extracted.text);
      
      // Section & Contact detection
      const parsedData = detectSections(normalized, file.name);

      setParsedResume(parsedData);
      setResumeText(parsedData.rawText); // sync text for editing & analysis
      setIsParsed(true);
    } catch (err) {
      console.error("Context Parsing Pipeline Error:", err);
      setParseError(err.message || "An error occurred while parsing the document.");
      setIsParsed(false);
      setParsedResume(null);
    } finally {
      setParsing(false);
    }
  }

  // Trigger enhanced generation using Gemini
  async function triggerEnhancedGeneration() {
    if (!resumeText || !jobDesc || !results) {
      setEnhancedError("Missing required data for resume enhancement.");
      return;
    }

    setGeneratingEnhanced(true);
    setEnhancedError(null);

    try {
      const resumeInput = parsedResume ? parsedResume : resumeText;
      const enhanced = await generateEnhancedResume(resumeInput, jobDesc, results);
      setEnhancedResume(enhanced);
      setWantsEnhanced(true);
    } catch (err) {
      console.error("Context Resume Enhancement Error:", err);
      setEnhancedError(err.message || "Failed to generate enhanced resume. Please try again.");
    } finally {
      setGeneratingEnhanced(false);
    }
  }

  // results clear karna — "Analyze Again" button ke liye
  function resetAll() {
    setResumeText("");
    setJobDesc("");
    setResults(null);
    setError(null);
    setParsedResume(null);
    setIsParsed(false);
    setParseError(null);
    setParsing(false);
    setParsingProgress(0);
    setEnhancedResume(null);
    setGeneratingEnhanced(false);
    setEnhancedError(null);
    setWantsEnhanced(null);
  }

  return (
    <ResumeContext.Provider
      value={{
        resumeText, setResumeText,
        jobDesc,    setJobDesc,
        results,    setResults,
        loading,    setLoading,
        error,      setError,
        parsedResume, setParsedResume,
        isParsed, setIsParsed,
        parseError, setParseError,
        parsing, setParsing,
        parsingProgress, setParsingProgress,
        parseResumeFile,
        enhancedResume, setEnhancedResume,
        generatingEnhanced, setGeneratingEnhanced,
        enhancedError, setEnhancedError,
        wantsEnhanced, setWantsEnhanced,
        triggerEnhancedGeneration,
        resetAll,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}