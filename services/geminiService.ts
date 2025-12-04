import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AspectRatio } from "../types";

// Initialize the client
// NOTE: In a real production app, ensure this key is safe or proxied.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helpers
const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
};

/**
 * Analyzes an image using Gemini 2.5 Flash (Faster & more reliable for general access).
 */
export const analyzeImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = "Analyze this image. Identify the main subject, the background context, and suggest the best background color for a professional ID photo based on the subject's clothing.";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          fileToGenerativePart(base64Image, mimeType),
          { text: prompt }
        ]
      }
    });

    return response.text || "Could not analyze image.";
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Failed to analyze image.");
  }
};

/**
 * Edits the background of an image using Gemini 2.5 Flash Image.
 * Used for replacing background with specific colors.
 */
export const replaceBackground = async (
  base64Image: string, 
  mimeType: string, 
  color: string,
  useHighQuality: boolean = false
): Promise<string> => {
  try {
    // Defaulting to flash-image for reliability and speed to avoid 403 errors on Pro
    const model = "gemini-2.5-flash-image";
    
    const prompt = `Replace the background of this image with a solid ${color} color. Keep the main subject exactly as is. Ensure clean edges.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          fileToGenerativePart(base64Image, mimeType),
          { text: prompt }
        ]
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("BG Replacement Error:", error);
    throw new Error("Failed to replace background.");
  }
};

/**
 * Generates/Edits image with specific prompts and Aspect Ratio using Gemini 2.5 Flash Image.
 */
export const editImageWithPrompt = async (
  base64Image: string,
  mimeType: string,
  promptText: string,
  aspectRatio: AspectRatio = "1:1"
): Promise<string> => {
  try {
    const model = "gemini-2.5-flash-image";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          fileToGenerativePart(base64Image, mimeType),
          { text: promptText }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

     // Extract image from response
     for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Edit Error:", error);
    throw new Error("Failed to edit image.");
  }
};

/**
 * Enhances image clarity using Gemini 2.5 Flash Image.
 */
export const enhanceImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const model = "gemini-2.5-flash-image";
    const prompt = "Enhance this image to high definition. Improve clarity, sharpness, and lighting while preserving the original details and identity of the subject exactly. Do not alter facial features.";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          fileToGenerativePart(base64Image, mimeType),
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
           aspectRatio: "1:1", // Preserve roughly original or standard
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Enhance Error:", error);
    throw new Error("Failed to enhance image.");
  }
};

/**
 * Creates a passport standard photo using Gemini 2.5 Flash Image.
 */
export const createPassportPhoto = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const model = "gemini-2.5-flash-image";
    // Instruction for passport standard
    const prompt = "Transform this into a professional passport photo. Crop to a standard head-and-shoulders shot. Change background to solid white. Ensure the subject is centered, facing forward, and lighting is even. Keep the person's identity exactly the same.";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          fileToGenerativePart(base64Image, mimeType),
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4" // Standard passport ratio
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Passport Gen Error:", error);
    throw new Error("Failed to create passport photo.");
  }
};

/**
 * Chat with the AI Assistant.
 */
export const sendChatMessage = async (history: {role: string, parts: {text: string}[]}[], newMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: history,
      config: {
        systemInstruction: "You are the helpful assistant for the 'Imam Malik Image Background Remover' app created by Imam Malik Computer Professionals. You help users remove backgrounds, create passport photos, and enhance images. Programmer credit goes to Alkasim Umar.",
      }
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "I didn't catch that.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Sorry, I'm having trouble connecting to the server.";
  }
};