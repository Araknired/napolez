export type Snowflake = {
  id: number;
  left: number;
  animationDuration: number;
  opacity: number;
  size: number;
}

export type CocaColaAssets = {
  watermark: string;
  logo: string;
  smallCan: string;
  santaClaus: string;
}

export type AnimationDelays = {
  logo: string;
  title: string;
  subtitle: string;
  button: string;
  santa: string;
  bubble1: string;
  bubble2: string;
  bubble3: string;
}

export type CocaColaContent = {
  mainTitle: string[];
  subtitle: string;
  ctaButtonText: string;
  websiteUrl: string;
}

export type CocaColaConfig = {
  assets: CocaColaAssets;
  animationDelays: AnimationDelays;
  content: CocaColaContent;
  snowflakeCount: number;
}