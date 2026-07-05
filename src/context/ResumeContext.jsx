import { createContext, useContext, useState } from "react";

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