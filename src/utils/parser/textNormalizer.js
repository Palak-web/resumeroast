/**
 * Utility to clean, normalize, and sanitize raw text extracted from PDF or DOCX files.
 * Handles messy formatting, weird line wraps, ligatures, bullet points, and tab stops.
 */
export function normalizeText(rawText) {
  if (!rawText || typeof rawText !== "string") return "";

  let text = rawText;

  // 1. Unify line breaks to standard \n
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 2. Normalize smart quotes and common ligatures
  text = text
    .replace(/[\u2018\u2019]/g, "'") // Left/Right single quotation mark
    .replace(/[\u201C\u201D]/g, '"') // Left/Right double quotation mark
    .replace(/\u2013/g, "-")        // En dash
    .replace(/\u2014/g, "--")       // Em dash
    .replace(/\u2022/g, "-")        // Bullet symbol -> hyphen
    .replace(/[\u25E6\u2023\u2219\u25C9\u25AA\u25AB\u2043]/g, "-"); // Other bullet shapes

  // 3. Replace multiple horizontal tabs/spaces with a single space
  text = text.replace(/[ \t\u00A0]+/g, " ");

  // 4. Resolve hyphenation wrap-around words (e.g. "soft-\nware" -> "software")
  // Note: Only merge if it matches word characters
  text = text.replace(/(\w+)-\n(\w+)/g, "$1$2");

  // 5. Clean up multiple empty lines (allow max 2 consecutive line breaks for paragraph breaks)
  text = text.replace(/\n{3,}/g, "\n\n");

  // 6. Strip leading and trailing whitespace from the overall file and each line
  text = text
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();

  return text;
}
