export enum AspectRatio {
  Square = "1:1",
  Portrait = "3:4",
  Landscape = "4:3",
  Wide = "16:9",
  Tall = "9:16",
}

export interface GenerationSettings {
  aspectRatio: AspectRatio;
  temperature: number; // For "creativity"
}

export interface GeneratedImage {
  id: string;
  dataUrl: string; // Base64 or URL
  prompt: string;
  originalImage?: string; // If it was an edit/variation
  timestamp: number;
  settings: GenerationSettings;
}

export interface HistoryItem extends GeneratedImage {}

export type Theme = 'light' | 'dark';