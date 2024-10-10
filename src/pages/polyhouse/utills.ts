const SensorUnits: { [key: string]: string } = {
  Celcius: "°C",
  Percentage: "%",
};

export const getSensorUnit = (unit: string | null) => {
  if (!unit) return unit;
  return SensorUnits[unit] || unit;
};
