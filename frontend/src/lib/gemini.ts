import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey =
  import.meta.env.VITE_GOOGLE_AI_STUDIO_API;

if (!apiKey) {
  console.error("Gemini API key missing in env variables!");
}

export const genAI = new GoogleGenerativeAI(apiKey);

// For models like Gemini 1.5 Flash / Pro
export const geminiModel = genAI.getGenerativeModel({
  model: import.meta.env.VITE_GOOGLE_AI_MODEL || "gemini-1.5-pro",
});