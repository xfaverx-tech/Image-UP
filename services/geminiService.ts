
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static async getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async ensureProKey() {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
    }
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

  static async enhanceImage(file: File): Promise<string> {
    await this.ensureProKey();
    const ai = await this.getAI();
    const base64 = await this.fileToBase64(file);
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType: file.type } },
          { text: "Enhance this image to ultra-high resolution. Improve clarity, details, and remove any noise. Output the final high-quality version." }
        ]
      },
      config: {
        imageConfig: { imageSize: "4K", aspectRatio: "1:1" }
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!part?.inlineData) throw new Error("No se pudo generar la imagen mejorada.");
    return `data:image/png;base64,${part.inlineData.data}`;
  }

  static async editImage(file: File, instruction: string): Promise<string> {
    const ai = await this.getAI();
    const base64 = await this.fileToBase64(file);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType: file.type } },
          { text: instruction }
        ]
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!part?.inlineData) throw new Error("No se pudo editar la imagen.");
    return `data:image/png;base64,${part.inlineData.data}`;
  }

  static async applyStyle(file: File, styleName: string): Promise<string> {
    return this.editImage(file, `Apply a ${styleName} professional photographic style to this image. Keep the subject identical but change the mood and color grading.`);
  }

  static async createSticker(prompt: string): Promise<string> {
    await this.ensureProKey();
    const ai = await this.getAI();
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `3D animated sticker of ${prompt}, white thick border, isolated on transparent-looking background, loopable animation, cute and vibrant`,
      config: { resolution: '720p', aspectRatio: '1:1' }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      // @ts-ignore
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
