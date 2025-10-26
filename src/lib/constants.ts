export const PURPOSES = [
  "dor",
  "nausea",
  "antibiotico",
  "diarreia",
  "estomago",
    "coração",
    "circulação",
  "outro",
] as const;

export type Purpose = (typeof PURPOSES)[number];
