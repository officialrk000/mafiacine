
import { GoogleGenAI } from "@google/genai";
import { Transaction, TransactionType } from "../types";

export const getAIInsights = async (transactions: Transaction[]): Promise<string> => {
  if (!process.env.API_KEY) return "Please provide an API key for AI insights.";
  if (transactions.length === 0) return "Add some transactions to get personalized financial advice!";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Group and summarize transactions for context
    const summary = transactions.reduce((acc, t) => {
      const key = `${t.type}_${t.category}`;
      acc[key] = (acc[key] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const prompt = `
      As a world-class financial advisor, analyze these transactions (currency: INR ₹) and provide 3 short, actionable tips to improve financial health.
      Transactions Summary: ${JSON.stringify(summary)}
      Focus on reducing expenses if they are high relative to income. Keep the tone professional but encouraging.
      Format the response in clear bullet points using Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "I couldn't generate insights right now. Try again later!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI insights. Please check your connection.";
  }
};
