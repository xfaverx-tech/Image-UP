
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static async getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Mejora de imagen (Upscaling/Restoration) usando modelos Flash gratuitos.
   */
  static async enhanceImage(file: File): Promise<string> {
    const ai = await this.getAI();
    const base64 = await this.fileToBase64(file);
    
    const prompt = "SUPER-RESOLUTION RECONSTRUCTION: Act as a professional high-end image restorer. Take this image and reconstruct it with extreme clarity. Regenerate high-frequency details, sharpen edges perfectly, remove artifacts, and make it look like a high-resolution 4K photograph. Output ONLY the resulting image.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType: file.type } },
          { text: prompt }
        ]
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!part?.inlineData) throw new Error("No se pudo procesar la mejora de imagen.");
    return `data:image/png;base64,${part.inlineData.data}`;
  }

  /**
   * Remix / Fusión de imágenes mejorado.
   * Ahora usa una lógica estructural: Imagen 1 es la base de composición, Imagen 2 es el estilo/sujeto.
   */
  static async fuseImages(file1: File, file2: File, instruction?: string): Promise<string> {
    const ai = await this.getAI();
    const b1 = await this.fileToBase64(file1);
    const b2 = await this.fileToBase64(file2);

    const prompt = `DEEP CONCEPTUAL FUSION: 
    - IMAGE 1 is the 'Structural Anchor': Use its layout, composition, and spatial geometry as the foundation.
    - IMAGE 2 is the 'Aesthetic Source': Extract its textures, lighting, material properties, and main subjects.
    - GOAL: Create a single NEW image that merges these two seamlessly. 
    ${instruction ? `- CUSTOM DIRECTION: ${instruction}` : "- DIRECTION: Synthesize both into a high-quality, professional artwork."}
    The output must be a perfectly rendered new scene. Output ONLY the image bytes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: b1, mimeType: file1.type } },
          { inlineData: { data: b2, mimeType: file2.type } },
          { text: prompt }
        ]
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!part?.inlineData) throw new Error("El motor de Remix falló al generar la fusión. Intenta con imágenes más contrastadas.");
    return `data:image/png;base64,${part.inlineData.data}`;
  }

  /**
   * Creación de Stickers (Ahora estáticos y gratuitos)
   */
  static async createSticker(prompt: string): Promise<string> {
    const ai = await this.getAI();
    
    const enhancedPrompt = `3D DIE-CUT STICKER: A high-quality, professional 3D sticker of '${prompt}'. 
    Style: Bold colors, thick white border outline, smooth glossy render, Pixar-style lighting, isolated on a clean plain neutral background. 
    Output ONLY the resulting image bytes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: enhancedPrompt }]
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!part?.inlineData) throw new Error("No se pudo generar el sticker.");
    return `data:image/png;base64,${part.inlineData.data}`;
  }

  static async analyzeImageForPrompt(file: File): Promise<string> {
    const ai = await this.getAI();
    const base64 = await this.fileToBase64(file);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType: file.type } },
          { text: "Detailed prompt for image generation focusing on composition, lighting, and style. Text only." }
        ]
      }
    });

    return response.text || "No se pudo extraer el prompt.";
  }

  static async changeStyle(file: File, styleName: string): Promise<string> {
    const ai = await this.getAI();
    const base64 = await this.fileToBase64(file);

    const prompt = `ARTISTIC STYLE TRANSFORMATION: Take the structure of this image and RE-IMAGINE it entirely in the ${styleName} aesthetic. Change colors, lighting, and textures completely to fit ${styleName}. Professional quality only. Output ONLY image bytes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType: file.type } },
          { text: prompt }
        ]
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!part?.inlineData) throw new Error("Error al aplicar el estilo.");
    return `data:image/png;base64,${part.inlineData.data}`;
  }
}
