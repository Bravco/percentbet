export const formatVolume = (volume: number) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(volume) + " Vol.";
};

export const formatChance = (chance: number) => {
  const value = Math.round(chance * 100);
  return value <= 0 ? ">1%" : `${value}%`;
};

export const formatROI = (chance: number) => {
  const value = Math.round((1 - chance) / chance * 100);
  return value <= 0 ? ">1%" : `+${value}%`;
};

export const formatYesPrice = (chance: number) => {
  return `Yes ${(chance * 100).toFixed(1)}¢`;
};

export const formatNoPrice = (chance: number) => {
  return `No ${((1-chance) * 100).toFixed(1)}¢`;
};

export const formatDifference = (difference: number) => {
  return `${Math.abs(difference)}%`;
};

export const formatEdge = (difference: number) => {
  return "+" + formatDifference(difference);
};