export function parseResponse(raw) {
  return {
    ats_score: typeof raw.ats_score === "number"
      ? Math.min(100, Math.max(0, raw.ats_score))
      : 0,

    roast: raw.roast || "Bhai kuch toh likha hota resume mein.",

    improvements: Array.isArray(raw.improvements)
      ? raw.improvements.filter(
          (item) => item.original && item.rewritten
        )
      : [],

    missing_keywords: Array.isArray(raw.missing_keywords)
      ? raw.missing_keywords
      : [],

    present_keywords: Array.isArray(raw.present_keywords)
      ? raw.present_keywords
      : [],

    overall_tip: raw.overall_tip || "Resume ko dobara dekho yaar.",
  };
}