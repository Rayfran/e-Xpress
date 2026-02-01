
import { GoogleGenAI, Type } from "@google/genai";

export async function analyzeProductImage(base64Image: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Analise esta imagem de um produto industrial ou eletrônico. Identifique o nome do produto, uma breve descrição técnica e sugira uma categoria e um preço médio em Reais (BRL). Responda apenas em JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER }
          },
          required: ["name", "description", "category", "suggestedPrice"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Erro na análise da IA:", error);
    return null;
  }
}
