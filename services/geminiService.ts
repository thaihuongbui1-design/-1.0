import { GoogleGenAI } from "@google/genai";
import { AspectRatio, GenerationSettings } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using the Nano Banana / Flash Image model
const MODEL_NAME = 'gemini-2.5-flash-image';

interface GenerateImageParams {
  prompt: string;
  base64Image?: string; // Optional input image for editing/variation
  settings: GenerationSettings;
}

/**
 * Generates an image using the Nano Banana (Gemini 2.5 Flash Image) model.
 * It supports both text-to-image and image-to-image (editing).
 */
export const generateImage = async ({
  prompt,
  base64Image,
  settings,
}: GenerateImageParams): Promise<string> => {
  
  const parts: any[] = [];

  // If we have an input image, add it first (editing mode)
  if (base64Image) {
    // Extract base64 data if it includes the prefix
    const cleanBase64 = base64Image.split(',')[1] || base64Image;
    parts.push({
      inlineData: {
        data: cleanBase64,
        mimeType: 'image/jpeg', // The model handles common image formats
      },
    });
  }

  // Add the text prompt
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
            aspectRatio: settings.aspectRatio
        },
        temperature: settings.temperature,
      },
    });

    // Extract the image from the response
    // The response may contain multiple parts; iterate to find the image.
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          // Construct data URL
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    // Fallback if no image found
    throw new Error("No image data found in response. The model might have refused the request.");

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};