import { CSSProperties } from "react";

export type GroupNode = {
  type: 'group';
  data: { label: string };
  style: CSSProperties;
  position: { x: number; y: number; };
}