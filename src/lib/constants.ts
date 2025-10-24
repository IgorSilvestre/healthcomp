export const PURPOSES = [
  "dor",
  "nausea",
  "antibiotico",
  "diarreia",
  "estomago",
  "outro",
] as const;

export type Purpose = typeof PURPOSES[number];
