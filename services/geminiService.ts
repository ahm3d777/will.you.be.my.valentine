import { GoogleGenAI, Type } from "@google/genai";
import { DateIdea } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateDateIdeas = async (): Promise<DateIdea[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 3 cute, creative, and romantic date ideas for Valentine's Day. Keep them brief, fun, and heartwarming. Return strictly valid JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A catchy title for the date" },
              description: { type: Type.STRING, description: "A short description of the activity (1-2 sentences)" },
              emoji: { type: Type.STRING, description: "A single emoji representing the date" }
            },
            required: ["title", "description", "emoji"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DateIdea[];
    }
    return [];
  } catch (error) {
    console.error("Error generating date ideas:", error);
    // Fallback data in case of error
    return [
      {
        title: "Starlit Picnic",
        description: "A cozy blanket, some strawberries, and stargazing in the park.",
        emoji: "🧺"
      },
      {
        title: "Pottery Painting",
        description: "Making silly mugs for each other at a local pottery studio.",
        emoji: "🎨"
      },
      {
        title: "Dessert Crawl",
        description: "Going to 3 different places just for the best sweet treats in town.",
        emoji: "🍦"
      }
    ];
  }
};