import { OpenRouterResponse } from '../types';
import { SYSTEM_PROMPT } from '../constants';

// ============================================================================
// 🔑 API KEY CONFIGURATION
// ============================================================================
// Please enter your OpenRouter API Key below.
// In a production environment, this should come from a secure backend proxy.
export const OPENROUTER_API_KEY = 'sk-'; // <--- PASTE KEY HERE
// ============================================================================

export const analyzeImageWithClaude = async (base64Image: string): Promise<string> => {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API Key is missing. Please add it in services/openRouterService.ts");
  }

  const payload = {
    model: "openai/gpt-5.2",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please inspect this PCB image for defects."
          },
          {
            type: "image_url",
            image_url: {
              url: base64Image // data:image/jpeg;base64,...
            }
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin, // Required by OpenRouter
        "X-Title": "PCB Defect Demo", // Optional
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(`API Error: ${errData.error?.message || response.statusText}`);
    }

    const data: OpenRouterResponse = await response.json();
    return data.choices[0]?.message?.content || "No analysis returned.";

  } catch (error) {
    console.error("AI Inspection Failed:", error);
    throw error;
  }
};