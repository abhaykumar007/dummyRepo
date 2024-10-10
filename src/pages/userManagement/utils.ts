const alphabetToColor: { [key: string]: string } = {
  a: "#FF6347", // Tomato
  b: "#7265e6", // Sapphire Blue
  c: "#FF4500", // OrangeRed
  d: "#00a2ae", // Teal
  e: "#FFD700", // Gold
  f: "#6c64e6", // Light Sapphire Blue
  g: "#ADFF2F", // GreenYellow
  h: "#00b2be", // Light Teal
  i: "#FF69B4", // HotPink
  j: "#6363e6", // Periwinkle
  k: "#FFA500", // Orange
  l: "#00c2ce", // Turquoise
  m: "#8A2BE2", // BlueViolet
  n: "#5a5ae6", // Cornflower Blue
  o: "#20B2AA", // LightSeaGreen
  p: "#00d2de", // Light Turquoise
  q: "#7FFF00", // Chartreuse
  r: "#5151e6", // Royal Blue
  s: "#DC143C", // Crimson
  t: "#00e2ee", // Bright Turquoise
  u: "#8B4513", // SaddleBrown
  v: "#4848e6", // Medium Royal Blue
  w: "#6B8E23", // OliveDrab
  x: "#00f2fe", // Bright Cyan
  y: "#D2691E", // Chocolate
  z: "#3f3fe6", // Medium Blue
};

const rolesToColor: { [key: string]: string } = {
  ADMIN: "red",
  FARM_MANAGER: "green",
  AGRINOMIST: "blue",
  VIEWER: "purple",
  OWNER: "orange",
};

export const rolesToLabel: { [key: string]: string } = {
  ADMIN: "Admin",
  FARM_MANAGER: "Farm Manager",
  AGRONOMIST: "Agronomist",
  VIEWER: "Viewer",
  OWNER: "Owner",
}

export const roles = [
  {
    label: "Admin",
    value: "ADMIN",
  },
  {
    label: "Owner",
    value: "OWNER",
  },
  {
    label: "Farm Manager",
    value: "FARM_MANAGER",
  },
  {
    label: "Agronomist",
    value: "AGRONOMIST",
  },
  {
    label: "Viewer",
    value: "VIEWER",
  },
];

export const getRoleColor = (role: string): string => {
  return rolesToColor[role] || "blue";
};

export const getAlphabetColor = (alphabet: string): string => {
  if (!alphabet) {
    return "blue";
  }
  return alphabetToColor[alphabet.toLowerCase()] 
};
