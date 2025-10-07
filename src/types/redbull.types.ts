export interface CanData {
  id: number;
  image: string;
  name: string;
  description: string;
  features: string[];
  color: string;
  className: string;
  glowColor: string;
  energy?: number;
  badge?: string;
}

export interface WaterDrop {
  id: number;
  size: number;
  top: number;
  left: number;
  opacity: number;
  blur: number;
}