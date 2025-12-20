
import { GoogleGenAI, Type } from "@google/genai";
import { CuratorResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getArtCritique(imageUrl: string): Promise<CuratorResponse | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: "Analyze this image as a professional art curator. Provide a detailed critique, describe the mood, and offer hypothetical historical context." },
            { 
              inlineData: {
                mimeType: "image/jpeg",
                data: await fetchImageAsBase64(imageUrl)
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            critique: { type: Type.STRING },
            mood: { type: Type.STRING },
            historicalContext: { type: Type.STRING }
          },
          required: ["critique", "mood", "historicalContext"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}

async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
