export enum AppScreen {
  SPLASH = 'SPLASH',
  ONBOARDING = 'ONBOARDING',
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  EDITOR = 'EDITOR',
  CHAT = 'CHAT',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}

export enum BackgroundColor {
  WHITE = 'White',
  BLUE = 'Blue',
  RED = 'Red',
  BLACK = 'Black',
  TRANSPARENT = 'Transparent'
}

export interface HistoryItem {
  id: string;
  thumbnail: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export const ASPECT_RATIOS: AspectRatio[] = ["1:1", "3:4", "4:3", "9:16", "16:9"];