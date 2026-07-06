import * as pdfjs from "pdfjs-dist";

// Initialize PDF.js worker with standard ESM resolution and a CDN fallback
const pdfjsVersion = "6.1.200";
try {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
} catch (e) {
  console.warn("Falling back to CDN for PDF.js Worker:", e);
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;
}

/**
 * Parses a PDF File in the browser using PDF.js.
 * Supports a custom onProgress callback to feed progress percentages to the UI.
 */
export async function parsePdf(file, onProgress) {
  if (!file) {
    throw new Error("No file provided for parsing.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result;
      if (!arrayBuffer) {
        return reject(new Error("Failed to load PDF file as ArrayBuffer."));
      }

      try {
        const loadingTask = pdfjs.getDocument({
          data: new Uint8Array(arrayBuffer),
          useSystemFonts: true,
          disableFontFace: false,
        });

        // Track document loading progress
        if (onProgress) {
          loadingTask.onProgress = (progress) => {
            if (progress.total > 0) {
              const loadedRatio = progress.loaded / progress.total;
              onProgress(Math.round(loadedRatio * 40)); // 0-40% is file loading
            }
          };
        }

        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        let fullText = "";

        // Extract text page by page
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          let lastY = null;
          let pageText = "";

          // Arrange elements into readable text lines by parsing coordinates (heuristics)
          for (const item of textContent.items) {
            if (!item.str) continue;
            
            // Check vertical positioning changes to add natural line breaks
            const currentY = item.transform[5];
            if (lastY !== null && Math.abs(currentY - lastY) > 5) {
              pageText += "\n";
            }
            
            pageText += item.str + " ";
            lastY = currentY;
          }

          fullText += pageText + "\n\n";

          if (onProgress) {
            // Scale progress from 40% to 100% during page extraction
            const extractionProgress = 40 + Math.round((pageNum / totalPages) * 60);
            onProgress(extractionProgress);
          }
        }

        resolve({
          text: fullText,
          totalPages,
        });
      } catch (err) {
        console.error("PDF.js extraction error:", err);
        reject(
          new Error(
            "Failed to parse PDF. Your file might be password-protected, encrypted, or contain only scanned images."
          )
        );
      }
    };

    reader.onerror = (err) => {
      console.error("FileReader failed:", err);
      reject(new Error("Failed to read file from local disk."));
    };

    reader.readAsArrayBuffer(file);
  });
}
