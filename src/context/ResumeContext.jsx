import { createContext, useContext, useState } from "react";

const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [resumeText, setResumeText]   = useState("");
  const [jobDesc, setJobDesc]         = useState("");
  const [results, setResults]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  // results clear karna — "Analyze Again" button ke liye
  function resetAll() {
    setResumeText("");
    setJobDesc("");
    setResults(null);
    setError(null);
  }

  return (
    <ResumeContext.Provider
      value={{
        resumeText, setResumeText,
        jobDesc,    setJobDesc,
        results,    setResults,
        loading,    setLoading,
        error,      setError,
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