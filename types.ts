
export enum ToolType {
  ENHANCE = 'ENHANCE',
  EDIT = 'EDIT',
  STYLE = 'STYLE',
  STICKER = 'STICKER'
}

export interface GenerationResult {
  url?: string;
  type?: 'image' | 'video';
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
  previewColor: string;
}
