
export enum ToolType {
  ENHANCE = 'ENHANCE',
  FUSION = 'FUSION',
  PROMPT_GEN = 'PROMPT_GEN',
  MOTION_GEN = 'MOTION_GEN',
  CREATION = 'CREATION',
  STYLE = 'STYLE',
  STICKER = 'STICKER'
}

export type PromptEngine = 'NATIVO' | 'NANO_BANANA' | 'MIDJOURNEY_GROK' | 'DALLE_3' | 'STABLE_DIFFUSION' | 'META_AI';

export interface GenerationResult {
  url: string;
  type?: 'image' | 'video';
  prompt?: string;
  metadata?: any;
}

export interface AppState {
  activeTool: ToolType;
  isProcessing: boolean;
  result: GenerationResult | null;
  error: string | null;
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  previewColor: string;
}

export interface EngineOption {
  id: PromptEngine;
  name: string;
  description: string;
  icon: string;
}
