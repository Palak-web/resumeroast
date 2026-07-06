import mammoth from "mammoth";

/**
 * Parses a DOCX File object in the browser using Mammoth.js.
 * Returns the extracted raw text and any warnings generated.
 */
export async function parseDocx(file) {
  if (!file) {
    throw new Error("No file provided for parsing.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result;
      if (!arrayBuffer) {
        return reject(new Error("Failed to load file content as ArrayBuffer."));
      }

      try {
        // Extract raw text from word document
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        resolve({
          text: result.value || "",
          warnings: result.messages?.map(m => m.message) || [],
        });
      } catch (err) {
        console.error("Mammoth DOCX parsing failed:", err);
        reject(new Error("Unable to parse Word document. The file structure may be corrupted or password-protected."));
      }
    };

    reader.onerror = (err) => {
      console.error("FileReader failed:", err);
      reject(new Error("Failed to read file from disk."));
    };

    reader.readAsArrayBuffer(file);
  });
}
