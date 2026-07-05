const API_KEY = import.meta.env.VITE_GEMINI_KEY;

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
export async function analyzeResume(resumeText, jobDescription) {

  // ------- PROMPT -------
  const prompt = `
You are a brutally honest resume reviewer with sharp dark humor.
Analyze the resume against the job description carefully.

Return ONLY raw valid JSON — no markdown, no backticks, no explanation.
Use exactly this structure:

{
  "ats_score": <number between 0 and 100>,
  "roast": "<2-3 sentences. Funny but genuinely useful critique. Be specific, not generic.>",
  "improvements": [
    {
      "original": "<exact weak bullet from resume>",
      "rewritten": "<strong rewritten version with action verb + metric>"
    }
  ],
  "missing_keywords": ["<keyword from JD not in resume>"],
  "present_keywords": ["<keyword from JD found in resume>"],
  "overall_tip": "<single most important actionable suggestion>"
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

CRITICAL: Return ONLY raw valid JSON. 
No markdown. No backticks. No explanation.
Start directly with { and end with }
  `;

  // ------- API CALL -------
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,       // creativity level
        maxOutputTokens: 8192,// enough for full JSON
      }
    }),
  });

  // ------- ERROR HANDLING -------
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData?.error?.message || "Gemini API call failed");
  }

  const data = await response.json();

  // ------- EXTRACT TEXT -------
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Empty response from Gemini");
  }

  // ------- CLEAN + PARSE JSON -------
  // Gemini kabhi kabhi ```json ... ``` wrap kar deta hai — strip karo
  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/^[^{]*/, "")
    .replace(/[^}]*$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (parseErr) {
    console.error("Raw Gemini response:", rawText);
    throw new Error("JSON parse failed. Gemini ne unexpected format diya.");
  }
}