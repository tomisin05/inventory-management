import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });


// Define the structure we want the model to follow
export const recipeStructure = {
  name: "string",
  prepTime: "string",
  cookTime: "string",
  servings: "number",
  ingredients: ["string"],
  instructions: ["string"],
  nutritionalInfo: {
    calories: "string",
    protein: "string",
    carbs: "string",
    fat: "string"
  }
};
