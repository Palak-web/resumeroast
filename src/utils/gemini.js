const API_KEY = import.meta.env.VITE_GEMINI_KEY;

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
export async function analyzeResume(resumeInput, jobDescription) {
  // Convert object or string payload cleanly
  let resumeContent = "";
  if (resumeInput && typeof resumeInput === "object") {
    // It's a parsed resume structure { meta, contact, sections, rawText }
    // Format sections and contact details to give the model clean structured inputs
    resumeContent = `
[STRUCTURED PARSED RESUME JSON]:
${JSON.stringify({
  contact: resumeInput.contact,
  sections: resumeInput.sections,
}, null, 2)}

[RAW UNSTRUCTURED RESUME TEXT]:
${resumeInput.rawText}
`;
  } else {
    resumeContent = typeof resumeInput === "string" ? resumeInput : String(resumeInput);
  }

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
${resumeContent}

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

export async function generateEnhancedResume(resumeInput, jobDescription, roastAnalysis) {
  // Convert object or string payload cleanly
  let resumeContent = "";
  if (resumeInput && typeof resumeInput === "object") {
    resumeContent = `
[STRUCTURED PARSED RESUME JSON]:
${JSON.stringify({
  contact: resumeInput.contact,
  sections: resumeInput.sections,
}, null, 2)}

[RAW UNSTRUCTURED RESUME TEXT]:
${resumeInput.rawText || ""}
`;
  } else {
    resumeContent = typeof resumeInput === "string" ? resumeInput : String(resumeInput);
  }

  const prompt = `
You are a highly skilled resume writer and career consultant.
Your objective is to rewrite the user's resume into a recruiter-ready, ATS-optimized version.

To do this:
1. Fix any weak resume bullets using the provided Roast Analysis and targeted improvements. Add action verbs, metrics, and achievements.
2. Optimize the resume for the target job description by integrating relevant keywords naturally.
3. Keep the tone professional, direct, and active.
4. Maintain absolute factual accuracy. Do not make up fake credentials or titles.

Return ONLY raw valid JSON — no markdown, no backticks, no explanation.
Use exactly this structure:

{
  "summary": "<a compelling 3-4 sentence professional summary tailored to the target job>",
  "experience": [
    {
      "company": "<company name>",
      "position": "<job title>",
      "startDate": "<start date>",
      "endDate": "<end date>",
      "location": "<location or empty>",
      "highlights": [
        "<optimized, high-impact bullet point 1 with action verbs and metrics>",
        "<optimized, high-impact bullet point 2 with action verbs and metrics>"
      ]
    }
  ],
  "skills": ["<skill 1>", "<skill 2>"],
  "projects": [
    {
      "name": "<project name>",
      "description": "<project description>",
      "url": "<project link or empty>",
      "highlights": [
        "<optimized bullet point 1>",
        "<optimized bullet point 2>"
      ]
    }
  ],
  "education": [
    {
      "institution": "<school name>",
      "degree": "<degree, e.g. B.S. in Computer Science>",
      "startDate": "<start date>",
      "endDate": "<end date>",
      "gpa": "<gpa or empty>",
      "location": "<location or empty>"
    }
  ],
  "certifications": ["<certification 1>"],
  "fullText": "<A clean, beautifully formatted plain-text representation of the full resume ready for copy-pasting. Indent sections clearly with empty lines, use bullet points (-) for highlights, and include all contact info at the top. Do not use markdown blocks here.>"
}

ORIGINAL RESUME:
${resumeContent}

ROAST ANALYSIS AND CRITIQUE:
${JSON.stringify(roastAnalysis, null, 2)}

TARGET JOB DESCRIPTION:
${jobDescription}

CRITICAL: Return ONLY raw valid JSON. 
No markdown. No backticks. No explanation.
Start directly with { and end with }
  `;

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
        temperature: 0.6,       // lower temperature for accuracy
        maxOutputTokens: 8192,
      }
    }),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData?.error?.message || "Gemini API call failed during resume enhancement");
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Empty response from Gemini during resume enhancement");
  }

  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/^[^{]*/, "")
    .replace(/[^}]*$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (parseErr) {
    console.error("Raw Gemini Response:", rawText);
    throw new Error("JSON parse failed during resume enhancement. Try again.");
  }
}